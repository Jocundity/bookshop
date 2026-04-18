from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookViewSet, CartViewSet, CartItemViewSet, OrderViewSet
from rest_framework.authtoken.views import obtain_auth_token

router = DefaultRouter()
router.register(r"books", BookViewSet)
router.register(r"carts", CartViewSet)
router.register(r"cart-items", CartItemViewSet)
router.register(r"orders", OrderViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('token/', obtain_auth_token),
]