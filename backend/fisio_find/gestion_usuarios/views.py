from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.parsers import JSONParser
from rest_framework import generics

from .models import AppUser
from .serializers import AppUserSerializer

# Create your views here.
class AppUserCreate(generics.CreateAPIView):
    '''
    API endpoint that allows creation of a new app user.
    '''
    queryset = AppUser.objects.all()
    serializer_class = AppUserSerializer

class AppUserList(generics.ListAPIView):
    '''
    API endpoint that allows app users to be viewed.
    '''
    queryset = AppUser.objects.all()
    serializer_class = AppUserSerializer

class AppUserDetail(generics.RetrieveAPIView):
    '''
    API endpoint that returns a single app user by pk.
    '''
    queryset = AppUser.objects.all()
    serializer_class = AppUserSerializer

class AppUserUpdate(generics.RetrieveUpdateAPIView):
    '''
    API endpoint that allows a single app user to be updated.
    '''
    queryset = AppUser.objects.all()
    serializer_class = AppUserSerializer

class AppUserDelete(generics.DestroyAPIView):
    '''
    API endpoint that allows a single app user to be deleted.
    '''
    queryset = AppUser.objects.all()
    serializer_class = AppUserSerializer