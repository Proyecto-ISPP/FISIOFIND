from .models import Survey

from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.parsers import JSONParser
from rest_framework import generics, status
from rest_framework.response import Response
from users.permissions import IsAdmin
from rest_framework.permissions import AllowAny
from rest_framework import generics
from datetime import datetime

from .models import Survey
from .serializers import SurveySerializer

# Create your views here.
class SurveyCreate(generics.CreateAPIView):
    '''
    API endpoint para crear un término.
    '''
    permission_classes = [AllowAny]
    queryset = Survey.objects.all()
    serializer_class = SurveySerializer

class SurveyList(generics.ListAPIView):
    '''
    API endpoint para listar los términos.
    '''
    permission_classes = [AllowAny]
    queryset = Survey.objects.all()
    serializer_class = SurveySerializer

class SurveyDetail(generics.RetrieveAPIView):
    '''
    API endpoint que retorna un solo término por su id.
    '''
    permission_classes = [AllowAny]
    queryset = Survey.objects.all()
    serializer_class = SurveySerializer

class SurveyUpdate(generics.RetrieveUpdateAPIView):
    '''
    API endpoint para actualizar un término.
    '''
    permission_classes = [AllowAny]
    queryset = Survey.objects.all()
    serializer_class = SurveySerializer

class SurveyDelete(generics.DestroyAPIView):
    '''
    API endpoint para eliminar un término.
    '''
    permission_classes = [AllowAny]
    queryset = Survey.objects.all()
    serializer_class = SurveySerializer
