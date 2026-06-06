from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from typing import Optional, List
from uuid import UUID

from app.database import get_db
from app.core.security import get_current_user, role_required
from app.models.sales import SalesLead, Opportunity, TestDrive, SalesQuotation, SalesContract, Commission
from app.models.crm import CustomerTimeline
from app.schemas.sales import (
    LeadCreate, LeadUpdate, LeadResponse,
    TestDriveCreate, TestDriveResponse,
    QuotationCreate, QuotationResponse,
    ContractCreate, ContractResponse,
)

router = APIRouter()


@router.get("/leads", response_model=List[LeadResponse])
async def list_leads(
    status: Optional[str] = Query(None),
    source: Optional[str] = Query(None),
    assigned_to: Optional[UUID] = Query(None),
    priority: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    q = select(SalesLead).where(SalesLead.is_deleted == False)
    if status:
        q = q.where(SalesLead.status == status)
    if source:
        q = q.where(SalesLead.source == source)
    if assigned_to:
        q = q.where(SalesLead.assigned_to == assigned_to)
    if priority:
        q = q.where(SalesLead.priority == priority)
    q = q.order_by(SalesLead.created_at.desc()).offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(q)
    return result.scalars().all()


@router.post("/leads", response_model=LeadResponse)
async def create_lead(
    data: LeadCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    lead = SalesLead(**data.model_dump())
    db.add(lead)
    await db.commit()
    await db.refresh(lead)
    timeline = CustomerTimeline(
        customer_id=data.customer_id,
        event_type="lead_created",
        description=f"New sales lead created from {data.source}",
    )
    db.add(timeline)
    await db.commit()
    return lead


@router.put("/leads/{lead_id}", response_model=LeadResponse)
async def update_lead(
    lead_id: UUID,
    data: LeadUpdate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    result = await db.execute(select(SalesLead).where(SalesLead.id == lead_id))
    lead = result.scalar_one_or_none()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(lead, key, value)
    await db.commit()
    await db.refresh(lead)
    return lead


@router.get("/leads/{lead_id}", response_model=LeadResponse)
async def get_lead(lead_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SalesLead).where(SalesLead.id == lead_id))
    lead = result.scalar_one_or_none()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead


@router.post("/test-drives", response_model=TestDriveResponse)
async def schedule_test_drive(
    data: TestDriveCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    test_drive = TestDrive(**data.model_dump())
    test_drive.salesperson_id = current_user.id
    db.add(test_drive)
    await db.commit()
    await db.refresh(test_drive)
    return test_drive


@router.post("/quotations", response_model=QuotationResponse)
async def create_quotation(
    data: QuotationCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    count = await db.execute(select(func.count()).select_from(SalesQuotation))
    total = count.scalar()
    quotation = SalesQuotation(
        quotation_number=f"QTN-{total + 1:06d}",
        salesperson_id=current_user.id,
        **data.model_dump(exclude_unset=True),
    )
    db.add(quotation)
    await db.commit()
    await db.refresh(quotation)
    return quotation


@router.post("/contracts", response_model=ContractResponse)
async def create_contract(
    data: ContractCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(role_required("admin", "sales_manager", "salesperson")),
):
    count = await db.execute(select(func.count()).select_from(SalesContract))
    total = count.scalar()
    contract = SalesContract(
        contract_number=f"CTR-{total + 1:06d}",
        **data.model_dump(exclude_unset=True),
    )
    db.add(contract)
    await db.commit()
    await db.refresh(contract)
    return contract


@router.get("/contracts", response_model=List[ContractResponse])
async def list_contracts(
    status: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    q = select(SalesContract).where(SalesContract.is_deleted == False)
    if status:
        q = q.where(SalesContract.status == status)
    q = q.order_by(SalesContract.created_at.desc())
    result = await db.execute(q)
    return result.scalars().all()
