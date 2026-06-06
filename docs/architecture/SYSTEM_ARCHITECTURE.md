# UAE Car Showroom Management System - Architecture Document

## System Overview

The UAE Car Showroom Management System is a cloud-native, multi-tenant enterprise platform designed for automotive dealership operations across all seven UAE emirates.

## Architecture Style

**Domain-Driven Design (DDD)** with **Microservices** architecture, implemented initially as a modular monolith with clear bounded contexts for easy future extraction into separate services.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Client Layer                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │  Next.js  │  │  React   │  │  Mobile  │  │  Third-Party     │   │
│  │   (SSR)   │  │   SPA    │  │  (R.N.)  │  │  Integrations    │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────────┬─────────┘   │
│       │              │              │                  │            │
├───────┴──────────────┴──────────────┴──────────────────┴────────────┤
│                         API Gateway (Nginx)                         │
│                    ┌─────────────────────────┐                      │
│                    │   Rate Limiting / WAF    │                     │
│                    │   Load Balancing         │                     │
│                    │   SSL Termination        │                     │
│                    │   Request Routing        │                     │
│                    └────────────┬────────────┘                      │
├─────────────────────────────────┴──────────────────────────────────┤
│                         Application Layer                           │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    FastAPI Application                        │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │  │
│  │  │Inventory│ │  Sales  │ │   CRM   │ │ Finance │  ...       │  │
│  │  │ Module  │ │ Module  │ │ Module  │ │ Module  │           │  │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘           │  │
│  │                                                              │  │
│  │  ┌─────────┐ ┌─────────┐ ┌──────────────────────────────┐  │  │
│  │  │ Service │ │   HR    │ │         AI Engine             │  │  │
│  │  │ Module  │ │ Module  │ │  (ML/DL/Prediction/NLP)       │  │  │
│  │  └─────────┘ └─────────┘ └──────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────┘  │
├─────────────────────────────────┬──────────────────────────────────┤
│                         Service Layer                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │  Redis   │  │  Celery  │  │  Celery  │  │  Report Engine   │  │
│  │ (Cache)  │  │(Worker)  │  │  (Beat)  │  │(PDF/Excel/CSV)   │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘  │
├─────────────────────────────────┴──────────────────────────────────┤
│                         Data Layer                                 │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    PostgreSQL (Primary)                       │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌──────────────────┐   │  │
│  │  │  Main   │ │  Audit  │ │  AI/ML  │ │    Time-series   │   │  │
│  │  │  DB     │ │  Logs   │ │  Data   │ │    (Metrics)     │   │  │
│  │  └─────────┘ └─────────┘ └─────────┘ └──────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                         │
│  │ MinIO/S3 │  │   ES     │  │  Redis   │                         │
│  │ (Files)  │  │(Search)  │  │ (Session)│                         │
│  └──────────┘  └──────────┘  └──────────┘                         │
└─────────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Backend
- **Runtime:** Python 3.12
- **Framework:** FastAPI 0.115+ with async support
- **ORM:** SQLAlchemy 2.0+ (async)
- **Database:** PostgreSQL 16
- **Cache:** Redis 7
- **Queue:** Celery 5.4+ with Redis broker
- **Auth:** JWT with OAuth2 + MFA support

### Frontend
- **Framework:** Next.js 14+ (React 18)
- **Language:** TypeScript 5.5+
- **Styling:** TailwindCSS 3.4+
- **State:** Zustand + React Query
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod

### AI/ML
- **ML Framework:** scikit-learn, XGBoost
- **Deep Learning:** TensorFlow/PyTorch
- **NLP:** Transformers, Sentence-Transformers
- **Model Serving:** ONNX Runtime

### Infrastructure
- **Container:** Docker
- **Orchestration:** Kubernetes
- **Service Mesh:** Not required initially
- **API Gateway:** Nginx
- **CI/CD:** GitHub Actions
- **Monitoring:** Prometheus + Grafana

