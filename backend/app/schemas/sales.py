from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, date
from uuid import UUID


class LeadCreate(BaseModel):
    customer_id: UUID
    source: str
    status: str = "new"
    priority: str = "medium"
    interest_model: Optional[str] = None
    interest_brand_id: Optional[UUID] = None
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None
    financing_required: bool = False
    trade_in_interest: bool = False
    notes: Optional[str] = None
    assigned_to: Optional[UUID] = None


class LeadUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None
    notes: Optional[str] = None
    assigned_to: Optional[UUID] = None
    expected_close_date: Optional[date] = None


class LeadResponse(LeadCreate):
    id: UUID
    lead_score: float
    lead_value: float
    converted_at: Optional[datetime] = None
    lost_reason: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TestDriveCreate(BaseModel):
    vehicle_id: UUID
    customer_id: UUID
    scheduled_at: datetime
    notes: Optional[str] = None


class TestDriveResponse(TestDriveCreate):
    id: UUID
    status: str
    feedback: Optional[str] = None
    rating: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


class QuotationCreate(BaseModel):
    opportunity_id: Optional[UUID] = None
    vehicle_id: UUID
    customer_id: UUID
    valid_until: date
    vehicle_price: float
    discount_amount: float = 0
    discount_type: str = "fixed"
    tax_amount: float = 0
    total_amount: float
    terms_conditions: Optional[str] = None
    notes: Optional[str] = None


class QuotationResponse(QuotationCreate):
    id: UUID
    quotation_number: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class ContractCreate(BaseModel):
    quotation_id: Optional[UUID] = None
    customer_id: UUID
    salesperson_id: UUID
    vehicle_id: UUID
    contract_date: date
    sale_type: str
    vehicle_price: float
    discount: float = 0
    tax_amount: float = 0
    total_amount: float
    deposit_amount: float = 0
    payment_terms: Optional[str] = None
    delivery_date: Optional[date] = None
    notes: Optional[str] = None


class ContractResponse(ContractCreate):
    id: UUID
    contract_number: str
    status: str
    delivery_status: str
    signed_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True
