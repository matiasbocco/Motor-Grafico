from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Shed, ChickenGroup, Food, FoodRecall, FoodDelivery, FoodReceipt, FoodProductionDelivery, Slaughter, Batch, Farm, Task
from .serializers import ShedSerializer, ChickenGroupSerializer, FoodSerializer, FoodProductionSerializer, FoodRecallSerializer, FoodDeliverySerializer, FoodReceiptSerializer, FarmSerializer
from rest_framework.response import Response
from users.models import User
from django_celery_beat.models import PeriodicTask, CrontabSchedule
from uuid import uuid4
import json
from datetime import datetime, timedelta
from rest_framework import status
from notifications.models import FarmNotification
from notifications.models import ProducerNotification
from exponent_server_sdk import PushClient, PushMessage

NOTIFICATION_USER = 'fran'

class FarmListAPIView(generics.ListAPIView):
    serializer_class = ShedSerializer
    permission_classes = [IsAuthenticated]

    queryset = Shed.objects.all()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()  # Obtener el queryset
        farms = []
        listed = []
        for shed in queryset:
            if shed.farm not in listed:
                listed.append(shed.farm)
                farms.append({'label': shed.farm.capitalize(), 'value': shed.farm})
        return Response(farms)

class ShedListAPIView(generics.ListAPIView):
    serializer_class = ShedSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Shed.objects.filter()

class GetFarmShedsListAPIView(generics.ListAPIView):
    serializer_class = ShedSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        farm = request.data.get('farm').lower()
        sheds = Shed.objects.filter(farm=farm)
        data = []
        for shed in sheds:
            data.append({
                'number': shed.number,
                'area': shed.area
            })
        return Response(data)

class ChickenGroupListAPIView(generics.ListAPIView):
    serializer_class = ChickenGroupSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        farm = request.data.get('farm')
        sheds = Shed.objects.filter(farm=farm)

        data = []
        
        for shed in sheds:
            groups = ChickenGroup.objects.filter(shed=shed)
            if groups:
                for group in groups:
                    if group.active:
                        data.append(group)
            else:
                data.append(shed)
        
        return data
    
class AllFarmsDataListAPIView(generics.ListAPIView):
    serializer_class = ChickenGroupSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        sheds = Shed.objects.all()

        data = []
        
        for shed in sheds:
            groups = ChickenGroup.objects.filter(shed=shed)
            if groups:
                for group in groups:
                    if group.active:
                        data.append({
                            'shed': shed.number,
                            'farm': shed.farm,
                            'quantity': group.quantity,
                            'mortality': group.mortality,
                        })
            else:
                data.append({
                    'shed': shed.number,
                    'farm': shed.farm,
                })
        
        return Response(data)

    
class FarmerChickenGroupListAPIView(generics.ListAPIView):
    serializer_class = ChickenGroupSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        farm = request.data.get('farm')
        print(farm)
        sheds = Shed.objects.filter(farm=farm)
        print(sheds)

        data = []
        
        for shed in sheds:
            groups = ChickenGroup.objects.filter(shed=shed, active=True)
            if groups:
                for group in groups:
                    data.append({
                        'shed': shed.number,
                        'farm': shed.farm,
                        'day_count': group.day_count,
                        'quantity': group.quantity,
                        'cabin': group.cabin,
                        'genetic_line': group.genetic_line,
                        'sex': group.sex,
                        'group_id': group.id,
                        'mortality': group.mortality,
                        'updated': group.updated,
                        })
            else:
                data.append({
                    'shed': shed.number,
                    'farm': shed.farm,
                })
        print(data)
        return Response(data) 

class NewChickenGroupAPIView(generics.ListAPIView):
    serializer_class = ChickenGroupSerializer
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        shed_data = request.data.get('shed')
        shed = Shed.objects.get(farm=shed_data['farm'], number=shed_data['number'])
        try:
            batch = Batch.objects.get(farm=shed.farm, active=True)
        except:
            message = {'title': 'Error', 'message': 'La carga de pollos no esta habilitada por ahora', 'status': 'error'}
            return Response(message)
        group = ChickenGroup(
            batch=batch,
            shed=shed,
            quantity=request.data.get('quantity'),
            cabin=request.data.get('cabin'),
            genetic_line=request.data.get('genetic_line'),
            sex=request.data.get('sex'),
        )

        group.save()
        batch.chiquens += int(group.quantity)
        batch.save()
        title = 'Nuevo ingreso de pollos en la granja {} galpón {}'.format(group.shed.farm.capitalize(), group.shed.number)
        user = User.objects.get(username=NOTIFICATION_USER)
        expo_token = user.push_token
        extra = None
        try:
            response = PushClient().publish(
                PushMessage(to=expo_token, body=title, data=extra)
            )
        except Exception as exc:
            print(f"Error al enviar la notificación: {exc}")
            print(expo_token, title, extra)
        data = {
            'shed': group.shed.number,
            'farm': group.shed.farm,
            'day_count': group.day_count,
            'quantity': group.quantity,
            'cabin': group.cabin,
            'genetic_line': group.genetic_line,
            'sex': group.sex,
            'group_id': group.id,
            'mortality': group.mortality,
            'updated': group.updated,
        }
        message = {'group': data, 'title': 'Grupo creado', 'message': f'Grupo añadido correctamente al galpón {group.shed.number}', 'status': 'success'}
        return Response(message)

