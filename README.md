# UAE Car Showroom Management System

Enterprise automotive dealership ERP system for the United Arab Emirates market. Manage single showrooms, multi-branch enterprises, and franchise operations across all 7 emirates.

## Features

- **Inventory Management**: New, used, trade-in, consignment vehicles with full lifecycle tracking
- **Sales Pipeline**: Leads → Test drives → Quotations → Contracts → Delivery
- **CRM**: Customer 360, VIP management, communication tracking, AI-powered scoring
- **Finance & Accounting**: Invoicing, payments, UAE VAT (5%), loan processing, leasing
- **Service & Workshop**: Appointments, repairs, spare parts inventory, warranty claims
- **HR Management**: Employee records, attendance, payroll, commissions
- **Marketing**: Campaign management, lead source tracking, ROI analysis
- **AI Engine**: Price prediction, demand forecasting, lead scoring, recommendations
- **Reports**: Role-based dashboards, PDF/Excel/CSV exports
- **Security**: RBAC, MFA, JWT, audit logs, encryption at rest and in transit

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python 3.12, FastAPI, SQLAlchemy (async), Celery |
| Database | PostgreSQL 16, Redis 7 |
| Frontend | Next.js 14, React 18, TypeScript, TailwindCSS |
| AI/ML | scikit-learn, XGBoost, TensorFlow, Transformers |
| Infrastructure | Docker, Kubernetes, Nginx, GitHub Actions |
| Cloud | AWS (me-central-1), Azure (UAE North), GCP |

## Quick Start

```bash
# Clone repository
git clone <repo-url>
cd uae-car-showroom

# Start with Docker
docker-compose -f docker/docker-compose.yml up -d

# Or run manually
cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload
cd frontend && npm install && npm run dev
```

## API Documentation

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- OpenAPI Spec: `http://localhost:8000/openapi.json`

## Project Structure

```
uae-car-showroom/
├── backend/                    # FastAPI application
│   ├── app/
│   │   ├── api/v1/            # API endpoints (11 modules)
│   │   ├── models/            # SQLAlchemy models (52 tables)
│   │   ├── schemas/           # Pydantic validation schemas
│   │   ├── services/          # Business logic layer
│   │   ├── ai/                # AI/ML engine (7 models)
│   │   ├── core/              # Security, config, utilities
│   │   └── utils/             # Helpers, export functions
│   ├── tests/                 # Test suite
│   ├── celery_tasks/          # Background tasks
│   └── Dockerfile
├── frontend/                   # Next.js application
│   ├── src/
│   │   ├── app/               # Pages (dashboard, inventory, CRM...)
│   │   ├── components/        # UI components library
│   │   └── lib/               # API client, utilities
│   └── package.json
├── docker/                     # Docker Compose + Nginx config
├── kubernetes/                  # K8s manifests
├── .github/workflows/          # CI/CD pipeline
└── docs/                       # Documentation
    ├── architecture/
    ├── deployment/
    ├── security/
    ├── api/
    ├── ai-models/
    ├── testing/
    ├── user-manuals/
    └── admin-manuals/
```

## Documentation

- [Benchmark Report](docs/BENCHMARK_REPORT.md) - Industry DMS analysis
- [System Architecture](docs/architecture/SYSTEM_ARCHITECTURE.md) - Technical design
- [API Reference](docs/api/API_REFERENCE.md) - Complete API documentation
- [Deployment Guide](docs/deployment/DEPLOYMENT_GUIDE.md) - Production setup
- [Security Documentation](docs/security/SECURITY.md) - Security architecture
- [AI Models](docs/ai-models/AI_MODELS.md) - ML model documentation
- [Testing Report](docs/testing/TESTING_REPORT.md) - Test coverage
- [User Manual](docs/user-manuals/USER_MANUAL.md) - End-user guide
- [Admin Manual](docs/admin-manuals/ADMIN_MANUAL.md) - System admin guide
- [ERD](docs/architecture/ERD.md) - Database schema

## License

Proprietary - All rights reserved
