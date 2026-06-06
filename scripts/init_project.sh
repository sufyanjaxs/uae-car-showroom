#!/bin/bash

echo "UAE Car Showroom Management System - Project Initialization"
echo "============================================================"

echo "Setting up backend..."
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

echo "Setting up frontend..."
cd ../frontend
npm install

echo "Starting Docker services..."
cd ..
docker-compose -f docker/docker-compose.yml up -d

echo "Initializing database..."
cd backend
cp .env.example .env
alembic upgrade head

echo "Creating admin user..."
python -c "
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
"

echo ""
echo "Setup complete!"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:8000/api/v1"
echo "API Docs: http://localhost:8000/docs"
echo "Admin Login: admin@uae-carshowroom.com"
echo ""
