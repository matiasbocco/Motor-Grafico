from django.urls import path
from .views import SignInView, SignUpView, SavePushTokenAPIView, GetFarmersAPIView, GetProducersAPIView, GetTuckersAPIView

urlpatterns = [
    path('signin/', SignInView.as_view()),
    path('signup/', SignUpView.as_view()),
    path('push-token/', SavePushTokenAPIView.as_view()),
    path('get-farmers/', GetFarmersAPIView.as_view()),
    path('get-producers/', GetProducersAPIView.as_view()),
    path('get-truckers/', GetTuckersAPIView.as_view()),
]