class SetNotificationAPIView(generics.ListAPIView):
    serializer_class = ChickenGroupSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        group_day = request.data.get('group_day')
        username = request.data.get('username')
        user = User.objects.get(username=username)
        token = user.push_token
        title = 'Debe actualizar la informacion de un grupo de pollos'
        if group_day == 0:
            days = 4
        elif group_day == 4:
            days = 3
        elif group_day in [7, 14, 21, 28, 35, 42]:
            days = 7
        else:
            return
        today = datetime.now()
        notification_date = today + timedelta(days=days)
        schedule, _ = CrontabSchedule.objects.get_or_create(
            minute='0',
            hour='10',
            day_of_month=notification_date.day,
            month_of_year=notification_date.month,
        )
        PeriodicTask.objects.create(
            crontab=schedule,
            name = str(uuid4()),
            task='farms.tasks.send_notification',
            args=json.dumps([token, title])
        )

        return Response(status=status.HTTP_200_OK)

class SaveWeekDataAPIView(generics.ListAPIView):
    serializer_class = ChickenGroupSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        group = ChickenGroup.objects.get(id=request.data.get('group_id'))
        day = request.data.get('day')
        if day in [0, 1, 2, 3]:
            group.day_0_weight = request.data.get('weight')
            group.day_0_mortality = request.data.get('mortality')
            group.mortality += int(request.data.get('mortality'))
        elif day in [4, 5, 6]:
            group.day_4_weight = request.data.get('weight')
            group.day_4_mortality = request.data.get('mortality')
            group.mortality += int(request.data.get('mortality'))
        elif day in [7, 8, 9, 10, 11, 12, 13]:
            group.day_7_weight = request.data.get('weight')
            group.day_7_mortality = request.data.get('mortality')
            group.mortality += int(request.data.get('mortality'))
        elif day in [14, 15, 16, 17, 18, 19, 20]:
            group.day_14_weight = request.data.get('weight')
            group.day_14_mortality = request.data.get('mortality')
            group.mortality += int(request.data.get('mortality'))
        elif day in [21, 22, 23, 24, 25, 26, 27]:
            group.day_21_weight = request.data.get('weight')
            group.day_21_mortality = request.data.get('mortality')
            group.mortality += int(request.data.get('mortality'))
        elif day in [28, 29, 30, 31, 32, 33, 34]:
            group.day_28_weight = request.data.get('weight')
            group.day_28_mortality = request.data.get('mortality')
            group.mortality += int(request.data.get('mortality'))
        elif day in [35, 36, 37, 38, 39, 40, 41]:
            group.day_35_weight = request.data.get('weight')
            group.day_35_mortality = request.data.get('mortality')
            group.mortality += int(request.data.get('mortality'))
        elif day in [42, 43, 44, 45, 46, 47, 48]:
            group.day_42_weight = request.data.get('weight')
            group.day_42_mortality = request.data.get('mortality')
            group.mortality += int(request.data.get('mortality'))
        elif day in [49, 50, 51, 52, 53, 54, 55]:
            group.day_49_weight = request.data.get('weight')
            group.day_49_mortality = request.data.get('mortality')
            group.mortality += int(request.data.get('mortality'))

        group.updated = True
        group.save()

        try:
            notification = FarmNotification.objects.get(group=group.id)
            notification.done = True
            notification.save()
        except:
            pass

        data = {
            'day_0_weight': group.day_0_weight,
            'day_4_weight': group.day_4_weight,
            'day_7_weight': group.day_7_weight,
            'day_14_weight': group.day_14_weight,
            'day_21_weight': group.day_21_weight,
            'day_28_weight': group.day_28_weight,
            'day_35_weight': group.day_35_weight,
            'day_42_weight': group.day_42_weight,
            'day_49_weight': group.day_49_weight,
            'day_0_mortality': group.day_0_mortality,
            'day_4_mortality': group.day_4_mortality,
            'day_7_mortality': group.day_7_mortality,
            'day_14_mortality': group.day_14_mortality,
            'day_21_mortality': group.day_21_mortality,
            'day_28_mortality': group.day_28_mortality,
            'day_35_mortality': group.day_35_mortality,
            'day_42_mortality': group.day_42_mortality,
            'day_49_mortality': group.day_49_mortality,
        }

        return Response(data)
    
class GetFarmDataAPIView(generics.ListAPIView):
    serializer_class = ChickenGroupSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        farm = request.data.get('farm')
        sheds = Shed.objects.filter(farm=farm)
        data = []
        for shed in sheds:
            groups = ChickenGroup.objects.filter(shed=shed)
            if groups:
                for group in groups:
                    if group.active:
                        data.append({
                            'shed': shed.number,
                            'day_count': group.day_count,
                            'quantity': group.quantity,
                            'cabin': group.cabin,
                            'genetic_line': group.genetic_line,
                            'sex': group.sex,
                            'group_id': group.id,
                            'mortality': group.mortality,
                            'area': group.area,
                            'initial_date': group.initial_date.isoformat(),
                            'day_0_weight': group.day_0_weight,
                            'day_4_weight': group.day_4_weight,
                            'day_7_weight': group.day_7_weight,
                            'day_14_weight': group.day_14_weight,
                            'day_21_weight': group.day_21_weight,
                            'day_28_weight': group.day_28_weight,
                            'day_35_weight': group.day_35_weight,
                            'day_42_weight': group.day_42_weight,
                            'day_49_weight': group.day_49_weight,
                            'day_0_mortality': group.day_0_mortality,
                            'day_4_mortality': group.day_4_mortality,
                            'day_7_mortality': group.day_7_mortality,
                            'day_14_mortality': group.day_14_mortality,
                            'day_21_mortality': group.day_21_mortality,
                            'day_28_mortality': group.day_28_mortality,
                            'day_35_mortality': group.day_35_mortality,
                            'day_42_mortality': group.day_42_mortality,
                            'day_49_mortality': group.day_49_mortality,
                            })
            else:
                data.append({
                    'shed': shed.number,
                })
        return Response(data)
    