### Cloud (Multi-Cloud Ready)
- **AWS:** me-central-1 (UAE)
- **Azure:** UAE North
- **GCP:** me-central2 (planned)

## Database Schema

### Core Entities (52 tables)

```
brands
  ├── vehicle_models
  │     └── vehicle_trims
  ├── vehicle_colors
  └── vehicles
        ├── vehicle_images
        ├── vehicle_documents
        ├── inventory_transfers
        ├── stock_alerts
        └── vehicle_bookings

customers
  ├── companies
  ├── contacts
  ├── interactions
  ├── customer_timelines
  ├── customer_segments
  ├── vip_customers
  └── communication_templates

sales_leads
  ├── opportunities
  ├── test_drives
  ├── sales_quotations
  └── sales_contracts
        ├── delivery_checklists
        └── commissions

accounts
  ├── transactions
  ├── invoices
  │     └── payments
  ├── expenses
  ├── loan_applications
  ├── lease_contracts
  └── vat_records

employees
  ├── departments
  ├── attendance
  ├── payroll
  ├── leave_requests
  └── technicians

service_appointments
  ├── service_orders
  ├── repair_orders
  ├── spare_parts
  │     └── spare_part_inventory
  └── warranty_claims

campaigns
  └── campaign_leads
```

## Security Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Security Layers                      │
├─────────────────────────────────────────────────────┤
│ 1. Network Security                                  │
│    - TLS 1.3 for all communications                  │
│    - WAF (Web Application Firewall)                  │
│    - DDoS protection                                 │
│    - Network segmentation (VPC)                      │
├─────────────────────────────────────────────────────┤
│ 2. Application Security                              │
│    - JWT with short expiration (30 min)              │
│    - Refresh token rotation                          │
│    - MFA support (TOTP)                              │
│    - RBAC with granular permissions                  │
│    - Rate limiting (slowapi)                         │
│    - Input validation (Pydantic)                    │
│    - SQL injection prevention (ORM)                 │
│    - XSS protection (Content Security Policy)       │
├─────────────────────────────────────────────────────┤
│ 3. Data Security                                     │
│    - AES-256 encryption at rest                     │
│    - TLS 1.3 in transit                              │
│    - S3 server-side encryption                       │
│    - Database encryption (TDE)                       │
│    - PII data masking                                │
│    - Audit logging for all changes                  │
├─────────────────────────────────────────────────────┤
│ 4. Infrastructure Security                           │
│    - Regular security patches                        │
│    - Vulnerability scanning (Trivy)                  │
│    - Dependency scanning (Safety)                    │
│    - Container image scanning                        │
│    - Secrets management (K8s secrets)                │
│    - Minimal container base images                   │
├─────────────────────────────────────────────────────┤
│ 5. Compliance                                        │
│    - UAE Data Protection Law                         │
│    - GDPR readiness                                  │
│    - SOC 2 compliance architecture                   │
│    - PCI DSS for payment processing                  │
│    - UAE VAT compliance (5% rate)                    │
│    - ESMA/ Central Bank regulations                  │
└─────────────────────────────────────────────────────┘
```

## Scaling Strategy

### Vertical Scaling (Current)
- Increase PostgreSQL resources (CPU/RAM)
- Increase application workers
- Redis memory optimization

### Horizontal Scaling (Phase 2)
- Read replicas for PostgreSQL
- Redis Cluster mode
- Application auto-scaling (K8s HPA)
- CDN for static assets

### Enterprise Scaling (Phase 3)
- Database sharding by tenant/branch
- Event sourcing for audit
- CQRS for reporting
- Data warehouse for analytics

## Performance Targets

- API response time: <200ms (p95)
- Concurrent users: 1,000+
- Inventory search: <500ms
- Report generation: <30s
- System availability: 99.9%
- Data backup: Every 6 hours
- Disaster recovery: <4 hours RPO, <24 hours RTO
