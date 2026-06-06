from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional, List
from uuid import UUID

from app.database import get_db
from app.core.security import get_current_user, role_required
from app.models.hr import Employee, Department, Attendance, Payroll, LeaveRequest

router = APIRouter()


@router.get("/employees")
async def list_employees(
    department_id: Optional[UUID] = Query(None),
    role: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(role_required("admin", "ceo", "hr_manager")),
):
    q = select(Employee).where(Employee.is_active == True)
    if department_id:
        q = q.where(Employee.department_id == department_id)
    if role:
        q = q.where(Employee.role == role)
    if status:
        q = q.where(Employee.employment_status == status)
    result = await db.execute(q)
    return result.scalars().all()


@router.get("/employees/{employee_id}")
async def get_employee(
    employee_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    result = await db.execute(select(Employee).where(Employee.id == employee_id))
    employee = result.scalar_one_or_none()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee


@router.get("/departments")
async def list_departments(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Department).where(Department.is_deleted == False))
    return result.scalars().all()


@router.get("/attendance")
async def get_attendance(
    employee_id: Optional[UUID] = Query(None),
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    q = select(Attendance)
    if employee_id:
        q = q.where(Attendance.employee_id == employee_id)
    if date_from:
        q = q.where(Attendance.date >= date_from)
    if date_to:
        q = q.where(Attendance.date <= date_to)
    q = q.order_by(Attendance.date.desc())
    result = await db.execute(q)
    return result.scalars().all()


@router.get("/payroll")
async def list_payroll(
    employee_id: Optional[UUID] = Query(None),
    status: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(role_required("admin", "hr_manager", "finance_manager")),
):
    q = select(Payroll)
    if employee_id:
        q = q.where(Payroll.employee_id == employee_id)
    if status:
        q = q.where(Payroll.status == status)
    q = q.order_by(Payroll.period_start.desc())
    result = await db.execute(q)
    return result.scalars().all()


@router.get("/leave-requests")
async def list_leave_requests(
    employee_id: Optional[UUID] = Query(None),
    status: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    q = select(LeaveRequest)
    if employee_id:
        q = q.where(LeaveRequest.employee_id == employee_id)
    if status:
        q = q.where(LeaveRequest.status == status)
    q = q.order_by(LeaveRequest.start_date.desc())
    result = await db.execute(q)
    return result.scalars().all()
