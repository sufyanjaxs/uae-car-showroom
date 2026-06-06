import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, Integer, Float, DateTime, Date, Text, ForeignKey, Enum as SAEnum, JSON
from app.database import UUID
from sqlalchemy.orm import relationship
import enum

from app.models.core import BaseModel, TenantMixin, AuditMixin


class LeadSource(str, enum.Enum):
    WEBSITE = "website"
    PHONE = "phone"
    WHATSAPP = "whatsapp"
    EMAIL = "email"
    WALKIN = "walkin"
    REFERRAL = "referral"
    SOCIAL_MEDIA = "social_media"
    INSTAGRAM = "instagram"
    FACEBOOK = "facebook"
    TIKTOK = "tiktok"
    GOOGLE_ADS = "google_ads"


class LeadStatus(str, enum.Enum):
    NEW = "new"
    CONTACTED = "contacted"
    QUALIFIED = "qualified"
    PROPOSAL = "proposal"
    NEGOTIATION = "negotiation"
    CLOSED_WON = "closed_won"
    CLOSED_LOST = "closed_lost"


class SalesLead(BaseModel, TenantMixin, AuditMixin):
    __tablename__ = "sales_leads"
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"), nullable=False)
    assigned_to = Column(UUID(as_uuid=True), ForeignKey("employees.id"))
    source = Column(SAEnum(LeadSource), nullable=False)
    status = Column(SAEnum(LeadStatus), nullable=False, default=LeadStatus.NEW)
    priority = Column(String(20), default="medium")
    interest_model = Column(String(200))
    interest_brand_id = Column(UUID(as_uuid=True), ForeignKey("brands.id"))
    budget_min = Column(Float)
    budget_max = Column(Float)
    financing_required = Column(Boolean, default=False)
    trade_in_interest = Column(Boolean, default=False)
    notes = Column(Text)
    expected_close_date = Column(Date)
    converted_at = Column(DateTime(timezone=True))
    lost_reason = Column(String(500))
    lead_score = Column(Float, default=0.0)
    lead_value = Column(Float, default=0.0)

    customer = relationship("Customer", lazy="selectin")
    opportunities = relationship("Opportunity", back_populates="lead", lazy="selectin")


class Opportunity(BaseModel, TenantMixin, AuditMixin):
    __tablename__ = "opportunities"
    lead_id = Column(UUID(as_uuid=True), ForeignKey("sales_leads.id"), nullable=False)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"), nullable=False)
    assigned_to = Column(UUID(as_uuid=True), ForeignKey("employees.id"))
    stage = Column(String(50), nullable=False, default="qualification")
    amount = Column(Float, default=0.0)
    probability = Column(Float, default=0.0)
    expected_close_date = Column(Date)
    notes = Column(Text)

    lead = relationship("SalesLead", back_populates="opportunities")


class TestDrive(BaseModel, TenantMixin):
    __tablename__ = "test_drives"
    vehicle_id = Column(UUID(as_uuid=True), ForeignKey("vehicles.id"), nullable=False)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"), nullable=False)
    salesperson_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"))
    scheduled_at = Column(DateTime(timezone=True), nullable=False)
    status = Column(String(50), default="scheduled")
    feedback = Column(Text)
    rating = Column(Integer)
    notes = Column(Text)


class SalesQuotation(BaseModel, TenantMixin, AuditMixin):
    __tablename__ = "sales_quotations"
    quotation_number = Column(String(50), unique=True, nullable=False)
    opportunity_id = Column(UUID(as_uuid=True), ForeignKey("opportunities.id"))
    vehicle_id = Column(UUID(as_uuid=True), ForeignKey("vehicles.id"), nullable=False)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"), nullable=False)
    salesperson_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"))
    valid_until = Column(Date, nullable=False)
    vehicle_price = Column(Float, nullable=False)
    discount_amount = Column(Float, default=0)
    discount_type = Column(String(20), default="fixed")
    tax_amount = Column(Float, default=0)
    total_amount = Column(Float, nullable=False)
    status = Column(String(50), default="draft")
    terms_conditions = Column(Text)
    notes = Column(Text)


class SalesContract(BaseModel, TenantMixin, AuditMixin):
    __tablename__ = "sales_contracts"
    contract_number = Column(String(50), unique=True, nullable=False)
    quotation_id = Column(UUID(as_uuid=True), ForeignKey("sales_quotations.id"))
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"), nullable=False)
    salesperson_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"))
    vehicle_id = Column(UUID(as_uuid=True), ForeignKey("vehicles.id"), nullable=False)
    contract_date = Column(Date, nullable=False)
    sale_type = Column(String(50), nullable=False)
    vehicle_price = Column(Float, nullable=False)
    discount = Column(Float, default=0)
    tax_amount = Column(Float, default=0)
    total_amount = Column(Float, nullable=False)
    deposit_amount = Column(Float, default=0)
    balance_due = Column(Float, default=0)
    payment_terms = Column(String(500))
    delivery_date = Column(Date)
    delivery_status = Column(String(50), default="pending")
    status = Column(String(50), default="draft")
    signature_customer = Column(Text)
    signature_salesperson = Column(Text)
    signed_at = Column(DateTime(timezone=True))
    notes = Column(Text)


class DeliveryChecklist(BaseModel):
    __tablename__ = "delivery_checklists"
    contract_id = Column(UUID(as_uuid=True), ForeignKey("sales_contracts.id"), nullable=False)
    vehicle_prepared = Column(Boolean, default=False)
    documents_ready = Column(Boolean, default=False)
    customer_notified = Column(Boolean, default=False)
    delivery_completed = Column(Boolean, default=False)
    delivered_at = Column(DateTime(timezone=True))
    notes = Column(Text)


class Commission(BaseModel, AuditMixin):
    __tablename__ = "commissions"
    contract_id = Column(UUID(as_uuid=True), ForeignKey("sales_contracts.id"), nullable=False)
    salesperson_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"), nullable=False)
    commission_type = Column(String(50), nullable=False)
    commission_amount = Column(Float, nullable=False)
    percentage = Column(Float)
    status = Column(String(50), default="pending")
    paid_at = Column(DateTime(timezone=True))
