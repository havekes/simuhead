from rest_framework.routers import DefaultRouter
from .views import InstanceViewSet

router = DefaultRouter()
router.register('', InstanceViewSet, basename='instances')

urlpatterns = router.urls
