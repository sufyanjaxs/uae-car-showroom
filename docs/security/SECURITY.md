# Security Documentation - UAE Car Showroom Management System

## Security Architecture Overview

Enterprise-grade security built on defense-in-depth principles, addressing OWASP Top 10 and UAE data protection regulations.

## 1. Authentication & Authorization

### JWT-Based Authentication
- **Access Token:** 30-minute expiration
- **Refresh Token:** 7-day expiration with rotation
- **Algorithm:** HS256 with 256-bit key
- **Payload:** user_id, role, tenant_id, branch_id

### Multi-Factor Authentication (MFA)
- TOTP-based (RFC 6238)
- Backup codes for recovery
- QR code provisioning
- Optional enforcement per role

### Role-Based Access Control (RBAC)

| Role | Permissions |
|------|-------------|
| CEO | Full system access, financial reports |
| General Manager | All operations, no payroll access |
| Sales Manager | Sales pipeline, team management |
| Salesperson | Leads, test drives, quotations |
| Finance Manager | Invoices, payments, VAT, accounts |
| Accountant | Transactions, expense recording |
| Service Manager | Service orders, warranty claims |
| Technician | Service tasks, parts requests |
| Marketing Manager | Campaigns, lead sources |
| HR Manager | Employee records, payroll |
| Admin | System configuration, user management |

## 2. Data Encryption

### At Rest
- **Database:** AES-256 encryption (PostgreSQL TDE)
- **Files:** AES-256 server-side encryption (S3/MinIO)
- **Backups:** GPG encryption with separate key management
- **Secrets:** Kubernetes secrets + HashiCorp Vault (recommended)

### In Transit
- **TLS 1.3** minimum for all communications
- **mTLS** for service-to-service communication
- **HSTS** with preload
- **Certificate pinning** for mobile apps

## 3. API Security

### Request Validation
- All input validated via Pydantic schemas
- SQL injection prevented by SQLAlchemy ORM
- XSS protection via Content-Security-Policy headers
- CSRF protection via double-submit cookies

### Rate Limiting
```python
# Per endpoint limits
@router.get("/api/v1/inventory")
@limiter.limit("100/minute")
```

| Endpoint | Rate Limit |
|----------|-----------|
| Authentication | 5/minute |
| API General | 100/minute |
| Report Export | 10/minute |
| File Upload | 20/minute |

### OWASP Top 10 Coverage

| # | Category | Mitigation |
|---|----------|------------|
| 1 | Broken Access Control | RBAC + permission checks on every endpoint |
| 2 | Cryptographic Failures | AES-256, TLS 1.3, secure key management |
| 3 | Injection | Parameterized queries (SQLAlchemy), Pydantic validation |
| 4 | Insecure Design | Threat modeling, security review process |
| 5 | Security Misconfiguration | Hardened defaults, security scanning |
| 6 | Vulnerable Components | Regular dependency scanning (Dependabot) |
| 7 | Auth Failures | JWT with short expiry, MFA support |
| 8 | Data Integrity Failures | Digital signatures for contracts |
| 9 | Logging Failures | Comprehensive audit logging |
| 10 | SSRF | URL validation, restricted outbound traffic |

## 4. Audit Logging

### Events Logged
- Authentication attempts (success/failure)
- CRUD operations on sensitive data
- Financial transactions
- User permission changes
- Configuration changes
- Data exports
- API access patterns

### Log Format
```json
{
  "timestamp": "2026-06-05T10:30:00Z",
  "user_id": "uuid",
  "action": "VEHICLE_CREATED",
  "resource": "vehicles",
  "resource_id": "uuid",
  "ip_address": "192.168.1.100",
  "user_agent": "Mozilla/5.0...",
  "request_id": "uuid",
  "changes": {"vin": {"old": null, "new": "WBA..."}}
}
```

### Retention
- Active logs: 90 days in database
- Archived logs: 7 years in cold storage
- Audit logs: Immutable, append-only

## 5. Session Management

- Session timeout: 30 minutes of inactivity
- Maximum concurrent sessions: 5
- Force logout on password change
- Session revocation on role change
- Device fingerprinting
- IP geolocation monitoring

## 6. Network Security

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Internet    │────▶│   WAF      │────▶│  Load       │
│              │     │ (ModSec)   │     │  Balancer   │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                                │
                    ┌───────────────────────────┴───────────┐
                    │           Private Subnet               │
                    │  ┌──────────┐  ┌──────────┐           │
                    │  │  API     │  │  Redis   │           │
                    │  │  Servers │  │  Cache   │           │
                    │  └──────────┘  └──────────┘           │
                    │  ┌──────────┐  ┌──────────┐           │
                    │  │Celery    │  │PostgreSQL│           │
                    │  │Workers   │  │  Primary │           │
                    │  └──────────┘  └──────────┘           │
                    └───────────────────────────────────────┘
```

## 7. Compliance

### UAE Data Protection
- Data residency in UAE regions only
- Consent management for marketing communications
- Right to access and deletion (DSAR)
- Data Protection Impact Assessment (DPIA) completed

### UAE VAT Compliance
- VAT calculation at 5% (standard rate)
- VAT invoice numbering sequence
- VAT record retention (5 years)
- Quarterly VAT return filing support

### PCI DSS (Payment Processing)
- Tokenization of payment data
- No storage of CVV or full PAN
- SAQ A-EP compliance level
- Annual security assessment

## 8. Incident Response

### Tiers

| Tier | Response Time | Severity | Examples |
|------|--------------|----------|---------|
| 1 | < 1 hour | Critical | Data breach, service outage |
| 2 | < 4 hours | High | Unauthorized access, data loss |
| 3 | < 24 hours | Medium | Suspicious activity, policy violation |
| 4 | < 72 hours | Low | Failed login attempts, minor incidents |

### Response Plan
1. **Detection:** Automated monitoring + user reports
2. **Containment:** Isolate affected systems
3. **Eradication:** Remove threat, patch vulnerability
4. **Recovery:** Restore from clean backup
5. **Post-mortem:** Root cause analysis, improvements

## 9. Security Testing

### Regular Schedule

| Test Type | Frequency | Tool |
|-----------|-----------|------|
| SAST | Every commit | Bandit, SonarQube |
| DAST | Weekly | OWASP ZAP |
| Dependency Scan | Daily | Safety, Dependabot |
| Container Scan | Every build | Trivy |
| Penetration Test | Quarterly | External vendor |
| Red Team | Annually | External vendor |

## 10. Security Contact

- **Security Team:** security@uae-carshowroom.com
- **Bug Bounty:** https://bugcrowd.com/uae-carshowroom
- **PGP Key:** Available on security page
- **Response SLA:** Critical issues within 1 hour