class FoodProductionDeliveryListAPIView(generics.ListAPIView):
    serializer_class = FoodSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        food_type = request.data.get('food_type')
        quantity = request.data.get('quantity')
        trucker = request.data.get('trucker')
        producer = request.data.get('producer')
        delivery = FoodProductionDelivery(
            food_type=food_type,
            quantity=quantity,
            trucker=trucker,
            producer=producer,
        )
        delivery.save()
        message = {'title': 'Entrega registrada', 'message': 'Entrega registrada exitosamente a las {}'.format(delivery.date_time.strftime('%H:%M:%S')), 'status': 'success'}
        return Response(message)
    
class FoodRecallListAPIView(generics.ListAPIView):
    serializer_class = FoodRecallSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        food_type = request.data.get('food_type')
        quantity = request.data.get('quantity')
        remit_number = request.data.get('remit_number')
        recall = FoodRecall(
            food_type=food_type,
            quantity=quantity,
            remit_number=remit_number,
        )
        recall.save()
        delivery = FoodProductionDelivery.objects.get(remit_number=remit_number)
        delivery.confirmed = True
        delivery.save()
        message = {'title': 'Retiro registrado', 'message': 'Retiro registrado exitosamente a las {}'.format(recall.date_time.strftime('%H:%M:%S')), 'status': 'success'}
        return Response(message)

class FoodDeliveryListAPIView(generics.ListAPIView):
    serializer_class = FoodDeliverySerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        farm = request.data.get('farm')
        food_type = request.data.get('food_type')
        quantity = request.data.get('quantity')
        receiver = request.data.get('receiver')
        remit_number = request.data.get('remit_number')
        try:
            recall = FoodRecall.objects.get(remit_number=remit_number)
        except:
            recall = None
        if recall:
            if recall.date_time.date() == datetime.now().date():
                delivery = FoodDelivery(
                    farm=farm,
                    food_type=food_type,
                    quantity=quantity,
                    receiver=receiver,
                    remit_number=remit_number,
                )
                delivery.save()
                recall.confirmed = True
                recall.save()
                message = {'title': 'Entrega registrada', 'message': 'Entrega registrada exitosamente a las {}'.format(delivery.date_time.strftime('%H:%M:%S')), 'status': 'success'}
                return Response(message)
            else:
                message = {'title':'Entrega no registrada', 'message': 'No hay un retiro registrado en el día de hoy con ese número de remito', 'status': 'error'}
                return Response(message)
        else:
            message = {'title':'Entrega no registrada' ,'message': 'El número de remito no coincide con ningún retiro', 'status': 'error'}
            return Response(message)

class FoodReceiptListAPIView(generics.ListAPIView):
    serializer_class = FoodReceiptSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        farm = request.data.get('farm')
        food_type = request.data.get('food_type')
        quantity = request.data.get('quantity')
        provider = request.data.get('provider')
        remit_number = request.data.get('remit_number')
        try:
            delivery = FoodDelivery.objects.get(remit_number=remit_number)
        except:
            delivery = None
        if delivery:
            if delivery.date_time.date() == datetime.now().date():
                if food_type != delivery.food_type:
                    message = {'title': 'Ingreso no registrado', 'message': 'El campo "tipo de alimento" no coincide con la entrega', 'status': 'error'}
                    return Response(message)
                receipt = FoodReceipt(
                    farm=farm,
                    food_type=food_type,
                    quantity=quantity,
                    provider=provider,
                    remit_number=remit_number,
                )
                receipt.confirmed = True
                receipt.save()
                delivery.confirmed = True
                delivery.save()
                try:
                    batch = Batch.objects.get(farm=farm, active=True)
                except:
                    message = {'title': 'Ingreso no registrado', 'message': 'No hay una carga de pollos activa', 'status': 'error'}
                food = Food(
                    batch=batch,
                    production=FoodProductionDelivery.objects.get(remit_number=remit_number),
                    recall=FoodRecall.objects.get(remit_number=remit_number),
                    delivery=delivery,
                    receipt=receipt,
                )
                food.save()
                title = 'Nuevo ingreso de alimento en la granja {}'.format(farm.capitalize())
                user = User.objects.get(username=NOTIFICATION_USER)
                expo_token = user.push_token
                extra = None
                try:
                    response = PushClient().publish(
                    PushMessage(to=expo_token, body=title, data=extra)
                    )
                except Exception as exc:
                    print(f"Error al enviar la notificación: {exc}")
                    print(expo_token, title, extra)
                batch.food_quantity += int(quantity)
                batch.save()
                message = {'title': 'Ingreso registrado', 'message': 'Ingreso registrado exitosamente a las {}'.format(receipt.date_time.strftime('%H:%M:%S')), 'status': 'success'}
                return Response(message)
            else:
                message = {'title': 'Ingreso no registrado', 'message': 'No hay una entrega registrada en el día de hoy con ese número de remito', 'status': 'error'}
                return Response(message)
        else:
            message = {'title': 'Ingreso no registrado', 'message': 'El número de remito no coincide con ninguna entrega', 'status': 'error'}
            return Response(message)
        
