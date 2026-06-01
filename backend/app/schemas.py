from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import List, Optional

# Product Schemas
class ProductCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    sku: str = Field(..., min_length=1, max_length=100)
    price: float = Field(..., gt=0)
    quantity: int = Field(default=0, ge=0)

class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    price: Optional[float] = Field(None, gt=0)
    quantity: Optional[int] = Field(None, ge=0)

class ProductResponse(BaseModel):
    id: int
    name: str
    sku: str
    price: float
    quantity: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Customer Schemas
class CustomerCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    phone: str = Field(..., min_length=1, max_length=20)

class CustomerUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    phone: Optional[str] = Field(None, min_length=1, max_length=20)

class CustomerResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Order Item Schemas
class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)

class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: float

    class Config:
        from_attributes = True

# Order Schemas
class OrderCreate(BaseModel):
    customer_id: int
    items: List[OrderItemCreate] = Field(..., min_items=1)

class OrderResponse(BaseModel):
    id: int
    customer_id: int
    total_amount: float
    status: str
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True

# Dashboard Schemas
class DashboardStats(BaseModel):
    total_products: int
    total_customers: int
    total_orders: int
    low_stock_products: List[ProductResponse]
    total_revenue: float
