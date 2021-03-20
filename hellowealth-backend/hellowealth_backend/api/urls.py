from django.conf.urls import url
from django.urls import path, include
from hellowealth_backend.api.views import (
    UserPorfolioApiView,
    TradeTransactionApiView,
)


urlpatterns = [
    path('porfolio/', UserPorfolioApiView.as_view()),
    path('transaction/', TradeTransactionApiView.as_view()),
]
