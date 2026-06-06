import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Boolean, Integer, Float, DateTime, Date,
    Text, ForeignKey, UniqueConstraint, Index, Enum as SAEnum,
    JSON,
)
from app.database import UUID
from sqlalchemy.orm import relationship
import enum

from app.models.core import BaseModel, TenantMixin, AuditMixin


class VehicleCondition(str, enum.Enum):
    NEW = "new"
    USED = "used"
    CERTIFIED = "certified"


class VehicleStatus(str, enum.Enum):
    IN_TRANSIT = "in_transit"
    IN_STOCK = "in_stock"
    RESERVED = "reserved"
    SOLD = "sold"
    SERVICING = "servicing"


class VehicleType(str, enum.Enum):
    NEW = "new"
    USED = "used"
    TRADE_IN = "trade_in"
    CONSIGNMENT = "consignment"


class FuelType(str, enum.Enum):
    PETROL = "petrol"
    DIESEL = "diesel"
    ELECTRIC = "electric"
    HYBRID = "hybrid"
    PLUGIN_HYBRID = "plugin_hybrid"


class Transmission(str, enum.Enum):
    MANUAL = "manual"
    AUTOMATIC = "automatic"
    CVT = "cvt"
    DCT = "dct"


class BodyType(str, enum.Enum):
    SEDAN = "sedan"
    SUV = "suv"
    HATCHBACK = "hatchback"
    COUPE = "coupe"
    CONVERTIBLE = "convertible"
    WAGON = "wagon"
    PICKUP = "pickup"
    VAN = "van"
    LUXURY = "luxury"


class Brand(BaseModel):
    __tablename__ = "brands"
    name_ar = Column(String(200), nullable=False)
    name_en = Column(String(200), nullable=False)
    logo_url = Column(String(500))
    country = Column(String(100))
    models = relationship("VehicleModel", back_populates="brand", lazy="selectin")


class VehicleModel(BaseModel):
    __tablename__ = "vehicle_models"
    brand_id = Column(UUID(as_uuid=True), ForeignKey("brands.id"), nullable=False)
    name_ar = Column(String(200), nullable=False)
    name_en = Column(String(200), nullable=False)
    year = Column(Integer, nullable=False)
    category = Column(String(100))
    body_type = Column(SAEnum(BodyType), nullable=False)
    fuel_type = Column(SAEnum(FuelType), nullable=False)
    engine_capacity = Column(Float)
    transmission = Column(SAEnum(Transmission), nullable=False)
    seating_capacity = Column(Integer)

    brand = relationship("Brand", back_populates="models")
    trims = relationship("VehicleTrim", back_populates="model", lazy="selectin")


class VehicleTrim(BaseModel):
    __tablename__ = "vehicle_trims"
    model_id = Column(UUID(as_uuid=True), ForeignKey("vehicle_models.id"), nullable=False)
    name_ar = Column(String(200), nullable=False)
    name_en = Column(String(200), nullable=False)
    price_base = Column(Float, nullable=False)
    price_aed = Column(Float, nullable=False)

    model = relationship("VehicleModel", back_populates="trims")


class VehicleColor(BaseModel):
    __tablename__ = "vehicle_colors"
    name_ar = Column(String(100), nullable=False)
    name_en = Column(String(100), nullable=False)
    hex_code = Column(String(7), nullable=False)
    color_type = Column(String(50))


