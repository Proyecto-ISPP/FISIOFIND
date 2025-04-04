from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Rating
from .serializers import RatingSerializer
from users.permissions import IsPhysiotherapist


class RatingListView(generics.ListAPIView):
    queryset = Rating.objects.all().order_by('-punctuation')
    serializer_class = RatingSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsPhysiotherapist])
def create_rating(request):
    # Log the incoming data for debugging
    print("Incoming rating data:", request.data)

    # Ensure the physiotherapist field is set to the logged-in user
    data = request.data.copy()
    data['physiotherapist'] = request.user.physio.id

    serializer = RatingSerializer(data=data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # Log validation errors
    print("Validation errors:", serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated, IsPhysiotherapist])
def update_rating(request, rating_id):
    try:
        rating = Rating.objects.get(id=rating_id)

        if request.user.physio != rating.physiotherapist:
            return Response(
                {'error': 'Solo puedes editar tus valoraciones'}, 
                status=status.HTTP_403_FORBIDDEN
            )

        # Automatically associate the physiotherapist with the logged-in user
        data = request.data.copy()
        data['physiotherapist'] = request.user.physio.id

        # Log incoming data for debugging
        print("Incoming data for update:", data)

        serializer = RatingSerializer(rating, data=data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        # Log validation errors
        print("Validation errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception:
        return Response({'error': 'Valoración no encontrada'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsPhysiotherapist])
def delete_rating(request, rating_id):
    try:
        rating = Rating.objects.get(id=rating_id)

        if request.user.physio != rating.physiotherapist:
            return Response(
                {'error': 'Solo puedes eliminar tus valoraciones'}, 
                status=status.HTTP_403_FORBIDDEN
            )

        rating.delete()
        return Response({'message': 'Valoración eliminada'}, status=status.HTTP_204_NO_CONTENT)

    except Exception as e:
        return Response({'error': 'Valoración no encontrada'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_rating_details(request, rating_id):
    try:
        rating = Rating.objects.get(id=rating_id)
        serializer = RatingSerializer(rating)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': 'Valoración no encontrada'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([AllowAny])
def check_if_physio_has_rated(request):
    try:
        has_rated = Rating.objects.filter(physiotherapist=request.user.physio).exists()
        return Response({'has_rated': has_rated}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': 'Solicitud incorrecta'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsPhysiotherapist])
def get_my_rating(request):
    try:
        rating = Rating.objects.filter(physiotherapist=request.user.physio).first()
        if rating:
            serializer = RatingSerializer(rating)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(None, status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response({'error': 'Solicitud incorrecta'}, status=status.HTTP_400_BAD_REQUEST)
