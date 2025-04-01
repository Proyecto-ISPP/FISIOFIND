from rest_framework.permissions import BasePermission
from appointment.models import Appointment
from treatments.models import Treatment

class IsPatient(BasePermission):
    """
    Permite el acceso solo a usuarios que tengan un perfil de paciente.
    """
    def has_permission(self, request, view):
        return hasattr(request.user, 'patient')
    
class IsPhysiotherapist(BasePermission):
    """
    Permite el acceso a usuarios que sean fisioterapeutas.
    """
    def has_permission(self, request, view):
        return hasattr(request.user, 'physio')

class IsPhysioOrPatient(BasePermission):
    """
    Permite el acceso a usuarios que sean pacientes o fisioterapeutas.
    """
    def has_permission(self, request, view):
        return hasattr(request.user, 'patient') or hasattr(request.user, 'physio')
    
class IsAdmin(BasePermission):
    """
    Permite el acceso a usuarios que sean administrador.
    """
    def has_permission(self, request, view):
        return hasattr(request.user, 'admin')
    

class IsPhysioOfPatientFile(BasePermission):
    """
    Permite el acceso solo si el fisioterapeuta está asignado al paciente que subió el archivo.
    """
    def has_object_permission(self, request, view, obj):
        if hasattr(request.user, 'physio'):  # Verifica si el usuario es fisioterapeuta
            # Verifica si el fisioterapeuta tiene relación con el paciente del archivo
            return Treatment.objects.filter(
                physiotherapist=request.user.physio, 
                patient=obj.patient
            ).exists() or Appointment.objects.filter(
                physiotherapist=request.user.physio, 
                patient=obj.patient
            ).exists()
        return False  # Si no es fisioterapeuta, deniega acceso