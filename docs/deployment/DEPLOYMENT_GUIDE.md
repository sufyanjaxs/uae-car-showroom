# Deployment Guide - UAE Car Showroom Management System

## Prerequisites

### Required Tools
- Docker 24.0+
- Docker Compose 2.20+
- Kubernetes 1.28+ (for production)
- kubectl
- Helm 3.0+
- Python 3.12+
- Node.js 20+
- Git

### Cloud Accounts (Choose One)
- **AWS:** me-central-1 (UAE) or eu-west-1
- **Azure:** UAE North region
- **GCP:** me-central2 (when available)

## Quick Start (Development)

### 1. Clone and Setup

```bash
git clone <repository-url>
cd uae-car-showroom

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Frontend setup
cd ../frontend
npm install
```

### 2. Environment Configuration

```bash
# Backend .env file
cp backend/.env.example backend/.env
# Edit backend/.env with your settings

# Frontend .env.local file
cp frontend/.env.local.example frontend/.env.local
```

### 3. Docker Compose (Recommended for Dev)

```bash
docker-compose -f docker/docker-compose.yml up -d
```

This starts:
- PostgreSQL 16
- Redis 7
- FastAPI backend (auto-reload)
- Celery worker
- Nginx reverse proxy

### 4. Initialize Database

```bash
cd backend
alembic upgrade head
# Or use init script
python -c "from app.database import init_db; import asyncio; asyncio.run(init_db())"
```

### 5. Access Services

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000/api/v1 |
| API Docs | http://localhost:8000/docs |
| PostgreSQL | localhost:5432 |
| Redis | localhost:6379 |

## Production Deployment (Kubernetes)

### 1. Setup Kubernetes Cluster

```bash
# Using k3s (lightweight)
curl -sfL https://get.k3s.io | sh -

# Or using managed K8s (EKS/AKS/GKE)
# Follow cloud provider instructions
```

### 2. Create Namespace and Secrets

```bash
kubectl create namespace car-showroom

# Create secrets
kubectl create secret generic car-showroom-secrets \
  --namespace car-showroom \
  --from-literal=database-url="postgresql+asyncpg://user:password@postgres:5432/car_showroom" \
  --from-literal=redis-url="redis://redis:6379/0" \
  --from-literal=secret-key="your-256-bit-secret-key" \
  --from-literal=db-user="postgres" \
  --from-literal=db-password="your-db-password"
```

### 3. Deploy Infrastructure

```bash
kubectl apply -f kubernetes/infrastructure.yaml
```

### 4. Deploy Application

```bash
kubectl apply -f kubernetes/backend-deployment.yaml
kubectl apply -f kubernetes/frontend-deployment.yaml
```

### 5. Setup Ingress

```bash
# Install nginx-ingress controller
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm install ingress-nginx ingress-nginx/ingress-nginx

# Apply ingress rules
kubectl apply -f kubernetes/ingress.yaml
```

### 6. Setup HTTPS (Let's Encrypt)

```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.14.0/cert-manager.yaml

# Create ClusterIssuer
kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@uae-carshowroom.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

## CI/CD Pipeline

### GitHub Actions Setup

1. Add repository secrets in GitHub:
   - `DOCKER_REGISTRY`: ghcr.io
   - `KUBE_CONFIG`: Base64-encoded kubeconfig
   - `SENTRY_DSN`: Sentry DSN (optional)

2. Push to `main` branch triggers:
   - Run backend tests
   - Run frontend lint + build
   - Build and push Docker images
   - Deploy to Kubernetes

## Monitoring Setup

### Prometheus + Grafana

```bash
# Install kube-prometheus-stack
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack

# Access Grafana
kubectl port-forward service/prometheus-grafana 3000:80
# Default credentials: admin/prom-operator
```

### Logging (Loki + Promtail)

```bash
helm repo add grafana https://grafana.github.io/helm-charts
helm install loki grafana/loki-stack --set grafana.enabled=false
```

## Backup and Disaster Recovery

### Database Backup

```bash
# Manual backup
pg_dump -h localhost -U postgres car_showroom > backup_$(date +%Y%m%d).sql

# Automated (via cron job in K8s)
kubectl create cronjob db-backup \
  --schedule="0 */6 * * *" \
  --image=postgres:16-alpine \
  -- pg_dump -h postgres-service -U postgres car_showroom | gzip > /backups/db_$(date +%Y%m%d_%H%M%S).sql.gz
```

### File Backup (S3/MinIO)

```bash
# Sync to S3-compatible storage
aws s3 sync /data s3://car-showroom-backups/ --endpoint-url https://s3.me-central-1.amazonaws.com
```

## Scaling

### Horizontal Pod Autoscaling

```bash
kubectl autoscale deployment car-showroom-backend \
  --namespace car-showroom \
  --cpu-percent=70 \
  --min=3 \
  --max=10
```

### Database Read Replicas

```sql
-- Create read replica connection
CREATE SUBSCRIPTION sub_replica CONNECTION 'host=postgres-replica ...' PUBLICATION pub_main;
```

## Security Checklist

- [ ] Change all default passwords
- [ ] Enable MFA for admin accounts
- [ ] Configure WAF rules
- [ ] Enable audit logging
- [ ] Set up vulnerability scanning
- [ ] Configure network policies
- [ ] Enable TLS 1.3 only
- [ ] Set up secrets rotation
- [ ] Configure backup retention
- [ ] Review IAM roles and permissions

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| PostgreSQL connection refused | Check if service is running: `kubectl get pods -n car-showroom` |
| Redis connection error | Verify REDIS_URL in secrets |
| 401 Unauthorized | Check JWT token expiration, refresh token |
| 403 Forbidden | Verify user role permissions |
| Slow queries | Check PostgreSQL indexes, enable query logging |
| Image pull error | Verify Docker registry credentials |

### Logs

```bash
# Backend logs
kubectl logs -n car-showroom -l app=car-showroom,tier=backend

# Frontend logs
kubectl logs -n car-showroom -l app=car-showroom,tier=frontend

# PostgreSQL logs
kubectl logs -n car-showroom -l app=postgres
```

## Rollback Strategy

```bash
# Rollback to previous deployment
kubectl rollout undo deployment/car-showroom-backend -n car-showroom

# Rollback to specific revision
kubectl rollout undo deployment/car-showroom-backend -n car-showroom --to-revision=2
```
