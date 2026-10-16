from django.db import models
from users.models import User

# Create your models here.

class Farm(models.Model):
    name = models.CharField(max_length=200)
    area = models.IntegerField(default=0)

class Shed(models.Model):
    farm = models.CharField(max_length=200)
    number = models.IntegerField()
    area = models.IntegerField(default=0)

class Batch(models.Model):
    initial_date = models.DateField(auto_now_add=True)
    farm = models.CharField(max_length=200)
    chiquens = models.IntegerField(default=0)
    slaughter_chiquens = models.IntegerField(default=0)
    slaughter_chiquens_weight = models.FloatField(default=0)
    food_quantity = models.IntegerField(default=0)
    gas = models.FloatField(default=0)
    edad_promedio = models.FloatField(default=0)
    active = models.BooleanField(default=True)
    finish_date = models.DateField(null=True, blank=True)

class ChickenGroup(models.Model):
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    shed = models.ForeignKey(Shed, on_delete=models.CASCADE)
    initial_date = models.DateField(auto_now_add=True)
    day_count = models.IntegerField(default=0)
    quantity = models.IntegerField()
    cabin = models.CharField(max_length=200)
    genetic_line = models.CharField(max_length=200)
    sex = models.CharField(max_length=200)
    active = models.BooleanField(default=True)
    mortality = models.IntegerField(default=0)
    area = models.IntegerField(default=0)
    updated = models.BooleanField(default=False)
    day_0_weight = models.FloatField(blank=True, default=0)
    day_4_weight = models.FloatField(blank=True, default=0)
    day_7_weight = models.FloatField(blank=True, default=0)
    day_14_weight = models.FloatField(blank=True, default=0)
    day_21_weight = models.FloatField(blank=True, default=0)
    day_28_weight = models.FloatField(blank=True, default=0)
    day_35_weight = models.FloatField(blank=True, default=0)
    day_42_weight = models.FloatField(blank=True, default=0)
    day_49_weight = models.FloatField(blank=True, default=0)
    day_0_mortality = models.IntegerField(blank=True, default=0)
    day_4_mortality = models.IntegerField(blank=True, default=0)
    day_7_mortality = models.IntegerField(blank=True, default=0)
    day_14_mortality = models.IntegerField(blank=True, default=0)
    day_21_mortality = models.IntegerField(blank=True, default=0)
    day_28_mortality = models.IntegerField(blank=True, default=0)
    day_35_mortality = models.IntegerField(blank=True, default=0)
    day_42_mortality = models.IntegerField(blank=True, default=0)
    day_49_mortality = models.IntegerField(blank=True, default=0)

class FoodProductionDelivery(models.Model):
    date_time = models.DateTimeField(auto_now_add=True)
    food_type = models.CharField(max_length=200)
    quantity = models.FloatField()
    trucker = models.CharField(max_length=200)
    producer = models.CharField(max_length=200)
    remit_number = models.IntegerField(null=True, blank=True)
    confirmed = models.BooleanField(default=False)
    status = models.CharField(max_length=200, default='pending')
    reason = models.CharField(max_length=200, default='')

    def save(self, *args, **kwargs):
        super(FoodProductionDelivery, self).save(*args, **kwargs)
        if self.remit_number is None:
            self.remit_number = 100000 + self.id
            super(FoodProductionDelivery, self).save(*args, **kwargs)

class FoodRecall(models.Model):
    date_time = models.DateTimeField(auto_now_add=True)
    food_type = models.CharField(max_length=200)
    quantity = models.FloatField()
    remit_number = models.IntegerField()
    confirmed = models.BooleanField(default=False)

class FoodDelivery(models.Model):
    date_time = models.DateTimeField(auto_now_add=True)
    farm = models.CharField(max_length=200)
    food_type = models.CharField(max_length=200)
    quantity = models.FloatField()
    receiver = models.CharField(max_length=200)
    remit_number = models.IntegerField()
    confirmed = models.BooleanField(default=False)

class FoodReceipt(models.Model):
    date_time = models.DateTimeField(auto_now_add=True)
    farm = models.CharField(max_length=200)
    food_type = models.CharField(max_length=200)
    quantity = models.FloatField()
    provider = models.CharField(max_length=200)
    remit_number = models.IntegerField()
    confirmed = models.BooleanField(default=False)

class Food(models.Model):
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    production = models.ForeignKey(FoodProductionDelivery, on_delete=models.CASCADE, default=None, null=True)
    recall = models.ForeignKey(FoodRecall, on_delete=models.CASCADE)
    delivery = models.ForeignKey(FoodDelivery, on_delete=models.CASCADE)
    receipt = models.ForeignKey(FoodReceipt, on_delete=models.CASCADE)

class Slaughter(models.Model):
    date_time = models.DateTimeField(auto_now_add=True)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    farm = models.CharField(max_length=200)
    shed = models.CharField(max_length=200)
    quantity = models.IntegerField()
    tare = models.FloatField()
    gross_weight = models.FloatField()
    net_weight = models.FloatField(null=True, blank=True)
    average_weight = models.FloatField(null=True, blank=True)
    truck = models.CharField(max_length=200)
    trucker = models.CharField(max_length=200)
    client = models.CharField(max_length=200, null=True, blank=True)
    remit_number = models.IntegerField(null=True, blank=True)

    def save(self, *args, **kwargs):
        self.net_weight = float(self.gross_weight) - float(self.tare)
        self.average_weight = self.net_weight / float(self.quantity)
        super(Slaughter, self).save(*args, **kwargs)
        if self.remit_number is None:
            self.remit_number = 300000 + self.id
            super(Slaughter, self).save(*args, **kwargs)

class Task(models.Model):
    date_time = models.DateTimeField(auto_now_add=True)
    farm = models.ForeignKey(Farm, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(max_length=200, default='pending')
    responsible = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True, related_name='responsible_tasks')
    assigner = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True, related_name='assigned_tasks')