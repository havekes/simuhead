from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import PakViewSet, SaveViewSet, InstanceViewSet, InstanceStartView, InstanceInstallView

router = DefaultRouter()
router.register('paks', PakViewSet, basename='pak')
router.register('saves', SaveViewSet, basename='save')
router.register('instances', InstanceViewSet, basename='instance')
urlpatterns = router.urls

# Routes for instance actions
urlpatterns.append(path('instances/<int:pk>/start/', InstanceStartView.as_view()))
urlpatterns.append(path('instances/<int:pk>/install/', InstanceInstallView.as_view()))
