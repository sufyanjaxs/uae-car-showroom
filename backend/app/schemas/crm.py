from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime, date
from uuid import UUID


class CustomerCreate(BaseModel):
    first_name: str
    last_name: str
    first_name_ar: Optional[str] = None
    last_name_ar: Optional[str] = None
    email: Optional[str] = None
    phone: str
    whatsapp: Optional[str] = None
    emirates_id: Optional[str] = None
    driving_license_number: Optional[str] = None
    nationality: Optional[str] = None
    city: Optional[str] = None
    emirate: Optional[str] = None
    preferred_language: str = "en"
    customer_type: str = "individual"
    notes: Optional[str] = None


class CustomerUpdate(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    emirate: Optional[str] = None
    notes: Optional[str] = None
    customer_segment: Optional[str] = None


class CustomerResponse(CustomerCreate):
    id: UUID
    customer_segment: Optional[str] = None
    total_vehicles_purchased: int
    total_revenue: float
    lifetime_value: float
    status: str
    onboarding_date: datetime
    created_at: datetime

    class Config:
        from_attributes = True


class CustomerListResponse(BaseModel):
    items: List[CustomerResponse]
    total: int
    page: int
    page_size: int


class InteractionCreate(BaseModel):
    customer_id: UUID
    interaction_type: str
    direction: str = "inbound"
    subject: str
    description: Optional[str] = None
    outcome: Optional[str] = None
    duration_minutes: Optional[int] = None
    assigned_to: Optional[UUID] = None


class InteractionResponse(InteractionCreate):
    id: UUID
    interaction_date: datetime
    sentiment_score: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True
