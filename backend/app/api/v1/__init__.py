from fastapi import APIRouter
from app.api.v1 import auth, users, inventory, sales, crm, finance, service, hr, marketing, reports, dashboard

router = APIRouter()

router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
router.include_router(users.router, prefix="/users", tags=["Users"])
router.include_router(inventory.router, prefix="/inventory", tags=["Inventory"])
router.include_router(sales.router, prefix="/sales", tags=["Sales"])
router.include_router(crm.router, prefix="/crm", tags=["CRM"])
router.include_router(finance.router, prefix="/finance", tags=["Finance"])
router.include_router(service.router, prefix="/service", tags=["Service"])
router.include_router(hr.router, prefix="/hr", tags=["HR"])
router.include_router(marketing.router, prefix="/marketing", tags=["Marketing"])
router.include_router(reports.router, prefix="/reports", tags=["Reports"])
router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
