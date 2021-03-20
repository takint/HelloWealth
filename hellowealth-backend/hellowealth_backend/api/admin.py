from django.contrib import admin
from hellowealth_backend.api.models import UserPorfolio, TradeTransaction

# Register your models here.
admin.site.register(UserPorfolio)
admin.site.register(TradeTransaction)