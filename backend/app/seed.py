import uuid
import random
from datetime import datetime, timezone, date, timedelta
from sqlalchemy import select, func

from app.database import async_session
from app.models import (
    Branch, Department, Employee,
    Brand, VehicleModel, VehicleTrim, VehicleColor,
    Vehicle,
    Customer,
    SalesLead,
    SalesContract, TestDrive,
)
from app.models.hr import EmployeeRole, EmploymentStatus
from app.models.inventory import VehicleCondition, VehicleStatus, VehicleType, FuelType, Transmission, BodyType
from app.models.crm import CustomerType, CustomerStatus, PreferredLanguage
from app.models.sales import LeadSource, LeadStatus

BRANDS_DATA = [
    {"name_en": "Lamborghini", "name_ar": "لامبورغيني", "country": "Italy"},
    {"name_en": "Ferrari", "name_ar": "فيراري", "country": "Italy"},
    {"name_en": "Rolls Royce", "name_ar": "رولز رويس", "country": "UK"},
    {"name_en": "Bentley", "name_ar": "بنتلي", "country": "UK"},
    {"name_en": "Porsche", "name_ar": "بورش", "country": "Germany"},
    {"name_en": "Mercedes", "name_ar": "مرسيدس", "country": "Germany"},
    {"name_en": "BMW", "name_ar": "بي إم دبليو", "country": "Germany"},
    {"name_en": "Audi", "name_ar": "أودي", "country": "Germany"},
    {"name_en": "Lexus", "name_ar": "لكزس", "country": "Japan"},
    {"name_en": "Range Rover", "name_ar": "رينج روفر", "country": "UK"},
    {"name_en": "Nissan", "name_ar": "نيسان", "country": "Japan"},
    {"name_en": "Toyota", "name_ar": "تويوتا", "country": "Japan"},
]

