from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from typing import Optional, List
from uuid import UUID

from app.database import get_db
from app.core.security import get_current_user, role_required
from app.models.inventory import Brand, VehicleModel, VehicleTrim, VehicleColor, Vehicle, VehicleImage
from app.schemas.inventory import (
    BrandCreate, BrandResponse, VehicleModelCreate, VehicleModelResponse,
    VehicleCreate, VehicleUpdate, VehicleResponse, VehicleListResponse,
    TrimCreate, TrimResponse, InventorySearchParams,
)

router = APIRouter()


@router.get("/brands", response_model=List[BrandResponse])
async def list_brands(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Brand).where(Brand.is_active == True))
    return result.scalars().all()


@router.post("/brands", response_model=BrandResponse)
async def create_brand(
    data: BrandCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(role_required("admin", "general_manager")),
):
    brand = Brand(**data.model_dump())
    db.add(brand)
    await db.commit()
    await db.refresh(brand)
    return brand


@router.get("/models", response_model=List[VehicleModelResponse])
async def list_models(
    brand_id: Optional[UUID] = None,
    year: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
):
    query = select(VehicleModel).where(VehicleModel.is_active == True)
    if brand_id:
        query = query.where(VehicleModel.brand_id == brand_id)
    if year:
        query = query.where(VehicleModel.year == year)
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/models", response_model=VehicleModelResponse)
async def create_model(
    data: VehicleModelCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(role_required("admin", "general_manager")),
):
    model = VehicleModel(**data.model_dump())
    db.add(model)
    await db.commit()
    await db.refresh(model)
    return model


@router.post("/trims", response_model=TrimResponse)
async def create_trim(
    data: TrimCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(role_required("admin", "general_manager")),
):
    trim = VehicleTrim(**data.model_dump())
    db.add(trim)
    await db.commit()
    await db.refresh(trim)
    return trim


@router.get("/colors")
async def list_colors(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(VehicleColor).where(VehicleColor.is_active == True))
    return result.scalars().all()


@router.get("/", response_model=VehicleListResponse)
async def list_vehicles(
    query: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    condition: Optional[str] = Query(None),
    vehicle_type: Optional[str] = Query(None),
    brand_id: Optional[UUID] = Query(None),
    model_id: Optional[UUID] = Query(None),
    year_from: Optional[int] = Query(None),
    year_to: Optional[int] = Query(None),
    price_min: Optional[float] = Query(None),
    price_max: Optional[float] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    sort_by: str = Query("created_at"),
    sort_order: str = Query("desc"),
    db: AsyncSession = Depends(get_db),
):
    q = select(Vehicle).where(Vehicle.is_deleted == False)
    if query:
        q = q.where(
            or_(
                Vehicle.vin.ilike(f"%{query}%"),
                Vehicle.chassis_number.ilike(f"%{query}%"),
                Vehicle.license_plate.ilike(f"%{query}%"),
            )
        )
    if status:
        q = q.where(Vehicle.status == status)
    if condition:
        q = q.where(Vehicle.condition == condition)
    if vehicle_type:
        q = q.where(Vehicle.vehicle_type == vehicle_type)
    if brand_id:
        q = q.join(VehicleModel).where(VehicleModel.brand_id == brand_id)
    if model_id:
        q = q.where(Vehicle.model_id == model_id)
    if year_from:
        q = q.where(Vehicle.year >= year_from)
    if year_to:
        q = q.where(Vehicle.year <= year_to)
    if price_min:
        q = q.where(Vehicle.sale_price >= price_min)
    if price_max:
        q = q.where(Vehicle.sale_price <= price_max)

    count_q = select(func.count()).select_from(q.subquery())
    total = (await db.execute(count_q)).scalar()

    sort_col = getattr(Vehicle, sort_by, Vehicle.created_at)
    if sort_order == "desc":
        q = q.order_by(sort_col.desc())
    else:
        q = q.order_by(sort_col.asc())

    q = q.offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(q)
    items = result.scalars().all()

    return VehicleListResponse(
        items=[VehicleResponse.model_validate(v) for v in items],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=(total + page_size - 1) // page_size,
    )


@router.get("/{vehicle_id}", response_model=VehicleResponse)
async def get_vehicle(vehicle_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Vehicle).where(Vehicle.id == vehicle_id, Vehicle.is_deleted == False))
    vehicle = result.scalar_one_or_none()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return vehicle


@router.post("/", response_model=VehicleResponse)
async def create_vehicle(
    data: VehicleCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    existing = await db.execute(select(Vehicle).where(Vehicle.vin == data.vin))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="VIN already exists")
    vehicle = Vehicle(**data.model_dump(exclude_unset=True))
    db.add(vehicle)
    await db.commit()
    await db.refresh(vehicle)
    return vehicle


@router.put("/{vehicle_id}", response_model=VehicleResponse)
async def update_vehicle(
    vehicle_id: UUID,
    data: VehicleUpdate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    result = await db.execute(select(Vehicle).where(Vehicle.id == vehicle_id))
    vehicle = result.scalar_one_or_none()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(vehicle, key, value)
    await db.commit()
    await db.refresh(vehicle)
    return vehicle


@router.delete("/{vehicle_id}")
async def delete_vehicle(
    vehicle_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(role_required("admin", "general_manager")),
):
    result = await db.execute(select(Vehicle).where(Vehicle.id == vehicle_id))
    vehicle = result.scalar_one_or_none()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    vehicle.soft_delete()
    await db.commit()
    return {"message": "Vehicle deleted"}
