from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, Integer, Float, DateTime, Date, Text, ForeignKey, Enum as SAEnum, JSON
from app.database import UUID
from sqlalchemy.orm import relationship
import enum

from app.models.core import BaseModel, TenantMixin, AuditMixin


class ServiceStatus(str, enum.Enum):
    SCHEDULED = "scheduled"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    ON_HOLD = "on_hold"


class ServiceAppointment(BaseModel, TenantMixin):
    __tablename__ = "service_appointments"
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"), nullable=False)
    vehicle_id = Column(UUID(as_uuid=True), ForeignKey("vehicles.id"), nullable=False)
    appointment_date = Column(DateTime(timezone=True), nullable=False)
    service_type = Column(String(100), nullable=False)
    description = Column(Text)
    status = Column(SAEnum(ServiceStatus), default=ServiceStatus.SCHEDULED)
    assigned_technician_id = Column(UUID(as_uuid=True), ForeignKey("technicians.id"))
    estimated_hours = Column(Float)
    estimated_cost = Column(Float)
    notes = Column(Text)


class ServiceOrder(BaseModel, TenantMixin, AuditMixin):
    __tablename__ = "service_orders"
    order_number = Column(String(50), unique=True, nullable=False)
    appointment_id = Column(UUID(as_uuid=True), ForeignKey("service_appointments.id"))
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"), nullable=False)
    vehicle_id = Column(UUID(as_uuid=True), ForeignKey("vehicles.id"), nullable=False)
    service_date = Column(Date, nullable=False)
    services = Column(JSON, default=list)
    parts_used = Column(JSON, default=list)
    labor_charges = Column(Float, default=0)
    parts_charges = Column(Float, default=0)
    total_amount = Column(Float, default=0)
    vat_amount = Column(Float, default=0)
    status = Column(String(50), default="pending")
    payment_status = Column(String(50), default="unpaid")
    customer_notes = Column(Text)
    internal_notes = Column(Text)
    completed_at = Column(DateTime(timezone=True))


class RepairOrder(BaseModel, TenantMixin, AuditMixin):
    __tablename__ = "repair_orders"
    order_number = Column(String(50), unique=True, nullable=False)
    vehicle_id = Column(UUID(as_uuid=True), ForeignKey("vehicles.id"), nullable=False)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"), nullable=False)
    reported_issue = Column(Text, nullable=False)
    diagnosis = Column(Text)
    diagnosis_date = Column(DateTime(timezone=True))
    technician_id = Column(UUID(as_uuid=True), ForeignKey("technicians.id"))
    estimated_cost = Column(Float)
    actual_cost = Column(Float)
    estimated_hours = Column(Float)
    actual_hours = Column(Float)
    parts_required = Column(JSON, default=list)
    status = Column(String(50), default="pending")
    priority = Column(String(20), default="normal")
    started_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))
    notes = Column(Text)


class SparePart(BaseModel):
    __tablename__ = "spare_parts"
    part_number = Column(String(100), unique=True, nullable=False)
    part_name_ar = Column(String(200))
    part_name_en = Column(String(200), nullable=False)
    description = Column(Text)
    category = Column(String(100))
    brand = Column(String(100))
    compatible_models = Column(JSON, default=list)
    unit_price = Column(Float, nullable=False)
    unit_cost = Column(Float)
    supplier_id = Column(UUID(as_uuid=True))
    minimum_stock = Column(Integer, default=0)
    current_stock = Column(Integer, default=0)
    location = Column(String(200))
    barcode = Column(String(100), unique=True)
    qr_code = Column(String(500))
    is_active = Column(Boolean, default=True)


class SparePartInventory(BaseModel, TenantMixin):
    __tablename__ = "spare_part_inventory"
    part_id = Column(UUID(as_uuid=True), ForeignKey("spare_parts.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    location = Column(String(200))
    batch_number = Column(String(100))
    expiry_date = Column(Date)
    received_date = Column(Date)


class Technician(BaseModel):
    __tablename__ = "technicians"
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"), nullable=False, unique=True)
    specialization = Column(String(200))
    certification = Column(String(500))
    hourly_rate = Column(Float)
    is_available = Column(Boolean, default=True)
    max_daily_jobs = Column(Integer, default=4)


class WarrantyClaim(BaseModel, TenantMixin, AuditMixin):
    __tablename__ = "warranty_claims"
    claim_number = Column(String(50), unique=True, nullable=False)
    vehicle_id = Column(UUID(as_uuid=True), ForeignKey("vehicles.id"), nullable=False)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"), nullable=False)
    warranty_type = Column(String(100), nullable=False)
    issue_description = Column(Text, nullable=False)
    diagnosis = Column(Text)
    claim_amount = Column(Float)
    approved_amount = Column(Float)
    status = Column(String(50), default="submitted")
    submitted_date = Column(Date, nullable=False)
    decision_date = Column(Date)
    rejection_reason = Column(Text)
    documents = Column(JSON, default=list)
