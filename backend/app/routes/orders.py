from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Order, OrderItem, Product, Customer
from app.schemas import OrderCreate, OrderResponse
from typing import List

router = APIRouter()

@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    """Create a new order"""
    # Verify customer exists
    customer = db.query(Customer).filter(Customer.id == order.customer_id).first()
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )
    
    # Validate all products and check inventory
    total_amount = 0
    items_data = []
    
    for item in order.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with ID {item.product_id} not found"
            )
        
        # Check if inventory is sufficient
        if product.quantity < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient inventory for product {product.name}. Available: {product.quantity}, Requested: {item.quantity}"
            )
        
        total_amount += product.price * item.quantity
        items_data.append((product, item.quantity))
    
    try:
        # Create order
        db_order = Order(
            customer_id=order.customer_id,
            total_amount=total_amount
        )
        db.add(db_order)
        db.flush()  # Get the order ID before committing
        
        # Create order items and reduce inventory
        for product, quantity in items_data:
            order_item = OrderItem(
                order_id=db_order.id,
                product_id=product.id,
                quantity=quantity,
                price=product.price
            )
            db.add(order_item)
            
            # Reduce product inventory
            product.quantity -= quantity
            db.add(product)
        
        db.commit()
        db.refresh(db_order)
        return db_order
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/", response_model=List[OrderResponse])
def list_orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Retrieve all orders"""
    orders = db.query(Order).offset(skip).limit(limit).all()
    return orders

@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: int, db: Session = Depends(get_db)):
    """Retrieve order details by ID"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    return order

@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(order_id: int, db: Session = Depends(get_db)):
    """Cancel/Delete an order and restore inventory"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    try:
        # Restore inventory for all order items
        for item in order.items:
            product = db.query(Product).filter(Product.id == item.product_id).first()
            if product:
                product.quantity += item.quantity
                db.add(product)
        
        # Delete order
        db.delete(order)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    
    return None
