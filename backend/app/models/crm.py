from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, Integer, Float, DateTime, Date, Text, ForeignKey, Enum as SAEnum, JSON
from app.database import UUID
from sqlalchemy.orm import relationship
import enum

from app.models.core import BaseModel, TenantMixin, AuditMixin


class CustomerType(str, enum.Enum):
    INDIVIDUAL = "individual"
    COMPANY = "company"
    VIP = "vip"


class PreferredLanguage(str, enum.Enum):
    ARABIC = "ar"
    ENGLISH = "en"


class CustomerStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    BLOCKED = "blocked"


class Customer(BaseModel, TenantMixin, AuditMixin):
    __tablename__ = "customers"
    customer_type = Column(SAEnum(CustomerType), nullable=False, default=CustomerType.INDIVIDUAL)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    first_name_ar = Column(String(100))
    last_name_ar = Column(String(100))
    email = Column(String(200), unique=True, index=True)
    phone = Column(String(20), unique=True, nullable=False, index=True)
    phone2 = Column(String(20))
    whatsapp = Column(String(20))
    emirates_id = Column(String(50), unique=True)
    driving_license_number = Column(String(50))
    driving_license_expiry = Column(Date)
    passport_number = Column(String(50))
    nationality = Column(String(100))
    date_of_birth = Column(Date)
    gender = Column(String(20))
    marital_status = Column(String(20))
    occupation = Column(String(200))
    employer = Column(String(200))
    annual_income = Column(Float)
    address = Column(Text)
    city = Column(String(100))
    emirate = Column(String(100))
    country = Column(String(100), default="UAE")
    preferred_language = Column(SAEnum(PreferredLanguage), default=PreferredLanguage.ENGLISH)
    preferred_contact_method = Column(String(50))
    communication_channels = Column(JSON, default=list)
    notes = Column(Text)
    tags = Column(JSON, default=list)
    customer_segment = Column(String(50))
    total_vehicles_purchased = Column(Integer, default=0)
    total_revenue = Column(Float, default=0)
    lifetime_value = Column(Float, default=0)
    last_purchase_date = Column(DateTime(timezone=True))
    next_follow_up = Column(DateTime(timezone=True))
    status = Column(SAEnum(CustomerStatus), default=CustomerStatus.ACTIVE)
    onboarding_date = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    interactions = relationship("Interaction", back_populates="customer", lazy="selectin")
    timeline = relationship("CustomerTimeline", back_populates="customer", lazy="selectin")


class Company(BaseModel, TenantMixin, AuditMixin):
    __tablename__ = "companies"
    company_name = Column(String(300), nullable=False)
    company_name_ar = Column(String(300))
    trade_license = Column(String(100), unique=True)
    tax_registration_number = Column(String(50), unique=True)
    address = Column(Text)
    city = Column(String(100))
    emirate = Column(String(100))
    phone = Column(String(20))
    email = Column(String(200))
    website = Column(String(200))
    industry = Column(String(100))
    account_manager_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"))
    status = Column(String(50), default="active")


class Contact(BaseModel):
    __tablename__ = "contacts"
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"))
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"))
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(200))
    phone = Column(String(20))
    position = Column(String(200))
    is_primary = Column(Boolean, default=False)


class Interaction(BaseModel, TenantMixin, AuditMixin):
    __tablename__ = "interactions"
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"), nullable=False)
    interaction_type = Column(String(50), nullable=False)
    direction = Column(String(20), nullable=False)
    subject = Column(String(300))
    description = Column(Text)
    outcome = Column(String(500))
    interaction_date = Column(DateTime(timezone=True), nullable=False)
    duration_minutes = Column(Integer)
    assigned_to = Column(UUID(as_uuid=True), ForeignKey("employees.id"))
    related_entity_type = Column(String(50))
    related_entity_id = Column(UUID(as_uuid=True))
    sentiment_score = Column(Float)

    customer = relationship("Customer", back_populates="interactions")


class CustomerTimeline(BaseModel):
    __tablename__ = "customer_timelines"
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"), nullable=False)
    event_type = Column(String(100), nullable=False)
    description = Column(Text)
    metadata_json = Column(JSON, default=dict)

    customer = relationship("Customer", back_populates="timeline")


class CustomerSegment(BaseModel):
    __tablename__ = "customer_segments"
    name_ar = Column(String(200), nullable=False)
    name_en = Column(String(200), nullable=False)
    criteria = Column(JSON, default=dict)
    description = Column(Text)


class VIPCustomer(BaseModel):
    __tablename__ = "vip_customers"
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"), nullable=False, unique=True)
    vip_level = Column(String(50), nullable=False)
    membership_number = Column(String(50), unique=True)
    privileges = Column(JSON, default=list)
    personal_assistant_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"))


class CommunicationTemplate(BaseModel):
    __tablename__ = "communication_templates"
    name = Column(String(200), nullable=False)
    subject = Column(String(500))
    body = Column(Text, nullable=False)
    type = Column(String(50), nullable=False)
    variables = Column(JSON, default=list)
    language = Column(String(10), default="en")
