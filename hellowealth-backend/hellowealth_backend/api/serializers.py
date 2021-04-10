from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import UserPorfolio, TradeTransaction


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']


class UserPorfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPorfolio
        fields = ['alerts', 'assetEquities', 'watchedEquities', 'accountBalance', 'user']

class TradeTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TradeTransaction
        fields = ['id', 'transDate', 'transContent', 'transType', 'amount', 'balance', 'user']
