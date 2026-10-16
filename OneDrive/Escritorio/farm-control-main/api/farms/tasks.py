from celery import shared_task
from exponent_server_sdk import PushClient, PushMessage
import requests as r
from django.utils import timezone
from datetime import datetime, timedelta
from .models import ChickenGroup
from notifications.models import FarmNotification

@shared_task(bind=True)
def send_notification(_, expo_token, title, extra=None):
    try:
        response = PushClient().publish(
            PushMessage(to=expo_token, body=title, data=extra)
        )
    except Exception as exc:
        print(f"Error al enviar la notificación: {exc}")
        print(expo_token, title, extra)

@shared_task(bind=True)
def count_days(_):
    groups = ChickenGroup.objects.filter(active=True)
    for group in groups:
        now = timezone.now()
        now_date = datetime.date(now)
        group.day_count = (now_date - group.initial_date - timedelta(days=1)).days
        if group.day_count in [4, 7, 14, 21, 28, 35, 42, 49]:
            group.updated = False
        if not group.updated:
            notification = FarmNotification(
                title="Carga de datos pendiente",
                body=f"Por favor cargar los datos del grupo {group.id}, ubicado en el galpón {group.shed.number}.",
                done=False,
                group=group.id,
                farm=group.shed.farm
            )
            notification.save()
        group.save()