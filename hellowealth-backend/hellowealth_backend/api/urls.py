from django.conf.urls import url
from django.urls import path, include
from hellowealth_backend.api.views import (
    UserPorfolioApiView,
    TradeTransactionApiView,
    StockPredictionApiView,
)


urlpatterns = [
    path('porfolio/', UserPorfolioApiView.as_view()),
    path('transaction/', TradeTransactionApiView.as_view()),
    path('prediction/<str:symbol>', StockPredictionApiView.as_view()),
]
