from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime, date
from uuid import UUID
from decimal import Decimal


class BrandCreate(BaseModel):
    name_ar: str
    name_en: str
    logo_url: Optional[str] = None
    country: Optional[str] = None


class BrandResponse(BrandCreate):
    id: UUID
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class VehicleModelCreate(BaseModel):
    brand_id: UUID
    name_ar: str
    name_en: str
    year: int
    category: Optional[str] = None
    body_type: str
    fuel_type: str
    engine_capacity: Optional[float] = None
    transmission: str
    seating_capacity: Optional[int] = None


class VehicleModelResponse(VehicleModelCreate):
    id: UUID
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class TrimCreate(BaseModel):
    model_id: UUID
    name_ar: str
    name_en: str
    price_base: float
    price_aed: float


class TrimResponse(TrimCreate):
    id: UUID

    class Config:
        from_attributes = True


class VehicleCreate(BaseModel):
    vin: str = Field(..., max_length=17, min_length=11)
    chassis_number: Optional[str] = None
    engine_number: Optional[str] = None
    model_id: UUID
    trim_id: Optional[UUID] = None
    color_id: Optional[UUID] = None
    year: int
    condition: str = "new"
    vehicle_type: str = "new"
    purchase_price: Optional[float] = None
    purchase_date: Optional[date] = None
    sale_price: Optional[float] = None
    mileage: Optional[float] = 0
    features: Optional[List[str]] = None
    notes: Optional[str] = None


class VehicleUpdate(BaseModel):
    status: Optional[str] = None
    sale_price: Optional[float] = None
    mileage: Optional[float] = None
    license_plate: Optional[str] = None
    notes: Optional[str] = None
    insurance_provider: Optional[str] = None
    insurance_expiry: Optional[date] = None


class VehicleResponse(VehicleCreate):
    id: UUID
    status: str
    images_count: int
    has_360_view: bool
    has_video: bool
    is_active: bool
    created_at: datetime
    updated_at: datetime
    model: Optional[VehicleModelResponse] = None
    trim: Optional[TrimResponse] = None

    class Config:
        from_attributes = True


class VehicleListResponse(BaseModel):
    items: List[VehicleResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class VehicleImageResponse(BaseModel):
    id: UUID
    url: str
    image_type: str
    is_primary: bool
    sort_order: int

    class Config:
        from_attributes = True


class InventorySearchParams(BaseModel):
    query: Optional[str] = None
    brand_id: Optional[UUID] = None
    model_id: Optional[UUID] = None
    status: Optional[str] = None
    condition: Optional[str] = None
    vehicle_type: Optional[str] = None
    year_from: Optional[int] = None
    year_to: Optional[int] = None
    price_min: Optional[float] = None
    price_max: Optional[float] = None
    page: int = 1
    page_size: int = 20
    sort_by: str = "created_at"
    sort_order: str = "desc"
