from app.database import celery_app
from app.services.notification import send_email, send_whatsapp, send_sms
from app.models.inventory import Vehicle, StockAlert
from app.models.sales import SalesLead
from datetime import datetime, timezone


@celery_app.task
def process_lead_scoring():
    pass


@celery_app.task
def generate_daily_report():
    pass


@celery_app.task
def check_low_stock():
    pass


@celery_app.task
def send_scheduled_notifications():
    pass


@celery_app.task
def sync_inventory_with_external():
    pass


@celery_app.task
def backup_database():
    pass