class TableDataAPIView(generics.ListAPIView):
    serializer_class = ChickenGroupSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        id = request.data.get('id')
        group = ChickenGroup.objects.get(id=id)
        data = {
            'day_0_weight': group.day_0_weight,
            'day_4_weight': group.day_4_weight,
            'day_7_weight': group.day_7_weight,
            'day_14_weight': group.day_14_weight,
            'day_21_weight': group.day_21_weight,
            'day_28_weight': group.day_28_weight,
            'day_35_weight': group.day_35_weight,
            'day_42_weight': group.day_42_weight,
            'day_49_weight': group.day_49_weight,
            'day_0_mortality': group.day_0_mortality,
            'day_4_mortality': group.day_4_mortality,
            'day_7_mortality': group.day_7_mortality,
            'day_14_mortality': group.day_14_mortality,
            'day_21_mortality': group.day_21_mortality,
            'day_28_mortality': group.day_28_mortality,
            'day_35_mortality': group.day_35_mortality,
            'day_42_mortality': group.day_42_mortality,
            'day_49_mortality': group.day_49_mortality,
        }
        return Response(data)

class FarmNotificationsAPIView(generics.ListAPIView):
    serializer_class = ChickenGroupSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        farm = request.data.get('farm')
        notifications = FarmNotification.objects.filter(farm=farm)
        data = []
        for notification in notifications:
            data.append({
                'title': notification.title,
                'body': notification.body,
                'date_time': notification.date_time.strftime('%d-%m %H:%M'),
                'done': notification.done,
            })
        return Response(data)
    
class GetProductionDeliveryAPIView(generics.ListAPIView):
    serializer_class = FoodSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        trucker = request.data.get('trucker')
        deliveries = FoodProductionDelivery.objects.filter(trucker=trucker)
        data = []
        for delivery in deliveries:
            if (delivery.date_time.date() == datetime.now().date()) and (delivery.confirmed == False) and (delivery.status == 'pending'):
                producer = User.objects.get(username=delivery.producer)
                fname = producer.first_name.capitalize()
                lname = producer.last_name.capitalize()
                data.append({
                    'date_time': delivery.date_time.strftime('%d-%m %H:%M'),
                    'food_type': delivery.food_type.capitalize(),
                    'producer': fname + ' ' + lname,
                    'remit_number': delivery.remit_number,
                })
        return Response(data)
    
class GetRecallAPIView(generics.ListAPIView):
    serializer_class = FoodSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        trucker = request.data.get('trucker')
        try:
            deliveries = FoodProductionDelivery.objects.filter(trucker=trucker)
        except:
            deliveries = None
        if deliveries:
            data = []
            for delivery in deliveries:
                try:
                    recalls = FoodRecall.objects.filter(remit_number=delivery.remit_number)
                except:
                    recalls = None
                if recalls:
                    for recall in recalls:
                        if (recall.date_time.date() == datetime.now().date()) and (recall.confirmed == False):
                            data.append({
                                'date_time': recall.date_time.strftime('%d-%m %H:%M'),
                                'food_type': recall.food_type,
                                'quantity': recall.quantity,
                                'remit_number': recall.remit_number,
                            })
                else:
                    data = []
        else:
            data = []
        return Response(data)
    
class GetDeliveriesAPIView(generics.ListAPIView):
    serializer_class = FoodSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        farmer = request.data.get('farmer')
        try:
            deliveries = FoodDelivery.objects.filter(receiver=farmer)
        except:
            deliveries = None
        if deliveries:
            data = []
            for delivery in deliveries:
                if (delivery.date_time.date() == datetime.now().date()) and (delivery.confirmed == False):
                    production = FoodProductionDelivery.objects.get(remit_number=delivery.remit_number)
                    if production.trucker != '-':
                        trucker = User.objects.get(username=production.trucker)
                        trucker_name = trucker.first_name.capitalize() + ' ' + trucker.last_name.capitalize()
                    else:
                        trucker_name = production.trucker
                    data.append({
                        'date_time': delivery.date_time.strftime('%d-%m %H:%M'),
                        'food_type': delivery.food_type,
                        'quantity': delivery.quantity,
                        'remit_number': delivery.remit_number,
                        'trucker': trucker_name,
                    })
        else:
            data = []
        return Response(data)

