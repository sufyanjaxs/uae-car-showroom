# Entity Relationship Diagram (ERD)

## Database Schema Overview

The system uses 52 database tables organized into 7 business domains:

```
┌─────────────────────────────────────────────────────────────────┐
│                    INVENTORY DOMAIN (8 tables)                   │
├─────────────────────────────────────────────────────────────────┤
│ brands ◄──┐                                                     │
│           │                                                     │
│ vehicle_models ◄──┐                                             │
│                   │                                             │
│ vehicle_trims     │                                             │
│                   │                                             │
│ vehicle_colors    │                                             │
│                   │                                             │
│ vehicles ◄────────┴──┬───────────────────────────────────────── │
│    ├── vehicle_images│                                         │
│    ├── vehicle_documents                                       │
│    ├── inventory_transfers                                     │
│    ├── stock_alerts                                            │
│    └── vehicle_bookings                                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       CRM DOMAIN (8 tables)                     │
├─────────────────────────────────────────────────────────────────┤
│ customers ◄──────┬───────────────────────────────────────────── │
│    ├── companies │                                              │
│    ├── contacts  │                                              │
│    ├── interactions                                             │
│    ├── customer_timelines                                       │
│    ├── customer_segments                                        │
│    ├── vip_customers                                            │
│    └── communication_templates                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      SALES DOMAIN (7 tables)                    │
├─────────────────────────────────────────────────────────────────┤
│ sales_leads ◄──────┐                                            │
│    ├── opportunities│                                           │
│    ├── test_drives  │                                           │
│    ├── sales_quotations                                         │
│    ├── sales_contracts ◄──────┐                                 │
│    │    ├── delivery_checklists│                                │
│    │    └── commissions        │                                │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                    FINANCE DOMAIN (7 tables)                     │
├──────────────────────────────────────────────────────────────────┤
│ accounts                                                        │
│ transactions                                                    │
│ invoices ◄───────┐                                              │
│    └── payments  │                                              │
│ expenses         │                                              │
│ loan_applications│                                              │
│ lease_contracts  │                                              │
│ vat_records      │                                              │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                    SERVICE DOMAIN (6 tables)                     │
├──────────────────────────────────────────────────────────────────┤
│ service_appointments                                            │
│ service_orders                                                  │
│ repair_orders                                                   │
│ spare_parts                                                     │
│    └── spare_part_inventory                                     │
│ technicians                                                     │
│ warranty_claims                                                 │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                      HR DOMAIN (5 tables)                       │
├──────────────────────────────────────────────────────────────────┤
│ departments                                                     │
│ employees                                                       │
│ attendance                                                      │
│ payroll                                                         │
│ leave_requests                                                  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                   MARKETING DOMAIN (3 tables)                    │
├──────────────────────────────────────────────────────────────────┤
│ campaigns                                                       │
│ campaign_leads                                                  │
│ marketing_templates                                             │
└──────────────────────────────────────────────────────────────────┘
```

## Key Relationships

### Vehicle-Centric Relationships
```
vehicles.owner_id → customers.id
vehicles.model_id → vehicle_models.id
vehicles.trim_id → vehicle_trims.id
vehicles.color_id → vehicle_colors.id
vehicles.created_by → employees.id
```

### Customer-Centric Relationships
```
sales_leads.customer_id → customers.id
sales_contracts.customer_id → customers.id
invoices.customer_id → customers.id
interactions.customer_id → customers.id
customer_timelines.customer_id → customers.id
service_appointments.customer_id → customers.id
loan_applications.customer_id → customers.id
```

### Employee-Centric Relationships
```
sales_leads.assigned_to → employees.id
sales_contracts.salesperson_id → employees.id
commissions.salesperson_id → employees.id
interactions.assigned_to → employees.id
attendance.employee_id → employees.id
payroll.employee_id → employees.id
technicians.employee_id → employees.id
```

### Financial Relationships
```
transactions.account_id → accounts.id
invoices.contract_id → sales_contracts.id
payments.invoice_id → invoices.id
expenses.approved_by → employees.id
loan_applications.customer_id → customers.id
loan_applications.vehicle_id → vehicles.id
```

## Indexing Strategy

### Primary Indexes (Primary Keys)
- All tables: `id` (UUID)

### Unique Constraints
- `vehicles.vin`
- `vehicles.chassis_number`
- `vehicles.rfid_tag`
- `customers.email`
- `customers.phone`
- `customers.emirates_id`
- `employees.employee_code`
- `employees.email`
- `accounts.account_number`
- `accounts.iban`
- `invoices.invoice_number`
- `sales_contracts.contract_number`
- `spare_parts.part_number`
- `spare_parts.barcode`

### Performance Indexes
- `vehicles.status`, `vehicles.model_id`, `vehicles.year`
- `customers.status`, `customers.customer_type`, `customers.emirate`
- `sales_leads.status`, `sales_leads.source`, `sales_leads.assigned_to`
- `invoices.status`, `invoices.issue_date`
- `interactions.customer_id`, `interactions.interaction_date`
- `attendance.employee_id`, `attendance.date`

## Data Types

| PostgreSQL Type | Usage |
|----------------|-------|
| UUID | Primary keys, foreign keys |
| VARCHAR(n) | String fields with length limits |
| TEXT | Long text (notes, descriptions) |
| INTEGER | Counts, years, IDs |
| FLOAT | Monetary values, percentages |
| DATE | Dates without time |
| TIMESTAMP WITH TIME ZONE | Full timestamps |
| BOOLEAN | True/false flags |
| JSON | Flexible attributes, metadata |
| ENUM | Predefined value sets |

## Migration Strategy

- **Tool:** Alembic
- **Strategy:** Incremental migrations
- **Naming Convention:** `YYYY_MM_DD_HHMM_description.py`
- **Review Process:** All migrations reviewed before merge
- **Rollback:** Reversible migrations required for production

*For full SQL schema, see `database/schema.sql`*
