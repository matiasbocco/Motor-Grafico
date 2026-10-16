from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('farms/', consumers.FarmConsumer.as_asgi())
]