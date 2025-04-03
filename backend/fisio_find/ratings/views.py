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
    serializer = RatingSerializer(data=request.data)

    if serializer.is_valid():
        # Automatically associate the physiotherapist with the logged-in user
        serializer.save(physiotherapist=request.user.physio)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated, IsPhysiotherapist])
def update_rating(request, rating_id):
    try:
        rating = Rating.objects.get(id=rating_id)

        if request.user.physio != rating.physiotherapist and not request.user.is_staff:
            return Response(
                {'error': 'You can only edit your own ratings'}, 
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = RatingSerializer(rating, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({'error': 'Rating not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsPhysiotherapist])
def delete_rating(request, rating_id):
    try:
        rating = Rating.objects.get(id=rating_id)

        if request.user.physio != rating.physiotherapist and not request.user.is_staff:
            return Response(
                {'error': 'You can only delete your own ratings'}, 
                status=status.HTTP_403_FORBIDDEN
            )

        rating.delete()
        return Response({'message': 'Rating deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

    except Exception as e:
        return Response({'error': 'Rating not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_rating_details(request, rating_id):
    try:
        rating = Rating.objects.get(id=rating_id)
        serializer = RatingSerializer(rating)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': 'Rating not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_physiotherapist_ratings(request, physiotherapist_id):
    ratings = Rating.objects.filter(physiotherapist_id=physiotherapist_id)
    serializer = RatingSerializer(ratings, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
