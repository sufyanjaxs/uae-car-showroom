from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, Integer, Float, DateTime, Date, Text, ForeignKey, JSON
from app.database import UUID
from sqlalchemy.orm import relationship

from app.models.core import BaseModel, TenantMixin, AuditMixin


class Campaign(BaseModel, TenantMixin, AuditMixin):
    __tablename__ = "campaigns"
    name = Column(String(300), nullable=False)
    name_ar = Column(String(300))
    campaign_type = Column(String(50), nullable=False)
    channel = Column(String(50), nullable=False)
    description = Column(Text)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date)
    budget = Column(Float, default=0)
    actual_spend = Column(Float, default=0)
    target_audience = Column(JSON, default=dict)
    target_leads = Column(Integer, default=0)
    target_conversions = Column(Integer, default=0)
    leads_generated = Column(Integer, default=0)
    conversions = Column(Integer, default=0)
    revenue_generated = Column(Float, default=0)
    roi = Column(Float, default=0)
    status = Column(String(50), default="draft")
    content = Column(JSON, default=dict)
    analytics = Column(JSON, default=dict)
    notes = Column(Text)

    leads = relationship("CampaignLead", back_populates="campaign", lazy="selectin")


class CampaignLead(BaseModel):
    __tablename__ = "campaign_leads"
    campaign_id = Column(UUID(as_uuid=True), ForeignKey("campaigns.id"), nullable=False)
    lead_id = Column(UUID(as_uuid=True), ForeignKey("sales_leads.id"), nullable=False)
    source = Column(String(100))
    clicked = Column(Boolean, default=False)
    converted = Column(Boolean, default=False)

    campaign = relationship("Campaign", back_populates="leads")


class MarketingTemplate(BaseModel):
    __tablename__ = "marketing_templates"
    name = Column(String(200), nullable=False)
    type = Column(String(50), nullable=False)
    subject = Column(String(500))
    content = Column(Text, nullable=False)
    language = Column(String(10), default="en")
    variables = Column(JSON, default=list)
    thumbnail_url = Column(String(500))
    is_active = Column(Boolean, default=True)
