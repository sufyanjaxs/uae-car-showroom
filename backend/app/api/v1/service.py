from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional, List
from uuid import UUID

from app.database import get_db
from app.core.security import get_current_user, role_required
from app.models.service import ServiceAppointment, ServiceOrder, RepairOrder, SparePart, SparePartInventory, Technician, WarrantyClaim

router = APIRouter()


@router.get("/appointments")
async def list_appointments(
    status: Optional[str] = Query(None),
    technician_id: Optional[UUID] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    q = select(ServiceAppointment).where(ServiceAppointment.is_deleted == False)
    if status:
        q = q.where(ServiceAppointment.status == status)
    if technician_id:
        q = q.where(ServiceAppointment.assigned_technician_id == technician_id)
    q = q.order_by(ServiceAppointment.appointment_date.desc())
    result = await db.execute(q)
    return result.scalars().all()


@router.post("/appointments")
async def create_appointment(
    customer_id: UUID,
    vehicle_id: UUID,
    service_type: str,
    appointment_date: str,
    notes: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    appointment = ServiceAppointment(
        customer_id=customer_id,
        vehicle_id=vehicle_id,
        service_type=service_type,
        appointment_date=appointment_date,
        notes=notes,
    )
    db.add(appointment)
    await db.commit()
    await db.refresh(appointment)
    return appointment


@router.get("/spare-parts")
async def list_spare_parts(
    query: Optional[str] = Query(None),
    low_stock: bool = False,
    db: AsyncSession = Depends(get_db),
):
    q = select(SparePart).where(SparePart.is_active == True)
    if query:
        q = q.where(
            SparePart.part_number.ilike(f"%{query}%") |
            SparePart.part_name_en.ilike(f"%{query}%") |
            SparePart.part_name_ar.ilike(f"%{query}%")
        )
    if low_stock:
        q = q.where(SparePart.current_stock <= SparePart.minimum_stock)
    result = await db.execute(q)
    return result.scalars().all()


@router.get("/warranty-claims")
async def list_warranty_claims(
    status: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    q = select(WarrantyClaim).where(WarrantyClaim.is_deleted == False)
    if status:
        q = q.where(WarrantyClaim.status == status)
    q = q.order_by(WarrantyClaim.submitted_date.desc())
    result = await db.execute(q)
    return result.scalars().all()
