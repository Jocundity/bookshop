from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.viewsets import ModelViewSet
from .models import Book, Cart, CartItem, Order, OrderItem
from .serializers import BookSerializer, CartSerializer, CartItemSerializer, OrderSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from rest_framework.exceptions import ValidationError

# Create your views here.
class BookViewSet(ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter
    ]
    filterset_fields = ['title', 'author']
    search_fields = ['title', 'author']
    ordering_fields = ['price', 'title']

class CartViewSet(ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CartItemViewSet(ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(cart__user = self.request.user)
    
    def perform_create(self, serializer):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        book = serializer.validated_data["book"]
        quantity = serializer.validated_data.get("quantity", 1)

        # Check if cart item already exists
        cart_item = CartItem.objects.filter(cart=cart, book=book).first()
        if cart_item:
            cart_item.quantity += quantity
            cart_item.save()
        else:
            serializer.save(cart=cart)

class OrderViewSet(ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=["post"])
    def checkout(self, request):
        user = self.request.user

        # Get cart
        cart = Cart.objects.filter(user=user).first()

        if not cart or not cart.cartitem_set.exists():
            return Response(
                {"error": "Cart is empty"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        with transaction.atomic():
            # Create order from cart
            order = Order.objects.create(user=user)
            total = 0

            for item in cart.cartitem_set.all():
                book = Book.objects.select_for_update().get(id=item.book.id)

                # Check to make sure there's enough stock
                if item.quantity > book.stock:
                    raise ValidationError(f"There are only {book.stock} copies in stock")

                # Update inventory
                book.stock -= item.quantity
                book.save()

                OrderItem.objects.create(
                 order=order,
                 book=book,
                 quantity=item.quantity
                )

                # Add price of book to order total
                total += book.price * item.quantity

            order.total_price = total
            order.save()

            # Clear cart
            cart.cartitem_set.all().delete()

        return Response(
            {
                "message":"Order created successfully",
                "total_price": order.total_price
            },
            status=status.HTTP_201_CREATED
        )

