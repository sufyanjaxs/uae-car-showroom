from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional, List
from uuid import UUID

from app.database import get_db
from app.core.security import get_current_user, role_required
from app.models.marketing import Campaign, CampaignLead, MarketingTemplate

router = APIRouter()


@router.get("/campaigns")
async def list_campaigns(
    status: Optional[str] = Query(None),
    channel: Optional[str] = Query(None),
    campaign_type: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    q = select(Campaign).where(Campaign.is_deleted == False)
    if status:
        q = q.where(Campaign.status == status)
    if channel:
        q = q.where(Campaign.channel == channel)
    if campaign_type:
        q = q.where(Campaign.campaign_type == campaign_type)
    q = q.order_by(Campaign.created_at.desc())
    result = await db.execute(q)
    return result.scalars().all()


@router.post("/campaigns")
async def create_campaign(
    name: str,
    campaign_type: str,
    channel: str,
    start_date: str,
    budget: float = 0,
    target_leads: int = 0,
    description: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(role_required("admin", "marketing_manager")),
):
    campaign = Campaign(
        name=name,
        campaign_type=campaign_type,
        channel=channel,
        start_date=start_date,
        budget=budget,
        target_leads=target_leads,
        description=description,
    )
    db.add(campaign)
    await db.commit()
    await db.refresh(campaign)
    return campaign


@router.get("/campaigns/{campaign_id}")
async def get_campaign(campaign_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Campaign).where(Campaign.id == campaign_id))
    campaign = result.scalar_one_or_none()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign


@router.get("/templates")
async def list_templates(
    type: Optional[str] = Query(None),
    language: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    q = select(MarketingTemplate).where(MarketingTemplate.is_active == True)
    if type:
        q = q.where(MarketingTemplate.type == type)
    if language:
        q = q.where(MarketingTemplate.language == language)
    result = await db.execute(q)
    return result.scalars().all()
