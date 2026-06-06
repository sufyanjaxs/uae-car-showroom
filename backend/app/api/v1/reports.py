from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, text
from typing import Optional
from uuid import UUID

from app.database import get_db
from app.core.security import get_current_user
from app.models.inventory import Vehicle, Brand, VehicleModel
from app.models.sales import SalesLead, SalesContract
from app.models.crm import Customer
from app.models.finance import Invoice, Transaction, VATRecord

router = APIRouter()


@router.get("/sales-summary")
async def sales_summary(
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    total_contracts = await db.execute(select(func.count()).select_from(SalesContract))
    total_revenue = await db.execute(select(func.coalesce(func.sum(SalesContract.total_amount), 0)).where(SalesContract.status == "active"))
    total_leads = await db.execute(select(func.count()).select_from(SalesLead))
    converted = await db.execute(select(func.count()).where(SalesLead.status == "closed_won"))
    leads_total = total_leads.scalar() or 1
    return {
        "total_contracts": total_contracts.scalar(),
        "total_revenue": round(total_revenue.scalar() or 0, 2),
        "total_leads": total_leads.scalar(),
        "conversion_rate": round((converted.scalar() or 0) / leads_total * 100, 2),
    }


@router.get("/inventory-summary")
async def inventory_summary(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    total = await db.execute(select(func.count()).select_from(Vehicle).where(Vehicle.is_deleted == False))
    in_stock = await db.execute(select(func.count()).where(Vehicle.status == "in_stock"))
    reserved = await db.execute(select(func.count()).where(Vehicle.status == "reserved"))
    sold = await db.execute(select(func.count()).where(Vehicle.status == "sold"))
    total_value = await db.execute(select(func.coalesce(func.sum(Vehicle.purchase_price), 0)).where(Vehicle.status == "in_stock"))
    return {
        "total_vehicles": total.scalar(),
        "in_stock": in_stock.scalar(),
        "reserved": reserved.scalar(),
        "sold": sold.scalar(),
        "total_inventory_value": round(total_value.scalar() or 0, 2),
    }


@router.get("/customer-summary")
async def customer_summary(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    total = await db.execute(select(func.count()).select_from(Customer).where(Customer.is_deleted == False))
    active = await db.execute(select(func.count()).where(Customer.status == "active"))
    vip = await db.execute(select(func.count()).where(Customer.customer_type == "vip"))
    total_revenue = await db.execute(select(func.coalesce(func.sum(Customer.total_revenue), 0)))
    return {
        "total_customers": total.scalar(),
        "active_customers": active.scalar(),
        "vip_customers": vip.scalar(),
        "total_revenue": round(total_revenue.scalar() or 0, 2),
    }


@router.get("/finance-summary")
async def finance_summary(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    total_receivables = await db.execute(select(func.coalesce(func.sum(Invoice.balance_due), 0)).where(Invoice.status.in_(["sent", "overdue"])))
    total_paid = await db.execute(select(func.coalesce(func.sum(Invoice.paid_amount), 0)))
    vat_due = await db.execute(select(func.coalesce(func.sum(VATRecord.net_vat_due), 0)).where(VATRecord.status == "pending"))
    return {
        "total_receivables": round(total_receivables.scalar() or 0, 2),
        "total_collected": round(total_paid.scalar() or 0, 2),
        "vat_due": round(vat_due.scalar() or 0, 2),
    }


@router.get("/performance")
async def performance_report(
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return {
        "sales": await sales_summary(date_from, date_to, db, current_user),
        "inventory": await inventory_summary(db, current_user),
        "customers": await customer_summary(db, current_user),
        "finance": await finance_summary(db, current_user),
    }