MODELS_DATA = {
    "Lamborghini": [
        {"name_en": "Urus", "name_ar": "أوروس", "body_type": BodyType.SUV, "fuel_type": FuelType.PETROL, "engine": 4.0, "trans": Transmission.AUTOMATIC, "seats": 5, "trims": [("Urus S", 1200000), ("Urus Performante", 1400000)]},
        {"name_en": "Huracan", "name_ar": "هواراكان", "body_type": BodyType.COUPE, "fuel_type": FuelType.PETROL, "engine": 5.2, "trans": Transmission.DCT, "seats": 2, "trims": [("Huracan Tecnica", 1500000), ("Huracan STO", 1800000)]},
        {"name_en": "Revuelto", "name_ar": "ريفيولتو", "body_type": BodyType.COUPE, "fuel_type": FuelType.HYBRID, "engine": 6.5, "trans": Transmission.DCT, "seats": 2, "trims": [("Revuelto", 2500000)]},
    ],
    "Ferrari": [
        {"name_en": "SF90 Stradale", "name_ar": "إس إف 90", "body_type": BodyType.COUPE, "fuel_type": FuelType.HYBRID, "engine": 4.0, "trans": Transmission.DCT, "seats": 2, "trims": [("SF90 Stradale", 1800000), ("SF90 Spider", 2000000)]},
        {"name_en": "Purosangue", "name_ar": "بيروسانغوي", "body_type": BodyType.SUV, "fuel_type": FuelType.PETROL, "engine": 6.5, "trans": Transmission.DCT, "seats": 4, "trims": [("Purosangue", 2200000)]},
        {"name_en": "296 GTB", "name_ar": "296 جي تي بي", "body_type": BodyType.COUPE, "fuel_type": FuelType.HYBRID, "engine": 3.0, "trans": Transmission.DCT, "seats": 2, "trims": [("296 GTB", 1600000)]},
    ],
    "Rolls Royce": [
        {"name_en": "Ghost", "name_ar": "غوست", "body_type": BodyType.SEDAN, "fuel_type": FuelType.PETROL, "engine": 6.75, "trans": Transmission.AUTOMATIC, "seats": 5, "trims": [("Ghost", 1800000), ("Ghost Extended", 2100000)]},
        {"name_en": "Cullinan", "name_ar": "كولينان", "body_type": BodyType.SUV, "fuel_type": FuelType.PETROL, "engine": 6.75, "trans": Transmission.AUTOMATIC, "seats": 5, "trims": [("Cullinan", 2000000), ("Cullinan Black Badge", 2400000)]},
    ],
    "Bentley": [
        {"name_en": "Continental GT", "name_ar": "كونتيننتال جي تي", "body_type": BodyType.COUPE, "fuel_type": FuelType.PETROL, "engine": 4.0, "trans": Transmission.DCT, "seats": 4, "trims": [("Continental GT V8", 1200000), ("Continental GT Speed", 1600000)]},
        {"name_en": "Bentayga", "name_ar": "بنتايجا", "body_type": BodyType.SUV, "fuel_type": FuelType.PETROL, "engine": 4.0, "trans": Transmission.AUTOMATIC, "seats": 5, "trims": [("Bentayga V8", 1100000), ("Bentayga EWB", 1400000)]},
    ],
    "Porsche": [
        {"name_en": "911 Carrera", "name_ar": "911 كاريرا", "body_type": BodyType.COUPE, "fuel_type": FuelType.PETROL, "engine": 3.0, "trans": Transmission.DCT, "seats": 4, "trims": [("Carrera", 650000), ("Carrera 4S", 780000), ("Turbo S", 1100000)]},
        {"name_en": "Cayenne", "name_ar": "كايين", "body_type": BodyType.SUV, "fuel_type": FuelType.PETROL, "engine": 3.0, "trans": Transmission.AUTOMATIC, "seats": 5, "trims": [("Cayenne", 450000), ("Cayenne Turbo", 750000)]},
        {"name_en": "Panamera", "name_ar": "باناميرا", "body_type": BodyType.SEDAN, "fuel_type": FuelType.HYBRID, "engine": 2.9, "trans": Transmission.DCT, "seats": 5, "trims": [("Panamera 4", 550000), ("Panamera Turbo S", 900000)]},
    ],
    "Mercedes": [
        {"name_en": "S-Class", "name_ar": "إس كلاس", "body_type": BodyType.SEDAN, "fuel_type": FuelType.PETROL, "engine": 3.0, "trans": Transmission.AUTOMATIC, "seats": 5, "trims": [("S 500", 650000), ("S 580", 800000), ("Maybach S 680", 1200000)]},
        {"name_en": "G-Class", "name_ar": "جي كلاس", "body_type": BodyType.SUV, "fuel_type": FuelType.PETROL, "engine": 4.0, "trans": Transmission.AUTOMATIC, "seats": 5, "trims": [("G 500", 900000), ("AMG G 63", 1200000)]},
        {"name_en": "AMG GT", "name_ar": "إيه إم جي جي تي", "body_type": BodyType.COUPE, "fuel_type": FuelType.PETROL, "engine": 4.0, "trans": Transmission.DCT, "seats": 2, "trims": [("AMG GT 53", 700000), ("AMG GT 63 S", 950000)]},
    ],
    "BMW": [
        {"name_en": "7 Series", "name_ar": "الفئة السابعة", "body_type": BodyType.SEDAN, "fuel_type": FuelType.PETROL, "engine": 3.0, "trans": Transmission.AUTOMATIC, "seats": 5, "trims": [("740i", 550000), ("760i xDrive", 750000)]},
        {"name_en": "X7", "name_ar": "إكس 7", "body_type": BodyType.SUV, "fuel_type": FuelType.PETROL, "engine": 3.0, "trans": Transmission.AUTOMATIC, "seats": 5, "trims": [("X7 xDrive40i", 500000), ("X7 M60i", 700000)]},
        {"name_en": "M8", "name_ar": "إم 8", "body_type": BodyType.COUPE, "fuel_type": FuelType.PETROL, "engine": 4.4, "trans": Transmission.AUTOMATIC, "seats": 4, "trims": [("M8 Competition", 850000)]},
    ],
    "Audi": [
        {"name_en": "A8", "name_ar": "إيه 8", "body_type": BodyType.SEDAN, "fuel_type": FuelType.PETROL, "engine": 3.0, "trans": Transmission.AUTOMATIC, "seats": 5, "trims": [("A8 L 55 TFSI", 500000), ("A8 L 60 TFSI", 650000)]},
        {"name_en": "Q8", "name_ar": "كيو 8", "body_type": BodyType.SUV, "fuel_type": FuelType.PETROL, "engine": 3.0, "trans": Transmission.AUTOMATIC, "seats": 5, "trims": [("Q8 55 TFSI", 450000), ("RS Q8", 700000)]},
        {"name_en": "R8", "name_ar": "آر 8", "body_type": BodyType.COUPE, "fuel_type": FuelType.PETROL, "engine": 5.2, "trans": Transmission.DCT, "seats": 2, "trims": [("R8 V10", 950000)]},
    ],
    "Lexus": [
        {"name_en": "LX", "name_ar": "إل إكس", "body_type": BodyType.SUV, "fuel_type": FuelType.PETROL, "engine": 3.5, "trans": Transmission.AUTOMATIC, "seats": 7, "trims": [("LX 600", 550000), ("LX 600 F Sport", 620000)]},
        {"name_en": "LS", "name_ar": "إل إس", "body_type": BodyType.SEDAN, "fuel_type": FuelType.HYBRID, "engine": 3.5, "trans": Transmission.AUTOMATIC, "seats": 5, "trims": [("LS 500h", 450000)]},
    ],
    "Range Rover": [
        {"name_en": "Range Rover", "name_ar": "رينج روفر", "body_type": BodyType.SUV, "fuel_type": FuelType.PETROL, "engine": 4.4, "trans": Transmission.AUTOMATIC, "seats": 5, "trims": [("Range Rover SE", 750000), ("Range Rover Autobiography", 950000), ("Range Rover SV", 1300000)]},
        {"name_en": "Range Rover Sport", "name_ar": "رينج روفر سبورت", "body_type": BodyType.SUV, "fuel_type": FuelType.PETROL, "engine": 3.0, "trans": Transmission.AUTOMATIC, "seats": 5, "trims": [("Sport SE", 550000), ("Sport Autobiography", 700000)]},
        {"name_en": "Velar", "name_ar": "فيلار", "body_type": BodyType.SUV, "fuel_type": FuelType.PETROL, "engine": 2.0, "trans": Transmission.AUTOMATIC, "seats": 5, "trims": [("Velar R-Dynamic", 380000)]},
    ],
    "Nissan": [
        {"name_en": "Patrol", "name_ar": "باترول", "body_type": BodyType.SUV, "fuel_type": FuelType.PETROL, "engine": 4.0, "trans": Transmission.AUTOMATIC, "seats": 7, "trims": [("Patrol LE", 250000), ("Patrol Platinum City", 320000), ("Patrol Super Safari", 380000)]},
        {"name_en": "Patrol Nismo", "name_ar": "باترول نيسمو", "body_type": BodyType.SUV, "fuel_type": FuelType.PETROL, "engine": 5.6, "trans": Transmission.AUTOMATIC, "seats": 7, "trims": [("Patrol Nismo", 450000)]},
    ],
    "Toyota": [
        {"name_en": "Land Cruiser", "name_ar": "لاند كروزر", "body_type": BodyType.SUV, "fuel_type": FuelType.PETROL, "engine": 3.5, "trans": Transmission.AUTOMATIC, "seats": 7, "trims": [("Land Cruiser VX", 300000), ("Land Cruiser VXR", 350000), ("Land Cruiser GR Sport", 420000)]},
        {"name_en": "Land Cruiser 300", "name_ar": "لاند كروزر 300", "body_type": BodyType.SUV, "fuel_type": FuelType.PETROL, "engine": 3.5, "trans": Transmission.AUTOMATIC, "seats": 7, "trims": [("300 GX-R", 280000), ("300 VX-R", 380000)]},
    ],
}