class RejectProductionDelivery(generics.ListAPIView):
    serializer_class = FoodSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        remit_number = request.data.get('remit_number')
        reason = request.data.get('reason')
        producer = request.data.get('producer')
        delivery = FoodProductionDelivery.objects.get(remit_number=remit_number)
        delivery.status = 'rejected'
        delivery.reason = reason
        delivery.save()
        message = {'title': 'Entrega rechazada'}

        notification = ProducerNotification()
        notification.title = 'Entrega rechazada'
        notification.body = 'La entrega con número de remito {} ha sido rechazada por el transportista'.format(remit_number)
        notification.username = producer
        notification.save()

        title = 'La entrega con número de remito {} ha sido rechazada por el transportista'.format(remit_number)
        user = User.objects.get(username=NOTIFICATION_USER)
        expo_token = user.push_token
        extra = None
        try:
            response = PushClient().publish(
                PushMessage(to=expo_token, body=title, data=extra)
            )
        except Exception as exc:
            print(f"Error al enviar la notificación: {exc}")
            print(expo_token, title, extra)

        return Response(message)
    
class ProducerNotificationsAPIView(generics.ListAPIView):
    serializer_class = ChickenGroupSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        username = request.data.get('username')
        notifications = ProducerNotification.objects.filter(username=username)
        data = []
        for notification in notifications:
            data.append({
                'title': notification.title,
                'body': notification.body,
                'date_time': notification.date_time.strftime('%d-%m %H:%M'),
            })
        return Response(data)
    
class SlaughterAPIView(generics.ListAPIView):
    serializer_class = ChickenGroupSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        farm = request.data.get('farm')
        shed = request.data.get('shed')
        quantity = request.data.get('quantity')
        tare = request.data.get('tare')
        gross_weight = request.data.get('gross_weight')
        truck = request.data.get('truck')
        trucker = request.data.get('trucker')
        client = request.data.get('client').lower()
        try:
            batch = Batch.objects.get(farm=farm, active=True)
        except Batch.DoesNotExist:
            message = {'title': 'Error', 'message': 'No existe un lote activo para la granja especificada', 'status': 'error'}
            return Response(message)
        slaughter = Slaughter(
            batch=batch,
            farm=farm,
            shed=shed,
            quantity=quantity,
            tare=tare,
            gross_weight=gross_weight,
            truck=truck,
            trucker=trucker,
            client=client,
        )
        slaughter.save()
        title = 'Nueva carga de faena en la granja {} galpón {}'.format(farm.capitalize(), shed)
        user = User.objects.get(username=NOTIFICATION_USER)
        expo_token = user.push_token
        extra = None
        try:
            response = PushClient().publish(
                PushMessage(to=expo_token, body=title, data=extra)
            )
        except Exception as exc:
            print(f"Error al enviar la notificación: {exc}")
            print(expo_token, title, extra)
        batch.slaughter_chiquens += int(quantity)
        batch.slaughter_chiquens_weight += float(gross_weight)
        batch.save()
        message = {'title': 'Carga de faena registrada', 'message': 'Carga de faena registrada exitosamente a las {}'.format(slaughter.date_time.strftime('%H:%M:%S')), 'status': 'success'}
        return Response(message)

class GasIncomeAPIView(generics.ListAPIView):
    serializer_class = ChickenGroupSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        farm = request.data.get('farm')
        gas = request.data.get('gas')
        try:
            batch = Batch.objects.get(farm=farm, active=True)
        except:
            message = {'title': 'Error', 'message': 'No existe un lote activo para la granja especificada', 'status': 'error'}
            return Response(message)
        batch.gas += float(gas)
        batch.save()
        title = 'Nueva carga de gas en la granja {} ({} L)'.format(farm.capitalize())
        user = User.objects.get(username=NOTIFICATION_USER)
        expo_token = user.push_token
        extra = None
        try:
            response = PushClient().publish(
                PushMessage(to=expo_token, body=title, data=extra)
            )
        except Exception as exc:
            print(f"Error al enviar la notificación: {exc}")
            print(expo_token, title, extra)
        message = {'title': 'Ingreso de gas registrado', 'message': 'Ingreso de gas registrado exitosamente a las {}'.format(datetime.now().strftime('%H:%M:%S')), 'status': 'success'}
        return Response(message)
    
class BatchInitAPIView(generics.ListAPIView):
    serializer_class = ChickenGroupSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        farm = request.data.get('farm').lower()
        try:
            batch = Batch.objects.get(farm=farm, active=True)
            message = {'title': 'Error', 'message': 'Ya existe un lote activo para la granja especificada', 'status': 'error'}
            return Response(message)
        except:
            pass
        batch = Batch(
            farm=farm,
        )
        batch.save()
        message = {'title': 'Lote iniciado', 'message': 'Lote iniciado exitosamente a las {} para la granja {}'.format(datetime.now().strftime('%H:%M:%S'), farm), 'status': 'success'}
        return Response(message)

class BatchFinishAPIView(generics.ListAPIView):
    serializer_class = ChickenGroupSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        farm = request.data.get('farm').lower()
        try:
            batch = Batch.objects.get(farm=farm, active=True)
        except:
            message = {'title': 'Error', 'message': 'No existe un lote activo para la granja especificada', 'status': 'error'}
            return Response(message)
        batch.active = False
        batch.finish_date = datetime.now()
        groups = ChickenGroup.objects.filter(batch=batch)
        partial = 0
        for group in groups:
            chiquens = group.quantity - group.mortality
            partial += chiquens * group.day_count
            group.active = False
            group.save()
        batch.edad_promedio = partial / batch.slaughter_chiquens
        batch.save()
        message = {'title': 'Lote finalizado', 'message': 'Lote finalizado exitosamente a las {} para la granja {}'.format(datetime.now().strftime('%H:%M:%S'), farm), 'status': 'success'}
        return Response(message)
    
