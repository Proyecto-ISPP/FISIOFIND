from rest_framework import generics, filters, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Terms
from .serializers import TermsSerializer
from datetime import datetime
from users.permissions import IsAdmin
from users.models import Admin


class TermsList(generics.ListAPIView):
    queryset = Terms.objects.all().order_by('-updated_at')
    serializer_class = TermsSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['tag']

    def get_queryset(self):
        queryset = super().get_queryset()
        tag = self.request.query_params.get('tag', None)
        if tag:
            queryset = queryset.filter(tag=tag)
        return queryset


class TermsDetail(generics.RetrieveAPIView):
    queryset = Terms.objects.all()
    serializer_class = TermsSerializer
    permission_classes = [AllowAny]


class TermsCreate(generics.CreateAPIView):
    queryset = Terms.objects.all()
    serializer_class = TermsSerializer
    permission_classes = [IsAdmin]

    def create(self, request, *args, **kwargs):
        try:
            # Get admin instance first
            try:
                admin_instance = Admin.objects.get(user=request.user)
            except Admin.DoesNotExist:
                return Response(
                    {'error': 'Admin user not found'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Create a mutable copy of the data
            data = request.data.copy()

            # Validate required fields
            if not data.get('content'):
                return Response(
                    {'content': ['This field is required.']},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if not data.get('version'):
                return Response(
                    {'version': ['This field is required.']},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if not data.get('tag'):
                return Response(
                    {'tag': ['This field is required.']},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Add modifier to the data
            data['modifier'] = admin_instance.id

            # Create term with current timestamp
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save(
                created_at=datetime.now(),
                updated_at=datetime.now()
            )

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class TermsUpdate(generics.UpdateAPIView):
    queryset = Terms.objects.all()
    serializer_class = TermsSerializer
    permission_classes = [IsAdmin]

    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save(
                modifier=request.user.admin,
                updated_at=datetime.now()
            )

            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class TermsDelete(generics.DestroyAPIView):
    queryset = Terms.objects.all()
    serializer_class = TermsSerializer
    permission_classes = [IsAdmin]

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response(
                {'message': 'Term deleted successfully'},
                status=status.HTTP_204_NO_CONTENT
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
