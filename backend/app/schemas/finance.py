from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, date
from uuid import UUID


class InvoiceCreate(BaseModel):
    invoice_type: str
    customer_id: Optional[UUID] = None
    vehicle_id: Optional[UUID] = None
    contract_id: Optional[UUID] = None
    issue_date: date
    due_date: date
    line_items: list = []
    subtotal: float
    discount_amount: float = 0
    vat_amount: float
    total_amount: float
    payment_terms: Optional[str] = None
    notes: Optional[str] = None


class InvoiceResponse(InvoiceCreate):
    id: UUID
    invoice_number: str
    paid_amount: float
    balance_due: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class PaymentCreate(BaseModel):
    invoice_id: UUID
    payment_date: datetime
    amount: float
    payment_method: str
    reference_number: Optional[str] = None
    notes: Optional[str] = None


class PaymentResponse(PaymentCreate):
    id: UUID
    status: str
    receipt_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class LoanApplicationCreate(BaseModel):
    customer_id: UUID
    vehicle_id: UUID
    bank_name: str
    loan_amount: float
    down_payment: float
    interest_rate: float
    tenure_months: int


class LoanApplicationResponse(LoanApplicationCreate):
    id: UUID
    emi_amount: Optional[float] = None
    status: str
    application_date: date
    approval_date: Optional[date] = None

    class Config:
        from_attributes = True


class VATRecordResponse(BaseModel):
    id: UUID
    vat_number: str
    period_start: date
    period_end: date
    total_sales: float
    total_vat_collected: float
    total_expenses: float
    total_vat_paid: float
    net_vat_due: float
    status: str

    class Config:
        from_attributes = True
