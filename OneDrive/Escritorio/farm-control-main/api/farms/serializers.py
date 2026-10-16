from rest_framework import serializers
from .models import Shed, ChickenGroup, FoodProductionDelivery, FoodRecall, FoodDelivery, FoodReceipt, Food, Farm

class ShedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shed
        fields = '__all__'

class ChickenGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChickenGroup
        fields = '__all__'

class FoodProductionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodProductionDelivery
        fields = '__all__'

class FoodRecallSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodRecall
        fields = '__all__'

class FoodDeliverySerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodDelivery
        fields = '__all__'

class FoodReceiptSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodReceipt
        fields = '__all__'

class FoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Food
        fields = '__all__'

class FarmSerializer(serializers.ModelSerializer):
    class Meta:
        model = Farm
        fields = '__all__'


