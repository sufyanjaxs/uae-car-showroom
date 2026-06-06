from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, Integer, Float, DateTime, Date, Text, ForeignKey, Enum as SAEnum, JSON
from app.database import UUID
from sqlalchemy.orm import relationship
import enum

from app.models.core import BaseModel, TenantMixin, AuditMixin


class AccountType(str, enum.Enum):
    ASSET = "asset"
    LIABILITY = "liability"
    EQUITY = "equity"
    REVENUE = "revenue"
    EXPENSE = "expense"


class TransactionStatus(str, enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REVERSED = "reversed"


class Account(BaseModel, TenantMixin):
    __tablename__ = "accounts"
    account_name = Column(String(200), nullable=False)
    account_number = Column(String(50), unique=True, nullable=False)
    account_type = Column(SAEnum(AccountType), nullable=False)
    currency = Column(String(3), default="AED")
    balance = Column(Float, default=0.0)
    bank_name = Column(String(200))
    branch_code = Column(String(50))
    swift_code = Column(String(20))
    iban = Column(String(50), unique=True)
    is_active = Column(Boolean, default=True)


class Transaction(BaseModel, TenantMixin, AuditMixin):
    __tablename__ = "transactions"
    account_id = Column(UUID(as_uuid=True), ForeignKey("accounts.id"), nullable=False)
    transaction_type = Column(String(20), nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String(3), default="AED")
    description = Column(Text)
    reference_number = Column(String(100), unique=True)
    transaction_date = Column(DateTime(timezone=True), nullable=False)
    category = Column(String(100))
    payment_method = Column(String(50))
    status = Column(SAEnum(TransactionStatus), default=TransactionStatus.PENDING)
    related_entity_type = Column(String(50))
    related_entity_id = Column(UUID(as_uuid=True))
    vat_amount = Column(Float, default=0.0)
    vat_rate = Column(Float, default=0.05)


class Invoice(BaseModel, TenantMixin, AuditMixin):
    __tablename__ = "invoices"
    invoice_number = Column(String(50), unique=True, nullable=False)
    invoice_type = Column(String(50), nullable=False)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"))
    vehicle_id = Column(UUID(as_uuid=True), ForeignKey("vehicles.id"))
    contract_id = Column(UUID(as_uuid=True), ForeignKey("sales_contracts.id"))
    issue_date = Column(Date, nullable=False)
    due_date = Column(Date, nullable=False)
    line_items = Column(JSON, default=list)
    subtotal = Column(Float, nullable=False)
    discount_amount = Column(Float, default=0)
    vat_amount = Column(Float, nullable=False)
    total_amount = Column(Float, nullable=False)
    paid_amount = Column(Float, default=0)
    balance_due = Column(Float, nullable=False)
    status = Column(String(50), default="draft")
    payment_terms = Column(String(500))
    notes = Column(Text)


class Payment(BaseModel, TenantMixin, AuditMixin):
    __tablename__ = "payments"
    invoice_id = Column(UUID(as_uuid=True), ForeignKey("invoices.id"), nullable=False)
    payment_date = Column(DateTime(timezone=True), nullable=False)
    amount = Column(Float, nullable=False)
    payment_method = Column(String(50), nullable=False)
    reference_number = Column(String(100))
    bank_account = Column(String(100))
    status = Column(String(50), default="pending")
    notes = Column(Text)
    receipt_url = Column(String(500))


class Expense(BaseModel, TenantMixin, AuditMixin):
    __tablename__ = "expenses"
    expense_category = Column(String(100), nullable=False)
    amount = Column(Float, nullable=False)
    description = Column(Text)
    date = Column(Date, nullable=False)
    receipt_url = Column(String(500))
    approved_by = Column(UUID(as_uuid=True), ForeignKey("employees.id"))
    approved_at = Column(DateTime(timezone=True))
    status = Column(String(50), default="pending")


class LoanApplication(BaseModel, TenantMixin, AuditMixin):
    __tablename__ = "loan_applications"
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"), nullable=False)
    vehicle_id = Column(UUID(as_uuid=True), ForeignKey("vehicles.id"), nullable=False)
    bank_name = Column(String(200), nullable=False)
    loan_amount = Column(Float, nullable=False)
    down_payment = Column(Float, nullable=False)
    interest_rate = Column(Float, nullable=False)
    tenure_months = Column(Integer, nullable=False)
    emi_amount = Column(Float)
    status = Column(String(50), default="draft")
    application_date = Column(Date, nullable=False)
    approval_date = Column(Date)
    rejection_reason = Column(Text)
    documents = Column(JSON, default=list)


class LeaseContract(BaseModel, TenantMixin, AuditMixin):
    __tablename__ = "lease_contracts"
    contract_number = Column(String(50), unique=True, nullable=False)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"), nullable=False)
    vehicle_id = Column(UUID(as_uuid=True), ForeignKey("vehicles.id"), nullable=False)
    lease_start = Column(Date, nullable=False)
    lease_end = Column(Date, nullable=False)
    monthly_payment = Column(Float, nullable=False)
    security_deposit = Column(Float)
    mileage_limit = Column(Float)
    excess_mileage_charge = Column(Float)
    status = Column(String(50), default="active")
    early_termination_fee = Column(Float)


class VATRecord(BaseModel, TenantMixin):
    __tablename__ = "vat_records"
    vat_number = Column(String(50), nullable=False)
    period_start = Column(Date, nullable=False)
    period_end = Column(Date, nullable=False)
    total_sales = Column(Float, nullable=False)
    total_vat_collected = Column(Float, nullable=False)
    total_expenses = Column(Float, nullable=False)
    total_vat_paid = Column(Float, nullable=False)
    net_vat_due = Column(Float, nullable=False)
    filing_date = Column(Date)
    status = Column(String(50), default="pending")
    notes = Column(Text)
