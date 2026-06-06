Write-Host "UAE Car Showroom Management System - Project Initialization" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

Write-Host "Setting up backend..." -ForegroundColor Yellow
Set-Location backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt

Write-Host "Setting up frontend..." -ForegroundColor Yellow
Set-Location ..\frontend
npm install

Write-Host "Starting Docker services..." -ForegroundColor Yellow
Set-Location ..
docker-compose -f docker/docker-compose.yml up -d

Write-Host "Initializing database..." -ForegroundColor Yellow
Set-Location backend
Copy-Item .env.example .env
alembic upgrade head

Write-Host "Creating admin user..." -ForegroundColor Yellow
python -c @"
import asyncio
from app.database import init_db, async_session
from app.models.hr import Employee
from app.core.security import get_password_hash

async def init():
    await init_db()
    async with async_session() as session:
        admin = Employee(
            employee_code='ADMIN-001',
            email='admin@uae-carshowroom.com',
            first_name='Admin',
            last_name='User',
            phone='+971500000000',
            role='admin',
            joining_date='2026-01-01',
            basic_salary=0,
            total_salary=0,
            is_active=True,
        )
        session.add(admin)
        await session.commit()
        print(f'Admin created: {admin.id}')

asyncio.run(init())
"@

Write-Host ""
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend API: http://localhost:8000/api/v1" -ForegroundColor Cyan
Write-Host "API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "Admin Login: admin@uae-carshowroom.com" -ForegroundColor Cyan
