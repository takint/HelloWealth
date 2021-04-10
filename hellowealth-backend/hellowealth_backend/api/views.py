from django.shortcuts import render
import pymongo
# Create your views here.
from django.contrib.auth.models import User, Group
from django.core import serializers
from hellowealth_backend.api.models import UserPorfolio, TradeTransaction
from rest_framework import viewsets, status, permissions, mixins
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from hellowealth_backend.api.serializers import (
    UserSerializer, 
    GroupSerializer, 
    UserPorfolioSerializer, 
    TradeTransactionSerializer
)

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserPorfolioApiView(APIView):
    # add permission to check if user is authenticated
    queryset = UserPorfolio.objects.all()
    serializer_class = UserPorfolioSerializer
    permission_classes = [permissions.IsAuthenticated]

    # 1.  Get user porfolio
    def get(self, request, *args, **kwargs):
        porfolio = self.get_porfolio(request.user.id)

        if not porfolio:
            return Response({"res": "Object with porfolio id does not exists"},
                status=status.HTTP_400_BAD_REQUEST)

        serializer = UserPorfolioSerializer(porfolio)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get_porfolio(self, user_id):
        try:
            return UserPorfolio.objects.get(user = user_id)
        except UserPorfolio.DoesNotExist:
            return None

    # 2.  Update
    @swagger_auto_schema(request_body=UserPorfolioSerializer)
    def put(self, request, *args, **kwargs):
        porfolio = self.get_porfolio(request.user.id)
        if not porfolio:
            return Response({"res": "Object with porfolio id does not exists"}, 
                status=status.HTTP_400_BAD_REQUEST)

        serializer = UserPorfolioSerializer(instance = porfolio, data=request.data, partial = True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # 3.  Create
    @swagger_auto_schema(request_body=UserPorfolioSerializer)
    def post(self, request, *args, **kwargs):
        porfolio = self.get_porfolio(request.user.id)

        if porfolio:
            return Response({"res": "Object with porfolio id is existed"}, 
                status=status.HTTP_400_BAD_REQUEST)

        serializer = UserPorfolioSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TradeTransactionApiView(APIView):
    # add permission to check if user is authenticated
    queryset = TradeTransaction.objects.all()
    serializer_class = TradeTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    # 1.  List all
    def get(self, request, *args, **kwargs):
        trans = TradeTransaction.objects.filter(user = request.user.id)
        serializer = TradeTransactionSerializer(trans, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # 2.  Create
    @swagger_auto_schema(request_body=TradeTransactionSerializer)
    def post(self, request, *args, **kwargs):

        serializer = TradeTransactionSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StockPredictionApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    client = pymongo.MongoClient("mongodb+srv://hellowealth-app:xWVR6rro6WE1FiOa@hellowealth.wnyrs.mongodb.net/stock_db?retryWrites=true&w=majority")

    def get(self, request, *args, **kwargs):
        db = self.client.stock_db
        predict_list = []
        for item in db.p_msft.find():
            predict_list.append([str(item["date"]), item["Close"]])

        return Response(predict_list, status=status.HTTP_200_OK)