class Vehicle(BaseModel, TenantMixin, AuditMixin):
    __tablename__ = "vehicles"
    vin = Column(String(17), unique=True, nullable=False, index=True)
    chassis_number = Column(String(50), unique=True)
    engine_number = Column(String(50))
    model_id = Column(UUID(as_uuid=True), ForeignKey("vehicle_models.id"), nullable=False)
    trim_id = Column(UUID(as_uuid=True), ForeignKey("vehicle_trims.id"))
    color_id = Column(UUID(as_uuid=True), ForeignKey("vehicle_colors.id"))
    year = Column(Integer, nullable=False)
    license_plate = Column(String(20))
    registration_number = Column(String(50))
    registration_expiry = Column(Date)
    insurance_provider = Column(String(200))
    insurance_policy_number = Column(String(100))
    insurance_expiry = Column(Date)
    warranty_type = Column(String(100))
    warranty_expiry = Column(Date)
    mileage = Column(Float, default=0)
    fuel_level = Column(Float)
    condition = Column(SAEnum(VehicleCondition), nullable=False, default=VehicleCondition.NEW)
    status = Column(SAEnum(VehicleStatus), nullable=False, default=VehicleStatus.IN_STOCK)
    vehicle_type = Column(SAEnum(VehicleType), nullable=False, default=VehicleType.NEW)
    stock_location = Column(String(200))
    showroom_location = Column(String(200))
    owner_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"))
    purchase_price = Column(Float)
    purchase_date = Column(Date)
    sale_price = Column(Float)
    tax_amount = Column(Float)
    total_cost = Column(Float)
    profit_margin = Column(Float)
    is_imported = Column(Boolean, default=False)
    import_document_url = Column(String(500))
    customs_document_url = Column(String(500))
    uae_compliance_doc_url = Column(String(500))
    compliance_status = Column(String(50))
    service_history = Column(JSON, default=list)
    ownership_history = Column(JSON, default=list)
    accident_records = Column(JSON, default=list)
    documents = Column(JSON, default=list)
    features = Column(JSON, default=list)
    inspection_status = Column(String(50))
    inspection_date = Column(Date)
    inspector_id = Column(UUID(as_uuid=True))
    notes = Column(Text)
    images_count = Column(Integer, default=0)
    has_360_view = Column(Boolean, default=False)
    has_video = Column(Boolean, default=False)
    video_urls = Column(JSON, default=list)
    virtual_showroom_url = Column(String(500))
    rfid_tag = Column(String(100), unique=True)

    model = relationship("VehicleModel", lazy="selectin")
    trim = relationship("VehicleTrim", lazy="selectin")
    color = relationship("VehicleColor", lazy="selectin")
    images = relationship("VehicleImage", back_populates="vehicle", lazy="selectin")
    documents_rel = relationship("VehicleDocument", back_populates="vehicle", lazy="selectin")

    __table_args__ = (
        UniqueConstraint("vin", name="uq_vehicle_vin"),
        Index("ix_vehicle_status", "status"),
        Index("ix_vehicle_brand_year", "model_id", "year"),
    )


class VehicleImage(BaseModel):
    __tablename__ = "vehicle_images"
    vehicle_id = Column(UUID(as_uuid=True), ForeignKey("vehicles.id"), nullable=False)
    url = Column(String(500), nullable=False)
    image_type = Column(String(50), nullable=False)
    is_primary = Column(Boolean, default=False)
    sort_order = Column(Integer, default=0)

    vehicle = relationship("Vehicle", back_populates="images")


class VehicleDocument(BaseModel):
    __tablename__ = "vehicle_documents"
    vehicle_id = Column(UUID(as_uuid=True), ForeignKey("vehicles.id"), nullable=False)
    document_type = Column(String(100), nullable=False)
    document_number = Column(String(100))
    document_url = Column(String(500))
    expiry_date = Column(Date)

    vehicle = relationship("Vehicle", back_populates="documents_rel")


class InventoryTransfer(BaseModel, AuditMixin):
    __tablename__ = "inventory_transfers"
    vehicle_id = Column(UUID(as_uuid=True), ForeignKey("vehicles.id"), nullable=False)
    from_branch_id = Column(UUID(as_uuid=True), nullable=False)
    to_branch_id = Column(UUID(as_uuid=True), nullable=False)
    transferred_by = Column(UUID(as_uuid=True), ForeignKey("employees.id"))
    status = Column(String(50), default="pending")
    transfer_date = Column(DateTime(timezone=True))
    received_date = Column(DateTime(timezone=True))
    notes = Column(Text)


class StockAlert(BaseModel):
    __tablename__ = "stock_alerts"
    vehicle_id = Column(UUID(as_uuid=True), ForeignKey("vehicles.id"), nullable=False)
    alert_type = Column(String(50), nullable=False)
    message = Column(Text)
    is_resolved = Column(Boolean, default=False)


class VehicleBooking(BaseModel):
    __tablename__ = "vehicle_bookings"
    vehicle_id = Column(UUID(as_uuid=True), ForeignKey("vehicles.id"), nullable=False)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"), nullable=False)
    booking_type = Column(String(50), nullable=False)
    status = Column(String(50), default="pending")
    booking_date = Column(DateTime(timezone=True))
    notes = Column(Text)
