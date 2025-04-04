from django.shortcuts import render
from treatments.models import Treatment
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .serializers import PatientFileSerializer
import boto3
import uuid
from rest_framework import status
from users.permissions import IsPatient, IsPhysioOrPatient
from .models import PatientFile


@api_view(['POST'])
@permission_classes([IsPatient])
def create_file(request):
    treatment_id = request.data.get('treatment')

    if not treatment_id:
        return Response(
            {"message": "El ID del tratamiento es requerido"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Aquí asumo que Treatment es el nombre del modelo y tiene una relación con el paciente
    try:
        treatment = Treatment.objects.get(id=treatment_id)
    except Treatment.DoesNotExist:
        return Response(
            {"message": "Tratamiento no encontrado"},
            status=status.HTTP_404_NOT_FOUND
        )

    # Verificar si el paciente asociado al tratamiento es el mismo que el que hace la solicitud
    if treatment.patient != request.user.patient:
        return Response(
            {"message": "No tienes permiso para crear archivos para este tratamiento"},
            status=status.HTTP_403_FORBIDDEN
        )
    mutable_data = request.data.copy()
    serializer = PatientFileSerializer(data=mutable_data, context={'request': request})

    if serializer.is_valid():
        file = serializer.save()
        return Response(
            {
                "mesaage": "Archivo creado correctamente",
                "file": PatientFileSerializer(file).data
            },
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsPatient])
def delete_patient_file(request, file_id):
    user = request.user
    
    try:
        file = PatientFile.objects.get(id=file_id)

        if not hasattr(user, 'patient') or file.treatment.patient.id != user.patient.id:
            return Response({"error": "No tienes permiso para eliminar este archivo"}, status=status.HTTP_403_FORBIDDEN)

        file.delete_from_storage()
        file.delete()

        return Response({"message": "Archivo eliminado correctamente"}, status=status.HTTP_200_OK)

    except PatientFile.DoesNotExist:
        return Response({"error": "Archivo no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['PUT'])
@permission_classes([IsPatient])
def update_patient_file(request, file_id):
    try:
        file_instance = PatientFile.objects.get(id=file_id)
    except PatientFile.DoesNotExist:
        return Response({"error": "Archivo no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    # Verificar que el usuario autenticado es el dueño del archivo
    if file_instance.treatment.patient.id != request.user.patient.id:
        return Response({"error": "No tienes permiso para actualizar este archivo"}, status=status.HTTP_403_FORBIDDEN)

    mutable_data = request.data.copy()

    # Si el archivo es nuevo, lo agregamos al diccionario mutable
    new_file = request.FILES.get("files")
    if new_file:
        mutable_data["files"] = new_file

    serializer = PatientFileSerializer(file_instance, data=mutable_data, partial=True, context={"request": request})

    if serializer.is_valid():
        serializer.save()

        return Response({
            "message": "Archivo actualizado correctamente",
            "file": serializer.data
        }, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsPhysioOrPatient])
def get_patient_file_by_id(request, file_id):
    user = request.user
    try:
        file = PatientFile.objects.get(id=file_id)
        serializer = PatientFileSerializer(file)

        if hasattr(user, 'patient') and file.treatment.patient.id == user.patient.id:
            return Response(serializer.data, status=status.HTTP_200_OK)
        elif hasattr(user, 'physio') and file.treatment.physiotherapist.id == user.physio.id:
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "No tienes permiso para ver este archivo"}, status=status.HTTP_403_FORBIDDEN)
    except PatientFile.DoesNotExist:
        return Response({"error": "Archivo no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['GET'])
@permission_classes([IsPhysioOrPatient])
def get_patient_files(request):
    user = request.user
    patient_files = []

    # Filtrar los archivos que el usuario puede acceder
    if hasattr(user, 'patient'):
        files = PatientFile.objects.filter(treatment__patient=user.patient)
    elif hasattr(user, 'physio'):
        files = PatientFile.objects.filter(treatment__physiotherapist=user.physio)
    else:
        files = []

    for file in files:
        serializer = PatientFileSerializer(file)
        patient_files.append(serializer.data)

    if not patient_files:
        return Response({"error": "No se han encontrado archivos a los que puedas acceder"}, status=status.HTTP_404_NOT_FOUND)

    return Response(patient_files, status=status.HTTP_200_OK)
