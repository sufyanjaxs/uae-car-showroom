from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime, timedelta, timezone
from typing import Optional

from app.database import get_db
from app.core.security import get_current_user, role_required
from app.models.sales import SalesLead, SalesContract
from app.models.inventory import Vehicle
from app.models.crm import Customer
from app.models.finance import Invoice, Transaction

router = APIRouter()


@router.get("/ceo")
async def ceo_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(role_required("admin", "ceo")),
):
    total_revenue = await db.execute(select(func.coalesce(func.sum(SalesContract.total_amount), 0)).where(SalesContract.status == "active"))
    total_profit = await db.execute(select(func.coalesce(func.sum(Vehicle.profit_margin), 0)).where(Vehicle.status == "sold"))
    total_vehicles = await db.execute(select(func.count()).select_from(Vehicle).where(Vehicle.is_deleted == False))
    total_customers = await db.execute(select(func.count()).select_from(Customer).where(Customer.is_deleted == False))
    total_employees = await db.execute(select(func.count()).select_from(text("employees")).where(text("is_active = true")))
    return {
        "total_revenue": round(total_revenue.scalar() or 0, 2),
        "total_profit": round(total_profit.scalar() or 0, 2),
        "total_vehicles": total_vehicles.scalar() or 0,
        "total_customers": total_customers.scalar() or 0,
        "total_employees": total_employees.scalar() or 0,
        "growth_rate": 12.5,
        "branch_count": 1,
    }


@router.get("/sales")
async def sales_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    total_leads = await db.execute(select(func.count()).select_from(SalesLead))
    new_leads = await db.execute(select(func.count()).where(SalesLead.status == "new"))
    qualified = await db.execute(select(func.count()).where(SalesLead.status == "qualified"))
    won = await db.execute(select(func.count()).where(SalesLead.status == "closed_won"))
    lost = await db.execute(select(func.count()).where(SalesLead.status == "closed_lost"))
    monthly_target = 50
    monthly_achieved = won.scalar() or 0
    return {
        "total_leads": total_leads.scalar() or 0,
        "new_leads": new_leads.scalar() or 0,
        "qualified_leads": qualified.scalar() or 0,
        "won_deals": won.scalar() or 0,
        "lost_deals": lost.scalar() or 0,
        "conversion_rate": round((won.scalar() or 0) / max(total_leads.scalar() or 1, 1) * 100, 2),
        "monthly_target": monthly_target,
        "monthly_achieved": monthly_achieved,
        "target_progress": round(monthly_achieved / monthly_target * 100, 2),
    }


@router.get("/inventory")
async def inventory_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    total = await db.execute(select(func.count()).select_from(Vehicle).where(Vehicle.is_deleted == False))
    in_stock = await db.execute(select(func.count()).where(Vehicle.status == "in_stock"))
    in_transit = await db.execute(select(func.count()).where(Vehicle.status == "in_transit"))
    reserved = await db.execute(select(func.count()).where(Vehicle.status == "reserved"))
    sold = await db.execute(select(func.count()).where(Vehicle.status == "sold"))
    servicing = await db.execute(select(func.count()).where(Vehicle.status == "servicing"))
    total_value = await db.execute(select(func.coalesce(func.sum(Vehicle.purchase_price), 0)).where(Vehicle.status == "in_stock"))
    aging_90 = await db.execute(select(func.count()).where(Vehicle.status == "in_stock", Vehicle.created_at < func.now() - text("interval '90 days'")))
    return {
        "total_vehicles": total.scalar() or 0,
        "in_stock": in_stock.scalar() or 0,
        "in_transit": in_transit.scalar() or 0,
        "reserved": reserved.scalar() or 0,
        "sold": sold.scalar() or 0,
        "servicing": servicing.scalar() or 0,
        "total_inventory_value": round(total_value.scalar() or 0, 2),
        "aging_stock_over_90_days": aging_90.scalar() or 0,
    }


@router.get("/finance")
async def finance_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    total_receivables = await db.execute(select(func.coalesce(func.sum(Invoice.balance_due), 0)).where(Invoice.status.in_(["sent", "overdue"])))
    overdue = await db.execute(select(func.count()).where(Invoice.status == "overdue"))
    total_collected = await db.execute(select(func.coalesce(func.sum(Invoice.paid_amount), 0)))
    return {
        "total_receivables": round(total_receivables.scalar() or 0, 2),
        "overdue_invoices": overdue.scalar() or 0,
        "total_collected": round(total_collected.scalar() or 0, 2),
        "cash_flow": 0,
        "total_expenses": 0,
        "net_profit": 0,
    }
