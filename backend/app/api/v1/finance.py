from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional, List
from uuid import UUID

from app.database import get_db
from app.core.security import get_current_user, role_required
from app.models.finance import Invoice, Payment, Expense, Account, Transaction, LoanApplication, VATRecord
from app.schemas.finance import (
    InvoiceCreate, InvoiceResponse, PaymentCreate, PaymentResponse,
    LoanApplicationCreate, LoanApplicationResponse, VATRecordResponse,
)

router = APIRouter()


@router.get("/invoices", response_model=List[InvoiceResponse])
async def list_invoices(
    status: Optional[str] = Query(None),
    invoice_type: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    q = select(Invoice).where(Invoice.is_deleted == False)
    if status:
        q = q.where(Invoice.status == status)
    if invoice_type:
        q = q.where(Invoice.invoice_type == invoice_type)
    q = q.order_by(Invoice.created_at.desc())
    result = await db.execute(q)
    return result.scalars().all()


@router.post("/invoices", response_model=InvoiceResponse)
async def create_invoice(
    data: InvoiceCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(role_required("admin", "finance_manager", "accountant")),
):
    count = await db.execute(select(func.count()).select_from(Invoice))
    total = count.scalar()
    invoice = Invoice(
        invoice_number=f"INV-{total + 1:06d}",
        balance_due=data.total_amount,
        **data.model_dump(exclude_unset=True),
    )
    db.add(invoice)
    await db.commit()
    await db.refresh(invoice)
    return invoice


@router.get("/accounts")
async def list_accounts(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Account).where(Account.is_active == True))
    return result.scalars().all()


@router.post("/payments", response_model=PaymentResponse)
async def record_payment(
    data: PaymentCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(role_required("admin", "finance_manager", "accountant")),
):
    inv_result = await db.execute(select(Invoice).where(Invoice.id == data.invoice_id))
    invoice = inv_result.scalar_one_or_none()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    payment = Payment(**data.model_dump())
    db.add(payment)
    invoice.paid_amount = (invoice.paid_amount or 0) + data.amount
    invoice.balance_due = invoice.total_amount - invoice.paid_amount
    if invoice.balance_due <= 0:
        invoice.status = "paid"
    await db.commit()
    await db.refresh(payment)
    return payment


@router.post("/loan-applications", response_model=LoanApplicationResponse)
async def create_loan_application(
    data: LoanApplicationCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    monthly_rate = data.interest_rate / 12 / 100
    tenure = data.tenure_months
    loan_principal = data.loan_amount - data.down_payment
    if monthly_rate > 0:
        emi = loan_principal * monthly_rate * (1 + monthly_rate) ** tenure / ((1 + monthly_rate) ** tenure - 1)
    else:
        emi = loan_principal / tenure
    loan = LoanApplication(
        emi_amount=round(emi, 2),
        **data.model_dump(),
    )
    db.add(loan)
    await db.commit()
    await db.refresh(loan)
    return loan


@router.get("/vat-records", response_model=List[VATRecordResponse])
async def list_vat_records(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(role_required("admin", "finance_manager", "accountant")),
):
    result = await db.execute(select(VATRecord).order_by(VATRecord.period_start.desc()))
    return result.scalars().all()
