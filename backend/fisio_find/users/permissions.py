from rest_framework.permissions import BasePermission

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