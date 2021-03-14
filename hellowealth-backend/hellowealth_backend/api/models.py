from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import JSONField
from . import enums

# Create your models here.
class TradeTransaction(models.Model):
    transDate = models.DateTimeField(auto_now_add=True)
    transContent = models.CharField(max_length=255)
    transType = models.CharField(max_length=25,
        db_index=True,
        choices=enums.TRANS_TYPES,
        default=enums.TRANS_TYPE_PLUS)

    amount = models.IntegerField(blank=True,
        null=True,
        default=0,
        db_index=True,
        help_text="Transaction's amount")

    balance = models.IntegerField(blank=True,
        null=True,
        default=0,
        db_index=True,
        help_text="The current balance when transaction was posted")

    user = models.ForeignKey(User, on_delete = models.CASCADE)

    def __str__(self):
        return self.name


class UserPorfolio(models.Model):
    alerts = JSONField()
    assetEquities = JSONField()
    watchedEquities = JSONField()
    accountBalance = models.IntegerField(blank=True,
        null=True,
        default=0,
        db_index=True,
        help_text="User account balance")

    user = models.OneToOneField(User, on_delete=models.CASCADE)