class DeleteBatchAPIView(generics.ListAPIView):
    serializer_class = ChickenGroupSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        farm = request.data.get('farm').lower()
        try:
            batch = Batch.objects.get(farm=farm, active=True)
        except:
            message = {'title': 'Error', 'message': 'No existe lote activo para esta granja', 'status': 'error'}
            return Response(message)
        batch.delete()
        message = {'title': 'Lote eliminado', 'message': 'Lote eliminado exitosamente a las {}'.format(datetime.now().strftime('%H:%M:%S')), 'status': 'success'}
        return Response(message)

class GetFoodAPIView(generics.ListAPIView):
    serializer_class = ChickenGroupSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            batchs = Batch.objects.filter(active=True)
        except:
            message = {'title': 'Error', 'message': 'No hay lotes activo', 'status': 'error'}
            return Response(message)
        data = []
        for batch in batchs:
            pre_starter_quantity = 0
            starter_quantity = 0
            terminator_quantity = 0
            last_week_quantity = 0
            try:
                food = Food.objects.filter(batch=batch)
            except:
                message = 'No hay alimentos registrados para este lote'
                data.append({
                    'farm': batch.farm, 
                    'quantity': message
                })
                continue
            for f in food:
                if f.production.food_type.lower() == 'preiniciador':
                    pre_starter_quantity += f.receipt.quantity
                elif f.production.food_type.lower() == 'iniciador':
                    starter_quantity += f.receipt.quantity
                elif f.production.food_type.lower() == 'terminador':
                    terminator_quantity += f.receipt.quantity
                elif f.production.food_type.lower() == 'ultima semana':
                    last_week_quantity += f.receipt.quantity
            data.append({
                'farm': batch.farm,
                'pre_starter_quantity': pre_starter_quantity,
                'starter_quantity': starter_quantity,
                'terminator_quantity': terminator_quantity,
                'last_week_quantity': last_week_quantity,
            })
        return Response(data)


class GetFarmFoodAPIView(generics.ListAPIView):
    serializer_class = ChickenGroupSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        farm = request.data.get('farm')
        try:
            batch = Batch.objects.filter(active=True, farm=farm).get()
        except:
            message = {'title': 'Error', 'message': 'No existe lote activo para esta granja', 'status': 'error'}
            return Response(message)
        data = []
        food = Food.objects.filter(batch=batch)
        pre_starter_quantity = 0
        starter_quantity = 0
        terminator_quantity = 0
        last_week_quantity = 0
        for f in food:
            production_data = FoodProductionSerializer(f.production).data
            recall_data = FoodRecallSerializer(f.recall).data
            delivery_data = FoodDeliverySerializer(f.delivery).data
            receipt_data = FoodReceiptSerializer(f.receipt).data
            if f.production.producer != '-':
                producer = User.objects.get(username=f.production.producer)
                producer_name = producer.first_name.capitalize() + ' ' + producer.last_name.capitalize()
                trucker_name = f.receipt.provider
            else:
                producer_name = f.production.producer
                trucker_name = f.receipt.provider
            farmer = User.objects.get(username=f.delivery.receiver)
            farmer_name = farmer.first_name.capitalize() + ' ' + farmer.last_name.capitalize()
            data.append({
                'production': production_data,
                'production_date': f.production.date_time.strftime('%d-%m %H:%M:%S'),
                'producer': producer_name,
                'recall': recall_data,
                'recall_date': f.recall.date_time.strftime('%d-%m %H:%M:%S'),
                'delivery': delivery_data,
                'delivery_date': f.delivery.date_time.strftime('%d-%m %H:%M:%S'),
                'trucker': trucker_name,
                'receipt': receipt_data,
                'receipt_date': f.receipt.date_time.strftime('%d-%m %H:%M:%S'),
                'farmer': farmer_name,
            })
            if f.production.food_type.lower() == 'preiniciador':
                pre_starter_quantity += f.receipt.quantity
            elif f.production.food_type.lower() == 'iniciador':
                starter_quantity += f.receipt.quantity
            elif f.production.food_type.lower() == 'terminador':
                terminator_quantity += f.receipt.quantity
            elif f.production.food_type.lower() == 'ultima semana':
                last_week_quantity += f.receipt.quantity
        data.append({
            'pre_starter_quantity': pre_starter_quantity,
            'starter_quantity': starter_quantity,
            'terminator_quantity': terminator_quantity,
            'last_week_quantity': last_week_quantity,
        })
        return Response(data)
            
class GetActiveBatchsAPIView(generics.ListAPIView):
    serializer_class = ChickenGroupSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            batchs = Batch.objects.filter(active=True)
        except:
            message = {'title': 'Error', 'message': 'No hay lotes activos', 'status': 'error'}
            return Response(message)
        data = []
        for batch in batchs:
            data.append({
                'farm': batch.farm.capitalize(),
                'gas': batch.gas,
                'date': batch.initial_date.strftime('%d-%m-%Y'),
                'chiquens': batch.chiquens,
                'slaughter_chiquens': batch.slaughter_chiquens,
                'slaughter_chiquens_weight': batch.slaughter_chiquens_weight,
                'food_quantity': batch.food_quantity,
            })
        return Response(data)

