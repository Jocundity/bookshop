from rest_framework import serializers
from .models import Book, Cart, CartItem, Order, OrderItem

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'

    def validate_stock(self, value):
        if value < 0:
            raise serializers.ValidationError("Stock cannot be negative")
        return value
        
    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError("Price cannot be negative")
        return value

class CartItemSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)

    book_id = serializers.PrimaryKeyRelatedField(
        queryset = Book.objects.all(),
        source = "book",
        write_only=True
    )

    total_price = serializers.SerializerMethodField()
    class Meta:
        model = CartItem
        fields = ['id', 'book', 'book_id', 'quantity', 'total_price']

    def validate(self, data):
        quantity = data.get("quantity")
        book = data.get("book") or getattr(self.instance, "book", None)

        if quantity <= 0:
            raise serializers.ValidationError("Quantity must be greater than 0.")
        if quantity > book.stock:
            raise serializers.ValidationError("Quantity cannot exceed stock.")

        return data
    
    def get_total_price(self, obj):
        return obj.book.price * obj.quantity


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(source="cartitem_set", many=True, read_only=True)
    class Meta:
        model = Cart
        fields = ['id', 'items']

class OrderItemSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)
    total_price = serializers.SerializerMethodField()
    class Meta:
        model = OrderItem
        fields = ['id', 'book', 'quantity', 'total_price']

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than 0.")
        return value
    
    def get_total_price(self, obj):
        return obj.book.price * obj.quantity
    
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(source="orderitem_set", many=True, read_only=True)
    class Meta:
        model = Order
        fields = ['id', 'placed', 'items', 'total_price']


