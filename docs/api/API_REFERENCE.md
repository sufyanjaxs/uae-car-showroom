# API Reference - UAE Car Showroom Management System

## Base URL

```
Production: https://api.uae-carshowroom.com/api/v1
Development: http://localhost:8000/api/v1
```

## Authentication

All API requests require JWT authentication via Bearer token.

```
Authorization: Bearer <access_token>
```

### Auth Endpoints

```
POST   /auth/login              # Login with email/password
POST   /auth/register           # Register new user
POST   /auth/refresh            # Refresh access token
POST   /auth/change-password    # Change password
POST   /auth/forgot-password    # Request password reset
POST   /auth/reset-password     # Reset password with token
```

## Inventory

### Brands
```
GET    /inventory/brands                   # List all brands
POST   /inventory/brands                   # Create brand (admin)
GET    /inventory/brands/{id}              # Get brand details
PUT    /inventory/brands/{id}              # Update brand
DELETE /inventory/brands/{id}              # Delete brand
```

### Models
```
GET    /inventory/models                   # List models (?brand_id=&year=)
POST   /inventory/models                   # Create model (admin)
GET    /inventory/models/{id}              # Get model details
```

### Trims
```
GET    /inventory/trims                    # List trims
POST   /inventory/trims                    # Create trim (admin)
```

### Colors
```
GET    /inventory/colors                   # List colors
```

### Vehicles
```
GET    /inventory/                         # List vehicles (paginated, filterable)
POST   /inventory/                         # Create vehicle
GET    /inventory/{id}                     # Get vehicle details
PUT    /inventory/{id}                     # Update vehicle
DELETE /inventory/{id}                     # Soft delete vehicle
```

**Query Parameters for GET /inventory:**
- `query` - Search VIN, chassis, license plate
- `status` - Filter by status (in_stock, reserved, sold, etc.)
- `condition` - Filter by condition (new, used, certified)
- `vehicle_type` - Filter by type (new, used, trade_in, consignment)
- `brand_id` - Filter by brand
- `model_id` - Filter by model
- `year_from` / `year_to` - Year range
- `price_min` / `price_max` - Price range
- `page` / `page_size` - Pagination (default: page=1, page_size=20)
- `sort_by` / `sort_order` - Sorting (created_at, sale_price, year)

## CRM

### Customers
```
GET    /crm/customers                      # List customers (paginated)
POST   /crm/customers                      # Create customer
GET    /crm/customers/{id}                 # Get customer details
PUT    /crm/customers/{id}                 # Update customer
DELETE /crm/customers/{id}                 # Delete customer
GET    /crm/customers/{id}/timeline        # Get customer timeline
GET    /crm/customers/{id}/interactions    # Get customer interactions
```

### Interactions
```
POST   /crm/interactions                   # Log interaction
```

## Sales

### Leads
```
GET    /sales/leads                        # List leads (filterable)
POST   /sales/leads                        # Create lead
GET    /sales/leads/{id}                   # Get lead details
PUT    /sales/leads/{id}                   # Update lead
```

### Test Drives
```
POST   /sales/test-drives                  # Schedule test drive
GET    /sales/test-drives                  # List test drives
```

### Quotations
```
POST   /sales/quotations                   # Create quotation
GET    /sales/quotations                   # List quotations
```

### Contracts
```
POST   /sales/contracts                    # Create contract
GET    /sales/contracts                    # List contracts
GET    /sales/contracts/{id}               # Get contract details
```

## Finance

### Invoices
```
GET    /finance/invoices                   # List invoices
POST   /finance/invoices                   # Create invoice
GET    /finance/invoices/{id}              # Get invoice details
```

### Payments
```
POST   /finance/payments                   # Record payment
```

### Loan Applications
```
POST   /finance/loan-applications          # Create loan application
GET    /finance/loan-applications          # List loan applications
```

### VAT
```
GET    /finance/vat-records                # List VAT records
```

## Service

### Appointments
```
GET    /service/appointments               # List appointments
POST   /service/appointments               # Create appointment
```

### Spare Parts
```
GET    /service/spare-parts                # List spare parts (?low_stock=true)
```

### Warranty
```
GET    /service/warranty-claims            # List warranty claims
```

## HR

### Employees
```
GET    /hr/employees                       # List employees
GET    /hr/employees/{id}                  # Get employee details
```

### Departments
```
GET    /hr/departments                     # List departments
```

### Attendance
```
GET    /hr/attendance                      # Get attendance records
```

### Payroll
```
GET    /hr/payroll                         # List payroll records
```

## Marketing

### Campaigns
```
GET    /marketing/campaigns                # List campaigns
POST   /marketing/campaigns                # Create campaign
GET    /marketing/campaigns/{id}           # Get campaign details
```

### Templates
```
GET    /marketing/templates                # List marketing templates
```

## Reports

```
GET    /reports/sales-summary              # Sales performance summary
GET    /reports/inventory-summary          # Inventory status summary
GET    /reports/customer-summary           # Customer analytics summary
GET    /reports/finance-summary            # Financial summary
GET    /reports/performance                # Combined performance report
```

## Dashboard

```
GET    /dashboard/ceo                      # CEO-level dashboard data
GET    /dashboard/sales                    # Sales dashboard
GET    /dashboard/inventory                # Inventory dashboard
GET    /dashboard/finance                  # Finance dashboard
```

## AI Endpoints (Future)

```
POST   /ai/predict-price                   # Predict vehicle price
POST   /ai/score-lead                      # Score lead conversion probability
POST   /ai/forecast-demand                 # Forecast demand for models
POST   /ai/recommend-vehicles              # Get vehicle recommendations
POST   /ai/chat                            # AI chat assistant
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Duplicate resource |
| 422 | Validation Error - Schema validation failed |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

## Response Format

### Success
```json
{
  "id": "uuid",
  "vin": "WBA1234567890",
  "status": "in_stock",
  "created_at": "2026-06-05T10:30:00Z"
}
```

### Paginated
```json
{
  "items": [...],
  "total": 150,
  "page": 1,
  "page_size": 20,
  "total_pages": 8
}
```

### Error
```json
{
  "detail": "Error message",
  "request_id": "uuid"
}
```
