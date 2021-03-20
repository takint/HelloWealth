from django.shortcuts import render

# Create your views here.
from django.contrib.auth.models import User, Group
from hellowealth_backend.api.models import UserPorfolio, TradeTransaction
from rest_framework import viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
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
            return Response({"res": "Object with todo id does not exists"},
                status=status.HTTP_400_BAD_REQUEST)

        serializer = UserPorfolioSerializer(porfolio)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get_porfolio(self, user_id):
        try:
            return UserPorfolio.objects.get(user = user_id)
        except UserPorfolio.DoesNotExist:
            return None


    # 4. Update
    #def put(self, request, todo_id, *args, **kwargs):
    #    '''
    #    Updates the todo item with given todo_id if exists
    #    '''
    #    todo_instance = self.get_object(todo_id, request.user.id)
    #    if not todo_instance:
    #        return Response(
    #            {"res": "Object with todo id does not exists"}, 
    #            status=status.HTTP_400_BAD_REQUEST
    #        )
    #    data = {
    #        'task': request.data.get('task'), 
    #        'completed': request.data.get('completed'), 
    #        'user': request.user.id
    #    }
    #    serializer = TodoSerializer(instance = todo_instance, data=data, partial = True)
    #    if serializer.is_valid():
    #        serializer.save()
    #        return Response(serializer.data, status=status.HTTP_200_OK)
    #    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    ## 5. Delete
    #def delete(self, request, todo_id, *args, **kwargs):
    #    '''
    #    Deletes the todo item with given todo_id if exists
    #    '''
    #    todo_instance = self.get_object(todo_id, request.user.id)
    #    if not todo_instance:
    #        return Response(
    #            {"res": "Object with todo id does not exists"}, 
    #            status=status.HTTP_400_BAD_REQUEST
    #        )
    #    todo_instance.delete()
    #    return Response(
    #        {"res": "Object deleted!"},
    #        status=status.HTTP_200_OK
    #    )
    # 2.  Create
    #def post(self, request, *args, **kwargs):
    #    '''
    #    Create the Todo with given todo data
    #    '''
    #    data = {
    #        'task': request.data.get('task'),
    #        'completed': request.data.get('completed'),
    #        'user': request.user.id
    #    }
    #    serializer = TodoSerializer(data=data)
    #    if serializer.is_valid():
    #        serializer.save()
    #        return Response(serializer.data, status=status.HTTP_201_CREATED)

    #    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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