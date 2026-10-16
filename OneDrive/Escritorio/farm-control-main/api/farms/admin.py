from django.contrib import admin
from .models import (
    Shed, 
    ChickenGroup, 
    FoodProductionDelivery, 
    FoodRecall, 
    FoodDelivery, 
    FoodReceipt, 
    Food, 
    Batch, 
    Slaughter, 
    Farm,
    Task,
)

# Register your models here.

admin.site.register(Shed)
admin.site.register(ChickenGroup)
admin.site.register(FoodProductionDelivery)
admin.site.register(FoodRecall)
admin.site.register(FoodDelivery)
admin.site.register(FoodReceipt)
admin.site.register(Food)
admin.site.register(Batch)
admin.site.register(Slaughter)
admin.site.register(Farm)
admin.site.register(Task)
