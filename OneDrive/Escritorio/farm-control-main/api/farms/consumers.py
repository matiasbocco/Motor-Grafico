from channels.generic.websocket import JsonWebsocketConsumer
from .models import Shed, ChickenGroup
from asgiref.sync import async_to_sync
from django.forms.models import model_to_dict
from users.models import User
from django_celery_beat.models import PeriodicTask, CrontabSchedule
from uuid import uuid4
import json
from datetime import datetime, timedelta

class FarmConsumer(JsonWebsocketConsumer):
    def connect(self):
        self.user = self.scope['user']
        self.rank = self.user.rank
        self.farm = self.user.farm
        self.group_name = f'farm-{self.farm}'
        async_to_sync(self.channel_layer.group_add)(
            self.group_name,
            self.channel_name
        )

        user = self.scope['user']
                
        if not user.is_authenticated:
            return
                
        self.accept()

        # Envía los datos de la granja al usuario

        if self.rank == '0':
            sheds = Shed.objects.all()
        elif self.rank == '1':
            sheds = Shed.objects.filter(farm=self.farm)
        for shed in sheds:
            groups = ChickenGroup.objects.filter(shed=shed)
            if groups:
                for group in groups:
                    if group.active:
                        self.send_json({
                            'source': 'farmer.connect',
                            'shed': shed.number,
                            'farm': shed.farm,
                            'day_count': group.day_count,
                            'quantity': group.quantity,
                            'cabin': group.cabin,
                            'genetic_line': group.genetic_line,
                            'sex': group.sex,
                            'group_id': group.id,
                            'mortality': group.mortality,
                        })
            else:
                self.send_json({
                    'source': 'farmer.connect',
                    'shed': shed.number,
                    'farm': shed.farm,
                })

        

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.group_name,
            self.channel_name
        )

    def receive_json(self, data):
        # Manejas las publicaciones entrantes
        data_source = data['source']
        
        if data_source == 'create.group':
            self.create_group(data)
        elif data_source == 'save.push.token':
            self.save_push_token(data)
        elif data_source == 'set.shed.notification':
            self.set_notification(data)
        elif data_source == 'send.week.data':
            self.save_week_data(data)
        elif data_source == 'get.farm.data':
            self.send_farm_data(data)
    
    def create_group(self, data):
        shed_data = data['shed']
        shed = Shed.objects.get(farm=shed_data['farm'], number=shed_data['number'])
        group = ChickenGroup(
            shed=shed,
            quantity=data['quantity'],
            cabin=data['cabin'],
            genetic_line=data['genetic_line'],
            sex=data['sex'],
        )

        group.save()
        
        shed_dict = model_to_dict(shed)
        async_to_sync(self.channel_layer.group_send)(
        self.group_name,
        {
            'type': 'send.group',
            'source': 'create.group',
            'shed': shed_dict['number'],
            'day_count': group.day_count,
            'quantity': group.quantity,
            'cabin': group.cabin,
            'genetic_line': group.genetic_line,
            'sex': group.sex,
            'group_id': group.id,
        }
        )
    
    def send_group(self, event):
        self.send_json(event)
    
    def save_push_token(self, data):
        username = data['username']
        user = User.objects.get(username=username)
        user.push_token = data['token']
        user.save()
    
    def set_notification(self, data):
        group_day = data['group_day']
        username = data['username']
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
    
    def save_week_data(self, data):
        group = ChickenGroup.objects.get(id=data['group_id'])
        day = data['day']
        if day == 0:
            group.day_0_weight = data['weight']
            group.day_0_mortality = data['mortality']
            group.mortality += int(data['mortality'])
        elif day == 4:
            group.day_4_weight = data['weight']
            group.day_4_mortality = data['mortality']
            group.mortality += int(data['mortality'])
        elif day == 7:
            group.day_7_weight = data['weight']
            group.day_7_mortality = data['mortality']
            group.mortality += int(data['mortality'])
        elif day == 14:
            group.day_14_weight = data['weight']
            group.day_14_mortality = data['mortality']
            group.mortality += int(data['mortality'])
        elif day == 21:
            group.day_21_weight = data['weight']
            group.day_21_mortality = data['mortality']
            group.mortality += int(data['mortality'])
        elif day == 28:
            group.day_28_weight = data['weight']
            group.day_28_mortality = data['mortality']
            group.mortality += int(data['mortality'])
        elif day == 35:
            group.day_35_weight = data['weight']
            group.day_35_mortality = data['mortality']
            group.mortality += int(data['mortality'])
        elif day == 42:
            group.day_42_weight = data['weight']
            group.day_42_mortality = data['mortality']
            group.mortality += int(data['mortality'])
        group.save()
    
    def send_farm_data(self, data):
        farm = data['farm']
        sheds = Shed.objects.filter(farm=farm)

        for shed in sheds:
            groups = ChickenGroup.objects.filter(shed=shed)
            if groups:
                for group in groups:
                    if group.active:
                        self.send_json({
                            'source': 'farm.data',
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
                            'day_0_mortality': group.day_0_mortality,
                            'day_4_mortality': group.day_4_mortality,
                            'day_7_mortality': group.day_7_mortality,
                            'day_14_mortality': group.day_14_mortality,
                            'day_21_mortality': group.day_21_mortality,
                            'day_28_mortality': group.day_28_mortality,
                            'day_35_mortality': group.day_35_mortality,
                            'day_42_mortality': group.day_42_mortality,
                            })
            else:
                self.send_json({
                    'source': 'farm.data',
                    'shed': shed.number,
                })