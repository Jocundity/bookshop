from rest_framework.routers import DefaultRouter
from .views import BookViewSet, CartViewSet, CartItemViewSet, OrderViewSet

router = DefaultRouter()
router.register(r"books", BookViewSet)
router.register(r"carts", CartViewSet)
router.register(r"cart-items", CartItemViewSet)
router.register(r"orders", OrderViewSet)


urlpatterns = router.urls