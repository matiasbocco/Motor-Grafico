from django.db import models

class FarmNotification(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()
    date_time = models.DateTimeField(auto_now_add=True)
    done = models.BooleanField(default=False)
    group = models.IntegerField()
    farm = models.CharField(max_length=50)

class ProducerNotification(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()
    date_time = models.DateTimeField(auto_now_add=True)
    username = models.CharField(max_length=200)