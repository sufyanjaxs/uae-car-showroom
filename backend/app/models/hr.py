from datetime import datetime, timezone, date
from sqlalchemy import Column, String, Boolean, Integer, Float, DateTime, Date, Text, ForeignKey, Enum as SAEnum, JSON, UniqueConstraint
from app.database import UUID
from sqlalchemy.orm import relationship
import enum

from app.models.core import BaseModel, TenantMixin, AuditMixin


class EmployeeRole(str, enum.Enum):
    ADMIN = "admin"
    CEO = "ceo"
    GENERAL_MANAGER = "general_manager"
    SALES_MANAGER = "sales_manager"
    SALESPERSON = "salesperson"
    FINANCE_MANAGER = "finance_manager"
    SERVICE_MANAGER = "service_manager"
    TECHNICIAN = "technician"
    MARKETING_MANAGER = "marketing_manager"
    HR_MANAGER = "hr_manager"
    ACCOUNTANT = "accountant"
    SHOWROOM_MANAGER = "showroom_manager"


class EmploymentStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    ON_LEAVE = "on_leave"
    TERMINATED = "terminated"


class Department(BaseModel, TenantMixin):
    __tablename__ = "departments"
    name_ar = Column(String(200), nullable=False)
    name_en = Column(String(200), nullable=False)
    description = Column(Text)
    manager_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"))

    employees = relationship("Employee", back_populates="department", lazy="selectin", foreign_keys="Employee.department_id")


class Employee(BaseModel, TenantMixin, AuditMixin):
    __tablename__ = "employees"
    employee_code = Column(String(50), unique=True, nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    first_name_ar = Column(String(100))
    last_name_ar = Column(String(100))
    email = Column(String(200), unique=True, nullable=False)
    phone = Column(String(20), nullable=False)
    whatsapp = Column(String(20))
    emirates_id = Column(String(50), unique=True)
    passport_number = Column(String(50))
    nationality = Column(String(100))
    date_of_birth = Column(Date)
    gender = Column(String(20))
    address = Column(Text)
    city = Column(String(100))
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id"))
    role = Column(SAEnum(EmployeeRole), nullable=False)
    position = Column(String(200))
    employment_status = Column(SAEnum(EmploymentStatus), default=EmploymentStatus.ACTIVE)
    joining_date = Column(Date, nullable=False)
    contract_end_date = Column(Date)
    basic_salary = Column(Float, nullable=False)
    housing_allowance = Column(Float, default=0)
    transportation_allowance = Column(Float, default=0)
    other_allowances = Column(Float, default=0)
    total_salary = Column(Float, nullable=False)
    bank_name = Column(String(200))
    bank_account = Column(String(100))
    iban = Column(String(50))
    emergency_contact_name = Column(String(200))
    emergency_contact_phone = Column(String(20))
    profile_image_url = Column(String(500))
    documents = Column(JSON, default=list)
    skills = Column(JSON, default=list)
    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime(timezone=True))

    department = relationship("Department", back_populates="employees", foreign_keys="Employee.department_id")


class Attendance(BaseModel):
    __tablename__ = "attendance"
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"), nullable=False)
    date = Column(Date, nullable=False)
    check_in = Column(DateTime(timezone=True))
    check_out = Column(DateTime(timezone=True))
    status = Column(String(50), default="present")
    notes = Column(Text)

    __table_args__ = (
        UniqueConstraint("employee_id", "date", name="uq_employee_attendance"),
    )


class Payroll(BaseModel, TenantMixin, AuditMixin):
    __tablename__ = "payroll"
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"), nullable=False)
    period_start = Column(Date, nullable=False)
    period_end = Column(Date, nullable=False)
    basic_salary = Column(Float, nullable=False)
    allowances = Column(Float, default=0)
    overtime = Column(Float, default=0)
    commission = Column(Float, default=0)
    bonuses = Column(Float, default=0)
    deductions = Column(Float, default=0)
    net_salary = Column(Float, nullable=False)
    payment_date = Column(Date)
    payment_method = Column(String(50))
    status = Column(String(50), default="pending")
    notes = Column(Text)

    __table_args__ = (
        UniqueConstraint("employee_id", "period_start", "period_end", name="uq_employee_payroll_period"),
    )


class LeaveRequest(BaseModel, AuditMixin):
    __tablename__ = "leave_requests"
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"), nullable=False)
    leave_type = Column(String(50), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    total_days = Column(Integer, nullable=False)
    reason = Column(Text)
    status = Column(String(50), default="pending")
    approved_by = Column(UUID(as_uuid=True), ForeignKey("employees.id"))
    approved_at = Column(DateTime(timezone=True))
    notes = Column(Text)
