from app.models.core import BaseModel, TenantMixin, AuditMixin
from app.models.inventory import (
    Brand, VehicleModel, VehicleTrim, VehicleColor,
    Vehicle, VehicleImage, VehicleDocument,
    InventoryTransfer, StockAlert, VehicleBooking,
)
from app.models.sales import (
    SalesLead, Opportunity, TestDrive,
    SalesQuotation, SalesContract, DeliveryChecklist, Commission,
)
from app.models.crm import (
    Customer, Company, Contact, Interaction,
    CustomerTimeline, CustomerSegment, VIPCustomer, CommunicationTemplate,
)
from app.models.finance import (
    Account, Transaction, Invoice, Payment, Expense,
    LoanApplication, LeaseContract, VATRecord,
)
from app.models.service import (
    ServiceAppointment, ServiceOrder, RepairOrder,
    SparePart, SparePartInventory, Technician,
    WarrantyClaim,
)
from app.models.hr import (
    Employee, Department, Attendance, Payroll, LeaveRequest,
)
from app.models.marketing import (
    Campaign, CampaignLead, MarketingTemplate,
)

__all__ = [
    "BaseModel", "TenantMixin", "AuditMixin",
    "Brand", "VehicleModel", "VehicleTrim", "VehicleColor",
    "Vehicle", "VehicleImage", "VehicleDocument",
    "InventoryTransfer", "StockAlert", "VehicleBooking",
    "SalesLead", "Opportunity", "TestDrive",
    "SalesQuotation", "SalesContract", "DeliveryChecklist", "Commission",
    "Customer", "Company", "Contact", "Interaction",
    "CustomerTimeline", "CustomerSegment", "VIPCustomer", "CommunicationTemplate",
    "Account", "Transaction", "Invoice", "Payment", "Expense",
    "LoanApplication", "LeaseContract", "VATRecord",
    "ServiceAppointment", "ServiceOrder", "RepairOrder",
    "SparePart", "SparePartInventory", "Technician", "WarrantyClaim",
    "Employee", "Department", "Attendance", "Payroll", "LeaveRequest",
    "Campaign", "CampaignLead", "MarketingTemplate",
]