COLORS_DATA = [
    {"name_en": "Pearl White", "name_ar": "أبيض لؤلؤي", "hex": "#F5F5F0", "color_type": "solid"},
    {"name_en": "Phantom Black", "name_ar": "أسود فانتوم", "hex": "#0B0B0B", "color_type": "solid"},
    {"name_en": "Rosso Corsa Red", "name_ar": "أحمر روسو كورسا", "hex": "#DC0000", "color_type": "metallic"},
    {"name_en": "Gulf Blue", "name_ar": "أزرق الخليج", "hex": "#003F72", "color_type": "metallic"},
    {"name_en": "Ice Silver", "name_ar": "فضي ثلجي", "hex": "#C0C0C0", "color_type": "metallic"},
    {"name_en": "Nardo Grey", "name_ar": "رمادي ناردو", "hex": "#787878", "color_type": "matte"},
    {"name_en": "Desert Gold", "name_ar": "ذهبي صحراوي", "hex": "#C59636", "color_type": "metallic"},
    {"name_en": "Racing Green", "name_ar": "أخضر سباق", "hex": "#004225", "color_type": "metallic"},
    {"name_en": "Solar Yellow", "name_ar": "أصفر شمسي", "hex": "#FFD700", "color_type": "solid"},
    {"name_en": "Cognac Brown", "name_ar": "بني كونياك", "hex": "#9A4E2C", "color_type": "metallic"},
]