class GetSlaughtersAPIView(generics.ListAPIView):
    serializer_class = ChickenGroupSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        farm = request.data.get('farm').lower()
        try:
            slaughters = Slaughter.objects.filter(farm=farm)
        except:
            message = {'title': 'Error', 'message': 'No hay cargas de faena registradas', 'status': 'error'}
            return Response(message)
        data = []
        for slaughter in slaughters:
            data.append({
                'shed': slaughter.shed,
                'quantity': slaughter.quantity,
                'gross_weight': slaughter.gross_weight,
                'truck': slaughter.truck,
                'trucker': slaughter.trucker,
                'date_time': slaughter.date_time.strftime('%d-%m %H:%M:%S'),
                'client': slaughter.client,
            })
        return Response(data)

class GetLastSlaughtersAPIView(generics.ListAPIView):
    serializer_class = ShedSerializer
    permission_classes = [IsAuthenticated]
    def post(self, request):
        period = datetime.now() - timedelta(days=60)
        slaughters = Slaughter.objects.filter(date_time__gte=period)
        data = []
        for slaughter in slaughters:
            data.append({
                'truck': slaughter.truck,
                'farm': slaughter.farm,
                'shed': slaughter.shed,
                'age': slaughter.batch.edad_promedio,
                'client': slaughter.client,
                'chiquens': slaughter.quantity,
                'weight': slaughter.net_weight,
                'average_weight': round(slaughter.average_weight, 2),
                'date': slaughter.date_time.strftime('%d/%m/%Y'),
            })
        return Response(data)
    
class NewFarmAPIView(generics.ListAPIView):
    serializer_class = ShedSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        farm = request.data.get('farm').lower()
        new_farm = Farm(
            name=farm,
        )
        new_farm.save()
        message = {'title': 'Granja creada', 'message': 'Granja creada exitosamente', 'status': 'success'}
        return Response(message)

class GetFarmsAPIView(generics.ListAPIView):
    serializer_class = ShedSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        farms = Farm.objects.all()
        data = []
        for farm in farms:
            sheds = Shed.objects.filter(farm=farm.name)
            total = 0
            for shed in sheds:
                total += 1
            data.append({
                'name': farm.name.capitalize(),
                'sheds': total,
            })
        return Response(data)

class EditShedAreaAPIView(generics.ListAPIView):
    serializer_class = ShedSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        farm = request.data.get('farm').lower()
        number = request.data.get('number')
        shed = Shed.objects.get(farm=farm, number=number)
        area = int(request.data.get('area'))
        shed.area = area
        shed.save()
        return Response()

class NewShedAPIView(generics.ListAPIView):
    serializer_class = ShedSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        farm = request.data.get('farm').lower()
        number = request.data.get('number')
        area = int(request.data.get('area'))
        farm_obj = Farm.objects.get(name=farm)
        new_shed = Shed(
            farm=farm,
            number=number,
            area=area,
        )
        farm_obj.area += area
        farm_obj.save()
        new_shed.save()
        return Response()

class DeleteShedAPIView(generics.ListAPIView):
    serializer_class = ShedSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        farm = request.data.get('farm').lower()
        number = request.data.get('number')
        shed = Shed.objects.get(farm=farm, number=number)
        shed.delete()
        return Response()

class GetStatisticsAPIView(generics.ListAPIView):
    serializer_class = ChickenGroupSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            batchs = Batch.objects.filter(active=False)
        except:
            return Response()
        data = []
        for batch in batchs:
            farm = Farm.objects.get(name=batch.farm)
            consumo_ave = batch.food_quantity / batch.slaughter_chiquens
            mortandad = 100 - ((batch.slaughter_chiquens / batch.chiquens) * 100)
            conversion = batch.food_quantity / batch.slaughter_chiquens_weight # preguntar
            peso_promedio = batch.slaughter_chiquens_weight / batch.slaughter_chiquens
            peso_conversion = peso_promedio / conversion
            crecimiento_diario = peso_promedio / batch.edad_promedio
            fep = ((peso_promedio * ((batch.slaughter_chiquens / batch.chiquens) * 100)) / (conversion * batch.edad_promedio)) * 100
            aves_area = batch.slaughter_chiquens / farm.area
            kg_area = batch.slaughter_chiquens_weight / farm.area
            data.append({
                'farm': farm.name,
                'batch': batch.initial_date.strftime('%d-%m-%Y'),
                'consumo_ave': consumo_ave,
                'mortandad': mortandad,
                'conversion': conversion,
                'edad_promedio': batch.edad_promedio,
                'peso_promedio': peso_promedio,
                'peso_conversion': peso_conversion,
                'crecimiento_diario': crecimiento_diario,
                'fep': fep,
                'aves_area': aves_area,
                'kg_area': kg_area,
            })
        return Response(data)
    
