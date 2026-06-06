from typing import Optional, List
from app.config import settings
from app.database import celery_app


@celery_app.task
def send_email(recipient: str, subject: str, body: str):
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart
    msg = MIMEMultipart()
    msg["From"] = settings.SMTP_FROM
    msg["To"] = recipient
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "html"))
    try:
        server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)
        server.starttls()
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        return {"status": "sent", "recipient": recipient}
    except Exception as e:
        return {"status": "failed", "error": str(e)}


@celery_app.task
def send_whatsapp(phone: str, message: str):
    pass


@celery_app.task
def send_sms(phone: str, message: str):
    pass
