from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from typing import Optional, List
from uuid import UUID

from app.database import get_db
from app.core.security import get_current_user
from app.models.crm import Customer, Interaction, CustomerTimeline
from app.models.sales import SalesLead
from app.schemas.crm import (
    CustomerCreate, CustomerUpdate, CustomerResponse, CustomerListResponse,
    InteractionCreate, InteractionResponse,
)

router = APIRouter()


@router.get("/customers", response_model=CustomerListResponse)
async def list_customers(
    query: Optional[str] = Query(None),
    customer_type: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    segment: Optional[str] = Query(None),
    emirate: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    q = select(Customer).where(Customer.is_deleted == False)
    if query:
        q = q.where(
            or_(
                Customer.first_name.ilike(f"%{query}%"),
                Customer.last_name.ilike(f"%{query}%"),
                Customer.phone.ilike(f"%{query}%"),
                Customer.email.ilike(f"%{query}%"),
                Customer.emirates_id.ilike(f"%{query}%"),
            )
        )
    if customer_type:
        q = q.where(Customer.customer_type == customer_type)
    if status:
        q = q.where(Customer.status == status)
    if segment:
        q = q.where(Customer.customer_segment == segment)
    if emirate:
        q = q.where(Customer.emirate == emirate)

    count_q = select(func.count()).select_from(q.subquery())
    total = (await db.execute(count_q)).scalar()

    q = q.order_by(Customer.created_at.desc()).offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(q)
    items = result.scalars().all()

    return CustomerListResponse(
        items=[CustomerResponse.model_validate(c) for c in items],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/customers/{customer_id}", response_model=CustomerResponse)
async def get_customer(customer_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Customer).where(Customer.id == customer_id))
    customer = result.scalar_one_or_none()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer


@router.post("/customers", response_model=CustomerResponse)
async def create_customer(
    data: CustomerCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    customer = Customer(**data.model_dump())
    db.add(customer)
    await db.commit()
    await db.refresh(customer)
    await db.execute(
        CustomerTimeline.__table__.insert().values(
            customer_id=customer.id,
            event_type="customer_created",
            description="Customer record created",
        )
    )
    await db.commit()
    return customer


@router.put("/customers/{customer_id}", response_model=CustomerResponse)
async def update_customer(
    customer_id: UUID,
    data: CustomerUpdate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    result = await db.execute(select(Customer).where(Customer.id == customer_id))
    customer = result.scalar_one_or_none()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(customer, key, value)
    await db.commit()
    await db.refresh(customer)
    return customer


@router.get("/customers/{customer_id}/timeline")
async def get_customer_timeline(customer_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(CustomerTimeline)
        .where(CustomerTimeline.customer_id == customer_id)
        .order_by(CustomerTimeline.created_at.desc())
    )
    return result.scalars().all()


@router.post("/interactions", response_model=InteractionResponse)
async def log_interaction(
    data: InteractionCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    interaction = Interaction(**data.model_dump())
    db.add(interaction)
    await db.commit()
    await db.refresh(interaction)
    return interaction


@router.get("/customers/{customer_id}/interactions")
async def get_customer_interactions(customer_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Interaction)
        .where(Interaction.customer_id == customer_id)
        .order_by(Interaction.interaction_date.desc())
    )
    return result.scalars().all()