EMIRATES = ["Abu Dhabi", "Dubai", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"]

CUSTOMERS_DATA = [
    {"first_name": "Ahmed", "last_name": "Al Maktoum", "first_name_ar": "أحمد", "last_name_ar": "آل مكتوم", "phone": "+971 50 111 2233", "emirates_id": "784-1980-1234567-1", "nationality": "UAE", "city": "Dubai", "emirate": "Dubai", "occupation": "Business Owner", "employer": "Al Maktoum Group", "annual_income": 5000000},
    {"first_name": "Fatima", "last_name": "Al Nahyan", "first_name_ar": "فاطمة", "last_name_ar": "آل نهيان", "phone": "+971 50 222 3344", "emirates_id": "784-1982-2345678-2", "nationality": "UAE", "city": "Abu Dhabi", "emirate": "Abu Dhabi", "occupation": "Executive", "employer": "ADNOC", "annual_income": 3500000},
    {"first_name": "Mohammed", "last_name": "Al Qasimi", "first_name_ar": "محمد", "last_name_ar": "القاسمي", "phone": "+971 55 333 4455", "emirates_id": "784-1975-3456789-3", "nationality": "UAE", "city": "Sharjah", "emirate": "Sharjah", "occupation": "Doctor", "employer": "Al Qasimi Hospital", "annual_income": 1800000},
    {"first_name": "Sara", "last_name": "Al Hashimi", "first_name_ar": "سارة", "last_name_ar": "الهاشمي", "phone": "+971 54 444 5566", "emirates_id": "784-1990-4567890-4", "nationality": "UAE", "city": "Dubai", "emirate": "Dubai", "occupation": "Lawyer", "employer": "Al Hashimi Legal", "annual_income": 2200000},
    {"first_name": "Khalid", "last_name": "Al Nuaimi", "first_name_ar": "خالد", "last_name_ar": "النعيمي", "phone": "+971 52 555 6677", "emirates_id": "784-1985-5678901-5", "nationality": "UAE", "city": "Ajman", "emirate": "Ajman", "occupation": "Real Estate Developer", "employer": "Nuaimi Properties", "annual_income": 4000000},
    {"first_name": "Nora", "last_name": "Al Shamsi", "first_name_ar": "نورة", "last_name_ar": "الشمسي", "phone": "+971 56 666 7788", "emirates_id": "784-1993-6789012-6", "nationality": "UAE", "city": "Ras Al Khaimah", "emirate": "Ras Al Khaimah", "occupation": "Engineer", "employer": "RAK Cement", "annual_income": 1200000},
    {"first_name": "Sultan", "last_name": "Al Suwaidi", "first_name_ar": "سلطان", "last_name_ar": "السويدي", "phone": "+971 58 777 8899", "emirates_id": "784-1978-7890123-7", "nationality": "UAE", "city": "Fujairah", "emirate": "Fujairah", "occupation": "Investor", "employer": "Suwaidi Holdings", "annual_income": 6000000},
    {"first_name": "Mariam", "last_name": "Al Falasi", "first_name_ar": "مريم", "last_name_ar": "الفلاسي", "phone": "+971 50 888 9900", "emirates_id": "784-1995-8901234-8", "nationality": "UAE", "city": "Dubai", "emirate": "Dubai", "occupation": "Consultant", "employer": "Falasi Consulting", "annual_income": 1500000},
    {"first_name": "Rashid", "last_name": "Al Mazroui", "first_name_ar": "راشد", "last_name_ar": "المزروعي", "phone": "+971 55 999 0011", "emirates_id": "784-1988-9012345-9", "nationality": "UAE", "city": "Abu Dhabi", "emirate": "Abu Dhabi", "occupation": "Government Official", "employer": "Ministry of Finance", "annual_income": 2800000},
    {"first_name": "Layla", "last_name": "Al Ameri", "first_name_ar": "ليلى", "last_name_ar": "العامري", "phone": "+971 54 111 2233", "emirates_id": "784-1996-0123456-0", "nationality": "UAE", "city": "Sharjah", "emirate": "Sharjah", "occupation": "Architect", "employer": "Ameri Designs", "annual_income": 900000},
    {"first_name": "Hamdan", "last_name": "Al Zarooni", "first_name_ar": "حمدان", "last_name_ar": "الزرعوني", "phone": "+971 52 222 3344", "emirates_id": "784-1983-1122334-1", "nationality": "UAE", "city": "Dubai", "emirate": "Dubai", "occupation": "CEO", "employer": "Zarooni Group", "annual_income": 8000000},
    {"first_name": "Aisha", "last_name": "Al Muhairi", "first_name_ar": "عائشة", "last_name_ar": "المهيري", "phone": "+971 56 333 4455", "emirates_id": "784-1991-2233445-2", "nationality": "UAE", "city": "Abu Dhabi", "emirate": "Abu Dhabi", "occupation": "Banker", "employer": "First Abu Dhabi Bank", "annual_income": 2000000},
    {"first_name": "Abdulla", "last_name": "Al Dhaheri", "first_name_ar": "عبد الله", "last_name_ar": "الظاهري", "phone": "+971 58 444 5566", "emirates_id": "784-1986-3344556-3", "nationality": "UAE", "city": "Al Ain", "emirate": "Abu Dhabi", "occupation": "Professor", "employer": "UAE University", "annual_income": 800000},
    {"first_name": "Mona", "last_name": "Al Kaabi", "first_name_ar": "منى", "last_name_ar": "الكعبي", "phone": "+971 50 555 6677", "emirates_id": "784-1994-4455667-4", "nationality": "UAE", "city": "Dubai", "emirate": "Dubai", "occupation": "Entrepreneur", "employer": "Mona Beauty", "annual_income": 1200000},
    {"first_name": "Majid", "last_name": "Al Ghurair", "first_name_ar": "ماجد", "last_name_ar": "الغُرير", "phone": "+971 55 666 7788", "emirates_id": "784-1981-5566778-5", "nationality": "UAE", "city": "Dubai", "emirate": "Dubai", "occupation": "Businessman", "employer": "Al Ghurair Group", "annual_income": 10000000},
    {"first_name": "Sheikha", "last_name": "Al Mansouri", "first_name_ar": "شيخة", "last_name_ar": "المنصوري", "phone": "+971 54 777 8899", "emirates_id": "784-1997-6677889-6", "nationality": "UAE", "city": "Umm Al Quwain", "emirate": "Umm Al Quwain", "occupation": "Fashion Designer", "employer": "Mansouri Couture", "annual_income": 700000},
    {"first_name": "Omar", "last_name": "Al Balushi", "first_name_ar": "عمر", "last_name_ar": "البلوشي", "phone": "+971 52 888 9900", "emirates_id": "784-1987-7788990-7", "nationality": "Oman", "city": "Dubai", "emirate": "Dubai", "occupation": "Pilot", "employer": "Emirates Airlines", "annual_income": 3200000},
    {"first_name": "Nadia", "last_name": "Al Tayer", "first_name_ar": "نادية", "last_name_ar": "الطاير", "phone": "+971 56 999 0011", "emirates_id": "784-1992-8899001-8", "nationality": "UAE", "city": "Dubai", "emirate": "Dubai", "occupation": "Executive", "employer": "Al Tayer Group", "annual_income": 4500000},
    {"first_name": "Faisal", "last_name": "Al Shafar", "first_name_ar": "فيصل", "last_name_ar": "الشفر", "phone": "+971 58 111 2233", "emirates_id": "784-1984-9900112-9", "nationality": "UAE", "city": "Sharjah", "emirate": "Sharjah", "occupation": "Contractor", "employer": "Shafar Construction", "annual_income": 2500000},
    {"first_name": "Hind", "last_name": "Al Mulla", "first_name_ar": "هند", "last_name_ar": "الملا", "phone": "+971 52 333 7788", "emirates_id": "784-1998-0011223-4", "nationality": "UAE", "city": "Dubai", "emirate": "Dubai", "occupation": "Doctor", "employer": "Dubai Healthcare City", "annual_income": 1600000},
    {"first_name": "Saif", "last_name": "Al Ketbi", "first_name_ar": "سيف", "last_name_ar": "الكتبي", "phone": "+971 58 123 4567", "emirates_id": "784-1989-1234567-8", "nationality": "UAE", "city": "Abu Dhabi", "emirate": "Abu Dhabi", "occupation": "Military Officer", "employer": "UAE Armed Forces", "annual_income": 3000000},
    {"first_name": "Amna", "last_name": "Al Romaithi", "first_name_ar": "آمنة", "last_name_ar": "الرميثي", "phone": "+971 54 777 1122", "emirates_id": "784-1999-2345678-9", "nationality": "UAE", "city": "Abu Dhabi", "emirate": "Abu Dhabi", "occupation": "Student", "employer": "", "annual_income": 500000},
]

EMPLOYEES_DATA = [
    {"code": "EMP001", "first_name": "Abdulrahman", "last_name": "Al Owais", "first_name_ar": "عبد الرحمن", "last_name_ar": "العويس", "phone": "+971 50 111 0001", "email": "abdulrahman.owais@carshowroom.ae", "role": EmployeeRole.CEO, "position": "Chief Executive Officer", "salary": 120000, "nationality": "UAE", "dept": "Management"},
    {"code": "EMP002", "first_name": "Yousef", "last_name": "Al Khouri", "first_name_ar": "يوسف", "last_name_ar": "الخوري", "phone": "+971 50 111 0002", "email": "yousef.khouri@carshowroom.ae", "role": EmployeeRole.GENERAL_MANAGER, "position": "General Manager", "salary": 85000, "nationality": "UAE", "dept": "Management"},
    {"code": "EMP003", "first_name": "Hassan", "last_name": "Al Zaabi", "first_name_ar": "حسن", "last_name_ar": "الزعابي", "phone": "+971 50 111 0003", "email": "hassan.zaabi@carshowroom.ae", "role": EmployeeRole.SALES_MANAGER, "position": "Sales Manager", "salary": 65000, "nationality": "UAE", "dept": "Sales"},
    {"code": "EMP004", "first_name": "Rashed", "last_name": "Al Blooshi", "first_name_ar": "راشد", "last_name_ar": "البلوشي", "phone": "+971 50 111 0004", "email": "rashed.blooshi@carshowroom.ae", "role": EmployeeRole.SALESPERSON, "position": "Senior Sales Executive", "salary": 40000, "nationality": "UAE", "dept": "Sales"},
    {"code": "EMP005", "first_name": "Khalfan", "last_name": "Al Shamsi", "first_name_ar": "خلفان", "last_name_ar": "الشمسي", "phone": "+971 50 111 0005", "email": "khalfan.shamsi@carshowroom.ae", "role": EmployeeRole.SALESPERSON, "position": "Sales Executive", "salary": 35000, "nationality": "UAE", "dept": "Sales"},
    {"code": "EMP006", "first_name": "Mansour", "last_name": "Al Marri", "first_name_ar": "منصور", "last_name_ar": "المرّي", "phone": "+971 50 111 0006", "email": "mansour.marri@carshowroom.ae", "role": EmployeeRole.FINANCE_MANAGER, "position": "Finance Manager", "salary": 60000, "nationality": "UAE", "dept": "Finance"},
    {"code": "EMP007", "first_name": "Salem", "last_name": "Al Kaabi", "first_name_ar": "سالم", "last_name_ar": "الكعبي", "phone": "+971 50 111 0007", "email": "salem.kaabi@carshowroom.ae", "role": EmployeeRole.ACCOUNTANT, "position": "Accountant", "salary": 30000, "nationality": "UAE", "dept": "Finance"},
    {"code": "EMP008", "first_name": "Jamal", "last_name": "Al Fardan", "first_name_ar": "جمال", "last_name_ar": "الفردان", "phone": "+971 50 111 0008", "email": "jamal.fardan@carshowroom.ae", "role": EmployeeRole.SHOWROOM_MANAGER, "position": "Showroom Manager", "salary": 50000, "nationality": "UAE", "dept": "Sales"},
    {"code": "EMP009", "first_name": "Tariq", "last_name": "Al Mahmoud", "first_name_ar": "طارق", "last_name_ar": "المحمود", "phone": "+971 50 111 0009", "email": "tariq.mahmoud@carshowroom.ae", "role": EmployeeRole.MARKETING_MANAGER, "position": "Marketing Manager", "salary": 55000, "nationality": "UAE", "dept": "Marketing"},
    {"code": "EMP010", "first_name": "Nasser", "last_name": "Al Yamani", "first_name_ar": "ناصر", "last_name_ar": "اليماني", "phone": "+971 50 111 0010", "email": "nasser.yamani@carshowroom.ae", "role": EmployeeRole.HR_MANAGER, "position": "HR Manager", "salary": 50000, "nationality": "UAE", "dept": "HR"},
]

DEPARTMENTS_DATA = [
    {"name_en": "Management", "name_ar": "الإدارة"},
    {"name_en": "Sales", "name_ar": "المبيعات"},
    {"name_en": "Finance", "name_ar": "المالية"},
    {"name_en": "Marketing", "name_ar": "التسويق"},
    {"name_en": "HR", "name_ar": "الموارد البشرية"},
]

VINS = [
    "ZPBJA1ZG3RLA00001", "ZPBJA1ZG3RLA00002", "ZPBJA1ZG3RLA00003",
    "ZFF90HNA8R0300001", "ZFF90HNA8R0300002", "ZFF90HNA8R0300003",
    "SCA2S6805RUX00001", "SCA2S6805RUX00002",
    "SCBCB8ZA3RCX00001", "SCBCB8ZA3RCX00002",
    "WP0AC2983RL200001", "WP0AC2983RL200002", "WP0AC2983RL200003",
    "W1K6G2GBXRA000001", "W1K6G2GBXRA000002",
    "WBA7J2C54RGV00001", "WBA7J2C54RGV00002",
    "WAULGBF32RN000001", "WAULGBF32RN000002",
    "JTJHY7AX8R4150001", "JTJHY7AX8R4150002",
    "SALGS2EF9RA123456", "SALGS2EF9RA123457", "SALGS2EF9RA123458",
    "JN8AS5MVXRW520001", "JN8AS5MVXRW520002",
    "JTMEY7AX8R4012345", "JTMEY7AX8R4012346",
    "ZFFXVAAA3R0200001", "ZFFXVAAA3R0200002",
    "SCBBR53W5RC012345", "SCBBR53W5RC012346",
    "WP1AA2959RLB12345", "WP1AA2959RLB12346",
]

SALE_TYPE_OPTIONS = ["cash", "finance", "lease"]
LEAD_SOURCES = [LeadSource.WEBSITE, LeadSource.PHONE, LeadSource.WHATSAPP, LeadSource.EMAIL, LeadSource.WALKIN, LeadSource.REFERRAL, LeadSource.INSTAGRAM, LeadSource.FACEBOOK, LeadSource.GOOGLE_ADS, LeadSource.TIKTOK]


def random_phone():
    prefixes = ["050", "055", "054", "052", "056", "058"]
    return f"+971 {random.choice(prefixes)} {random.randint(100,999)} {random.randint(1000,9999)}"


def generate_emirates_id():
    year = random.randint(1960, 2000)
    return f"784-{year}-{random.randint(1000000,9999999)}-{random.randint(1,9)}"


async def init_and_seed():
    from app.database import init_db
    await init_db()
    print("Tables created")

    async with async_session() as session:
        result = await session.execute(select(func.count(Brand.id)))
        if result.scalar() > 0:
            print("Database already seeded, skipping")
            return

    print("Seeding database...")
    await seed_data()
    print("Database seeded successfully!")


async def seed_data():
    async with async_session() as session:
        branches = await seed_branches(session)
        departments = await seed_departments(session)
        employees = await seed_employees(session, branches, departments)
        brands_map = await seed_brands(session)
        colors = await seed_colors(session)
        all_models = await seed_vehicle_models(session, brands_map)
        all_trims = await seed_vehicle_trims(session, all_models)
        customers = await seed_customers(session)
        vehicles = await seed_vehicles(session, all_models, all_trims, colors, customers, branches[0])
        leads = await seed_leads(session, customers, employees, brands_map, branches[0])
        await seed_sales_contracts(session, customers, employees, vehicles, leads, branches[0])
        await seed_test_drives(session, customers, employees, vehicles, branches[0])
        await session.commit()
        print(f"  Created: {len(branches)} branches, {len(departments)} departments, {len(employees)} employees")
        print(f"  Created: {len(brands_map)} brands, {len(all_models)} models, {len(all_trims)} trims")
        print(f"  Created: {len(colors)} colors, {len(customers)} customers")
        print(f"  Created: {len(vehicles)} vehicles, {len(leads)} leads")


async def seed_branches(session):
    branch_list = []
    for emirate in EMIRATES:
        branch = Branch(
            name_en=f"{emirate} Showroom",
            name_ar=f"معرض {emirate}",
            emirate=emirate,
            address=f"Sheikh {emirate} Road, {emirate}",
            phone=f"+971 4 5{random.randint(100,999)} {random.randint(1000,9999)}",
            email=f"info.{emirate.lower().replace(' ', '')}@carshowroom.ae",
        )
        session.add(branch)
        branch_list.append(branch)
    await session.flush()
    return branch_list


async def seed_departments(session):
    dept_list = []
    for dept_data in DEPARTMENTS_DATA:
        dept = Department(
            name_en=dept_data["name_en"],
            name_ar=dept_data["name_ar"],
        )
        session.add(dept)
        dept_list.append(dept)
    await session.flush()
    return dept_list


async def seed_employees(session, branches, departments):
    dept_map = {d.name_en: d for d in departments}
    branch = branches[0]
    emp_list = []
    for emp_data in EMPLOYEES_DATA:
        dept = dept_map.get(emp_data["dept"])
        emp = Employee(
            employee_code=emp_data["code"],
            first_name=emp_data["first_name"],
            last_name=emp_data["last_name"],
            first_name_ar=emp_data["first_name_ar"],
            last_name_ar=emp_data["last_name_ar"],
            email=emp_data["email"],
            phone=emp_data["phone"],
            nationality=emp_data["nationality"],
            role=emp_data["role"],
            position=emp_data["position"],
            joining_date=date(random.randint(2018, 2024), random.randint(1, 12), random.randint(1, 28)),
            basic_salary=emp_data["salary"],
            housing_allowance=emp_data["salary"] * 0.3,
            transportation_allowance=emp_data["salary"] * 0.1,
            total_salary=emp_data["salary"] * 1.4,
            department_id=dept.id if dept else None,
            branch_id=branch.id,
            tenant_id=branch.id,
            emirates_id=generate_emirates_id(),
        )
        session.add(emp)
        emp_list.append(emp)
    await session.flush()
    return emp_list


async def seed_brands(session):
    brands_map = {}
    for b in BRANDS_DATA:
        brand = Brand(
            name_en=b["name_en"],
            name_ar=b["name_ar"],
            country=b["country"],
        )
        session.add(brand)
        brands_map[b["name_en"]] = brand
    await session.flush()
    return brands_map


async def seed_colors(session):
    color_list = []
    for c in COLORS_DATA:
        color = VehicleColor(
            name_en=c["name_en"],
            name_ar=c["name_ar"],
            hex_code=c["hex"],
            color_type=c["color_type"],
        )
        session.add(color)
        color_list.append(color)
    await session.flush()
    return color_list


async def seed_vehicle_models(session, brands_map):
    models_list = []
    for brand_name, model_configs in MODELS_DATA.items():
        brand = brands_map[brand_name]
        for mc in model_configs:
            model = VehicleModel(
                brand_id=brand.id,
                name_en=mc["name_en"],
                name_ar=mc["name_ar"],
                body_type=mc["body_type"],
                fuel_type=mc["fuel_type"],
                engine_capacity=mc["engine"],
                transmission=mc["trans"],
                seating_capacity=mc["seats"],
                year=random.choice([2024, 2025, 2026]),
            )
            session.add(model)
            models_list.append((brand_name, mc, model))
    await session.flush()
    return models_list


async def seed_vehicle_trims(session, all_models):
    trim_list = []
    for brand_name, mc, model in all_models:
        for trim_name, price in mc["trims"]:
            trim = VehicleTrim(
                model_id=model.id,
                name_en=trim_name,
                name_ar=trim_name,
                price_base=price,
                price_aed=price * 3.67,
            )
            session.add(trim)
            trim_list.append(trim)
    await session.flush()
    return trim_list


async def seed_customers(session):
    cust_list = []
    for cd in CUSTOMERS_DATA:
        cust = Customer(
            customer_type=CustomerType.INDIVIDUAL,
            first_name=cd["first_name"],
            last_name=cd["last_name"],
            first_name_ar=cd["first_name_ar"],
            last_name_ar=cd["last_name_ar"],
            email=f"{cd['first_name'].lower()}.{cd['last_name'].lower().replace(' ','')}@email.com",
            phone=cd["phone"],
            emirates_id=cd["emirates_id"],
            nationality=cd["nationality"],
            city=cd["city"],
            emirate=cd["emirate"],
            occupation=cd["occupation"],
            employer=cd["employer"],
            annual_income=cd["annual_income"],
            preferred_language=PreferredLanguage.ARABIC if random.random() > 0.5 else PreferredLanguage.ENGLISH,
            status=CustomerStatus.ACTIVE,
            total_vehicles_purchased=random.randint(0, 5),
            total_revenue=0,
            lifetime_value=0,
        )
        session.add(cust)
        cust_list.append(cust)
    await session.flush()
    return cust_list


async def seed_vehicles(session, all_models, all_trims, colors, customers, branch):
    vehicle_list = []
    status_weights = [VehicleStatus.IN_STOCK] * 5 + [VehicleStatus.SOLD] * 3 + [VehicleStatus.RESERVED] * 1 + [VehicleStatus.IN_TRANSIT] * 1

    random.shuffle(all_trims)
    selected_trims = all_trims[:32]

    for i, trim in enumerate(selected_trims):
        vin = VINS[i] if i < len(VINS) else f"VIN{i:017d}"
        color = random.choice(colors)
        year = random.choice([2024, 2025, 2026])
        mileage = random.randint(0, 100) if year == 2026 else random.randint(500, 15000) if year == 2025 else random.randint(5000, 40000)
        condition = VehicleCondition.NEW if mileage < 500 else VehicleCondition.USED
        status = random.choice(status_weights)
        sale_price = trim.price_aed * random.uniform(0.95, 1.15)
        purchase_cost = trim.price_aed * random.uniform(0.7, 0.85)

        vehicle = Vehicle(
            vin=vin,
            chassis_number=f"CHS{random.randint(100000,999999)}",
            engine_number=f"ENG{random.randint(100000,999999)}",
            model_id=trim.model_id,
            trim_id=trim.id,
            color_id=color.id,
            year=year,
            mileage=mileage,
            condition=condition,
            status=status,
            vehicle_type=VehicleType.NEW,
            stock_location="Main Showroom",
            purchase_price=purchase_cost,
            sale_price=sale_price,
            tax_amount=sale_price * 0.05,
            total_cost=purchase_cost,
            profit_margin=sale_price - purchase_cost,
            branch_id=branch.id,
            tenant_id=branch.id,
            features=["Leather Seats", "Sunroof", "Navigation", "Apple CarPlay", "360 Camera"],
        )
        session.add(vehicle)
        vehicle_list.append((vehicle, trim))
    await session.flush()
    return vehicle_list


async def seed_leads(session, customers, employees, brands_map, branch):
    lead_list = []
    lead_statuses = [LeadStatus.NEW, LeadStatus.CONTACTED, LeadStatus.QUALIFIED, LeadStatus.PROPOSAL, LeadStatus.NEGOTIATION, LeadStatus.CLOSED_WON, LeadStatus.CLOSED_LOST]

    for i, customer in enumerate(customers[:18]):
        employee = random.choice(employees)
        brand = random.choice(list(brands_map.values()))
        status = random.choice(lead_statuses[:6])
        budget_min = random.choice([500000, 800000, 1000000, 1500000, 2000000, 3000000])
        budget_max = budget_min + random.choice([200000, 500000, 1000000, 2000000])

        lead = SalesLead(
            customer_id=customer.id,
            assigned_to=employee.id,
            source=random.choice(LEAD_SOURCES),
            status=status,
            priority=random.choice(["low", "medium", "high"]),
            interest_brand_id=brand.id,
            budget_min=budget_min,
            budget_max=budget_max,
            financing_required=random.random() > 0.5,
            trade_in_interest=random.random() > 0.7,
            lead_score=random.uniform(10, 100),
            lead_value=random.uniform(budget_min, budget_max),
            branch_id=branch.id,
            tenant_id=branch.id,
        )
        session.add(lead)
        lead_list.append(lead)
    await session.flush()
    return lead_list


async def seed_sales_contracts(session, customers, employees, vehicles, leads, branch):
    contract_statuses = ["draft", "signed", "completed", "cancelled"]

    for i in range(min(12, len(vehicles))):
        vehicle, trim = vehicles[i]
        customer = random.choice(customers)
        employee = random.choice(employees)
        contract_number = f"CONT-2025-{i+1:04d}"
        sale_price = vehicle.sale_price or trim.price_aed
        vat = sale_price * 0.05
        total = sale_price + vat
        deposit = total * random.uniform(0.1, 0.3)
        status = random.choice(contract_statuses)

        contract = SalesContract(
            contract_number=contract_number,
            customer_id=customer.id,
            salesperson_id=employee.id,
            vehicle_id=vehicle.id,
            contract_date=date(2025, random.randint(1, 6), random.randint(1, 28)),
            sale_type=random.choice(SALE_TYPE_OPTIONS),
            vehicle_price=sale_price,
            discount=random.choice([0, 50000, 100000]) if sale_price > 1000000 else random.choice([0, 10000, 25000]),
            tax_amount=vat,
            total_amount=total,
            deposit_amount=deposit,
            balance_due=total - deposit,
            payment_terms="10% deposit, 90% on delivery",
            delivery_date=date(2025, random.randint(6, 12), random.randint(1, 28)),
            delivery_status="pending" if status != "completed" else "delivered",
            status=status,
            branch_id=branch.id,
            tenant_id=branch.id,
        )
        session.add(contract)
    await session.flush()


async def seed_test_drives(session, customers, employees, vehicles, branch):
    for i in range(min(8, len(vehicles))):
        vehicle, trim = vehicles[i]
        customer = random.choice(customers)
        employee = random.choice(employees)
        days_from_now = random.randint(1, 60)
        scheduled = datetime.now(timezone.utc) + timedelta(days=days_from_now)

        td = TestDrive(
            vehicle_id=vehicle.id,
            customer_id=customer.id,
            salesperson_id=employee.id,
            scheduled_at=scheduled,
            status=random.choice(["scheduled", "completed", "cancelled"]),
            feedback="Excellent ride quality" if random.random() > 0.3 else "",
            rating=random.randint(3, 5),
            branch_id=branch.id,
            tenant_id=branch.id,
        )
        session.add(td)
    await session.flush()


if __name__ == "__main__":
    import asyncio
    asyncio.run(init_and_seed())
