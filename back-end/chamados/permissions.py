from rest_framework import permissions

class ChamadoPermissions(permissions.BasePermission):
    def has_permission(self, request, view):
        if view.action in ['atribuir', 'classificar']:
            return request.user.is_authenticated
        return True

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return obj.usuario_pode_visualizar(request.user)
        
        if view.action == 'atribuir':
            return (request.user.is_superuser or 
                   (request.user.groups.filter(name='tecnico').exists() and 
                    request.data.get('tecnico_id') in [None, str(request.user.id)]))
        
        if view.action == 'classificar':
            return obj.solicitante == request.user or request.user.is_superuser
            
        return False