class GetTasksAPIView(generics.ListAPIView):
    serializer_class = ChickenGroupSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        farm = request.data.get('farm').lower()
        id = Farm.objects.get(name=farm).id
        tasks = Task.objects.filter(farm=id)
        data = []
        if len(tasks) != 0:
            for task in tasks:
                serialized = FarmSerializer(task.farm).data
                if task.status == 'pending':
                    data.append({
                    'title': task.title,
                    'description': task.description,
                    'date_time': task.date_time.strftime('%d-%m'),
                    'id': task.id,
                    'assigner': task.assigner.first_name.capitalize() + ' ' + task.assigner.last_name.capitalize(),
                })
        return Response(data)

class GetAllTasksAPIView(generics.ListAPIView):
    serializer_class = ChickenGroupSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        month = datetime.now() - timedelta(days=30)
        tasks_done = Task.objects.filter(status='done', date_time__gte=month)
        tasks_pending = Task.objects.filter(status='pending')
        data = []
        if len(tasks_done) != 0:
            for task in tasks_done:
                farm = FarmSerializer(task.farm).data
                data.append({
                    'title': task.title,
                    'description': task.description,
                    'date_time': task.date_time.strftime('%d-%m %H:%M'),
                    'status': task.status,
                    'farm': farm,
                    'responsible': task.responsible.first_name.capitalize() + ' ' + task.responsible.last_name.capitalize(),
                })
        if len(tasks_pending) != 0:
            for task in tasks_pending:
                farm = FarmSerializer(task.farm).data
                data.append({
                    'title': task.title,
                    'description': task.description,
                    'date_time': task.date_time.strftime('%d-%m %H:%M'),
                    'status': task.status,
                    'farm': farm,
                })
        return Response(data)

class SendTaskAPIView(generics.ListAPIView):
    serializer_class = ChickenGroupSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        farm = request.data.get('farm').lower()
        farm = Farm.objects.get(name=farm)
        title = request.data.get('title').capitalize()
        description = request.data.get('description')
        username = request.data.get('assigner')
        user = User.objects.get(username=username)
        new_task = Task(
            farm=farm,
            title=title,
            description=description,
            assigner=user,
        )
        print(f"Fecha antes de guardar: {new_task.date_time}")
        new_task.save()
        print(f"Fecha después de guardar: {new_task.date_time}")
        users = User.objects.filter(farm=farm)
        for user in users:
            try:
                response = PushClient.publish(
                    PushMessage(to=user.push_token, body='Una nueva tarea ha sido asignada')
                )
            except:
                pass
        message = {'title': 'Tarea enviada', 'message': 'Tarea enviada exitosamente', 'status': 'success'}
        return Response(message)
    
class SetTaskDoneAPIView(generics.ListAPIView):
    serializer_class = ChickenGroupSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        id = request.data.get('id')
        responsible = request.data.get('responsible')
        user = User.objects.get(username=responsible)
        task = Task.objects.get(id=id)
        task.status = 'done'
        task.responsible = user
        task.save()
        title = 'Tarea {} completada por {}'.format(task.title, user.first_name.capitalize() + ' ' + user.last_name.capitalize())
        user = User.objects.get(username=NOTIFICATION_USER)
        expo_token = user.push_token
        extra = None
        try:
            response = PushClient().publish(
                PushMessage(to=expo_token, body=title, data=extra)
            )
        except Exception as exc:
            print(f"Error al enviar la notificación: {exc}")
            print(expo_token, title, extra)
        return Response()
    
class ManualFoodAPIView(generics.ListAPIView):
    serializer_class = ChickenGroupSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        farm = request.data.get('farm').lower()
        food_type = request.data.get('food_type')
        quantity = request.data.get('quantity')
        user = request.data.get('user')
        try:
            batch = Batch.objects.get(farm=farm, active=True)
        except:
            message = {'title': 'Error', 'message': 'No hay lote activo para la granja especificada', 'status': 'error'}
            return Response(message)
        
        production = FoodProductionDelivery(
            food_type=food_type,
            quantity=quantity,
            trucker='-',
            producer='-',
            confirmed=True,
        )
        production.save()
        recall = FoodRecall(
            food_type=food_type,
            quantity=quantity,
            remit_number=production.remit_number,
            confirmed=True,
        )
        recall.save()
        delivery = FoodDelivery(
            farm=farm,
            food_type=food_type,
            quantity=quantity,
            receiver=user,
            remit_number=production.remit_number,
            confirmed=True,
        )
        delivery.save()
        receipt = FoodReceipt(
            farm=farm,
            food_type=food_type,
            quantity=quantity,
            provider='-',
            remit_number=production.remit_number,
            confirmed=True,
        )
        receipt.save()
        food = Food(
            batch=batch,
            production=production,
            recall=recall,
            delivery=delivery,
            receipt=receipt,
        )
        food.save()
        batch.food_quantity += int(quantity)
        batch.save()
        title = 'Nuevo ingreso de alimento en la granja {}'.format(farm.capitalize())
        username = User.objects.get(username=NOTIFICATION_USER)
        expo_token = username.push_token
        extra = None
        try:
            response = PushClient().publish(
                PushMessage(to=expo_token, body=title, data=extra)
            )
        except Exception as exc:
            print(f"Error al enviar la notificación: {exc}")
            print(expo_token, title, extra)
        message = {'title': 'Ingreso manual de alimento', 'message': 'Ingreso manual de alimento registrado exitosamente a las {}'.format(datetime.now().strftime('%H:%M:%S')), 'status': 'success'}
        return Response(message)