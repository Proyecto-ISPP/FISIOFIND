from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.parsers import JSONParser
from rest_framework import generics, status
from rest_framework.response import Response
from gestion_usuarios.permissions import IsAdmin
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import generics
from datetime import datetime

from .models import AppTerminos, Admin
from .serializers import AppTerminosSerializer

# Create your views here.
class AppTerminosCreate(generics.CreateAPIView):
    '''
    API endpoint para crear un término.
    '''
    permission_classes = [IsAdmin]
    def post(self, request, *args, **kwargs):
        try:
            modifier = request.user
        except Exception:
            return Response({"message": "No estás autenticado"}, status=status.HTTP_403_FORBIDDEN)
        
        admin_instance = Admin.objects.get(user=modifier)

        errormsg = ""
        version = request.data.get('version')
        if version == '' or version == None:
            errormsg += "El campo versión es obligatorio. "
        
        content = request.data.get('content')
        if content == '' or content == None:
            if errormsg == "":
                errormsg += "El campo contenido es obligatorio. "
            else:
                errormsg = "Los campos contenido y versión son obligatorios. "
        
        if len(version) >= 100:
            errormsg += "Versión debe de ser menor de 100 caracteres."

        if errormsg:
            return Response({'required': errormsg}, status=status.HTTP_400_BAD_REQUEST)

        created_at = datetime.now()
        updated_at = datetime.now()

        AppTerminos.objects.create(
            content=content,
            version=version,
            modifier=admin_instance,
            created_at=created_at,
            updated_at=updated_at,
        )

        return Response({"message": "Configuration created successfully"}, status=status.HTTP_201_CREATED)


class AppTerminosList(generics.ListAPIView):
    '''
    API endpoint para listar los términos.
    '''
    permission_classes = [IsAdmin]
    queryset = AppTerminos.objects.all()
    serializer_class = AppTerminosSerializer

class AppTerminosDetail(generics.RetrieveAPIView):
    '''
    API endpoint que retorna un solo término por su id.
    '''
    permission_classes = [AllowAny]
    queryset = AppTerminos.objects.all()
    serializer_class = AppTerminosSerializer

class AppTerminosUpdate(generics.RetrieveUpdateAPIView):
    '''
    API endpoint para actualizar un término.
    '''
    permission_classes = [IsAdmin]
    queryset = AppTerminos.objects.all()
    serializer_class = AppTerminosSerializer

    def put(self, request, *args, **kwargs):
        try:
            modifier = request.user
        except Exception:
            return Response({"message": "No estás autenticado"}, status=status.HTTP_403_FORBIDDEN)
        pk = kwargs['pk']
        terminos = AppTerminos.objects.filter(pk=pk)

        if not terminos.exists():
            return Response({"error": "Esta configuración no existe"}, status=status.HTTP_404_NOT_FOUND)

        admin_instance = Admin.objects.get(user=modifier)
        errormsg = ""
        version = request.data.get('version')
        if version == '' or version == None:
            errormsg += "El campo versión es obligatorio. "
        
        content = request.data.get('content')
        if content == '' or content == None:
            if errormsg == "":
                errormsg += "El campo contenido es obligatorio. "
            else:
                errormsg = "Los campos contenido y versión son obligatorios. "
        
        if len(version) >= 100:
            errormsg += "Versión debe de ser menor de 100 caracteres."

        if errormsg:
            return Response({'required': errormsg}, status=status.HTTP_400_BAD_REQUEST)

        updated_at = datetime.now()

        terminos.update(
            content=content,
            version=version,
            modifier=admin_instance,
            updated_at=updated_at,
        )

        return Response({"message": "Configuration updated successfully"}, status=status.HTTP_200_OK)

    def patch(self, request, *args, **kwargs):
        try:
            modifier = request.user
        except Exception:
            return Response({"message": "No estás autenticado"}, status=status.HTTP_403_FORBIDDEN)
        pk = kwargs['pk']
        terminos = AppTerminos.objects.filter(pk=pk)

        if not terminos.exists():
            return Response({"error": "Esta configuración no existe"}, status=status.HTTP_404_NOT_FOUND)

        admin_instance = Admin.objects.get(user=modifier)
        errormsg = ""
        version = request.data.get('version')
        if version == '' or version == None:
            errormsg += "El campo versión es obligatorio. "
        
        content = request.data.get('content')
        if content == '' or content == None:
            if errormsg == "":
                errormsg += "El campo contenido es obligatorio. "
            else:
                errormsg = "Los campos contenido y versión son obligatorios. "
        
        if len(version) >= 100:
            errormsg += "Versión debe de ser menor de 100 caracteres."

        if errormsg:
            return Response({'required': errormsg}, status=status.HTTP_400_BAD_REQUEST)

        
        updated_at = datetime.now()

        terminos.update(
            content=content,
            version=version,
            modifier=admin_instance,
            updated_at=updated_at,
        )

        return Response({"message": "Configuration updated successfully"}, status=status.HTTP_200_OK)

class AppTerminosDelete(generics.DestroyAPIView):
    '''
    API endpoint para eliminar un término.
    '''
    permission_classes = [IsAdmin]
    queryset = AppTerminos.objects.all()
    serializer_class = AppTerminosSerializer
