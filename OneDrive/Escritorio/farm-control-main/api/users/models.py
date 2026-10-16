from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    rank = models.CharField(max_length=200)
    farm = models.CharField(max_length=200, blank=True)
    push_token = models.CharField(max_length=400, blank=True)
    creator = models.CharField(max_length=400, blank=True, null=True)



