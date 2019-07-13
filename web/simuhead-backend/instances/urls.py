from rest_framework.routers import DefaultRouter
from .views import PakViewSet, SaveViewSet, InstanceViewSet

router = DefaultRouter()
router.register('paks', PakViewSet, basename='pak')
router.register('saves', SaveViewSet, basename='save')
router.register('instances', InstanceViewSet, basename='instance')

urlpatterns = router.urls
