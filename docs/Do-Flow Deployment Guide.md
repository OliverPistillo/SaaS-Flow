# Do-Flow Deployment Guide

## Panoramica

Questa guida fornisce istruzioni dettagliate per il deployment di Do-Flow in diversi ambienti, dalla configurazione locale allo sviluppo fino al deployment in produzione su cloud provider.

## Prerequisiti

### Software Richiesto

**Ambiente di Sviluppo:**
- Docker Engine 24.0+ e Docker Compose v2.0+
- Node.js 20.x per sviluppo locale
- PostgreSQL 15+ per database locale
- Git per version control

**Ambiente di Produzione:**
- Server Linux (Ubuntu 22.04 LTS raccomandato)
- Docker Engine e Docker Compose
- Nginx per reverse proxy (se non usando container)
- SSL/TLS certificati
- Dominio configurato con DNS

### Configurazione Iniziale

**1. Clone del Repository**
```bash
git clone https://github.com/your-org/do-flow.git
cd do-flow
```

**2. Configurazione Environment Variables**
```bash
# Copia template environment
cp .env.example .env.development
cp .env.example .env.production

# Modifica i file con le tue configurazioni
nano .env.development
nano .env.production
```

## Deployment Locale per Sviluppo

### Setup Rapido con Docker Compose

**1. Avvio Stack Completo**
```bash
# Avvia tutti i servizi
docker-compose up -d

# Verifica stato servizi
docker-compose ps

# Visualizza logs
docker-compose logs -f
```

**2. Inizializzazione Database**
```bash
# Esegui migrazioni
docker-compose exec backend npm run migrate

# Carica dati di esempio
docker-compose exec backend npm run seed
```

**3. Accesso Applicazione**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Database: localhost:5432
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3003

### Setup Sviluppo Nativo

**1. Database PostgreSQL**
```bash
# Installa PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Crea database
sudo -u postgres createdb do_flow
sudo -u postgres createuser --interactive
```

**2. Backend Setup**
```bash
cd backend
npm install
npm run migrate
npm run seed
npm run dev
```

**3. Frontend Setup**
```bash
cd frontend/do-flow-frontend
npm install
npm run dev
```

## Deployment Produzione

### Preparazione Ambiente

**1. Server Setup**
```bash
# Aggiorna sistema
sudo apt update && sudo apt upgrade -y

# Installa Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Installa Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

**2. Configurazione Firewall**
```bash
# Configura UFW
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

**3. Configurazione SSL**
```bash
# Installa Certbot
sudo apt install certbot

# Ottieni certificati SSL
sudo certbot certonly --standalone -d yourdomain.com -d api.yourdomain.com
```

### Deployment con Docker Compose

**1. Configurazione Environment**
```bash
# Crea file environment produzione
cat > .env.production << EOF
# Database
DB_NAME=do_flow_prod
DB_USER=doflow_user
DB_PASSWORD=secure_random_password_here

# Security
JWT_SECRET=super_secure_jwt_secret_64_chars_minimum_length_required_here
ENCRYPTION_KEY=32_character_encryption_key_here
REDIS_PASSWORD=secure_redis_password

# Domain
DOMAIN=yourdomain.com
API_URL=https://api.yourdomain.com/api/v1
CORS_ORIGIN=https://yourdomain.com

# SSL
SSL_EMAIL=admin@yourdomain.com

# Monitoring
GRAFANA_PASSWORD=secure_grafana_password

# Logging
LOG_LEVEL=warn
EOF
```

**2. Build Immagini**
```bash
# Build backend
docker build -t do-flow-backend:latest ./backend

# Build frontend
docker build -t do-flow-frontend:latest ./frontend/do-flow-frontend
```

**3. Deploy Produzione**
```bash
# Avvia stack produzione
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d

# Verifica deployment
docker-compose -f docker-compose.prod.yml ps
```

**4. Configurazione Nginx**
```bash
# Crea configurazione Nginx
mkdir -p nginx/conf.d
cat > nginx/conf.d/do-flow.conf << EOF
upstream backend {
    server backend:3001;
}

upstream frontend {
    server frontend:3000;
}

server {
    listen 80;
    server_name yourdomain.com api.yourdomain.com;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://frontend;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://backend;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
```

## Deployment Cloud

### AWS Deployment

**1. Preparazione Infrastruttura**
```bash
# Installa AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configura credenziali
aws configure
```

**2. Setup ECR Repository**
```bash
# Crea repository ECR
aws ecr create-repository --repository-name do-flow-backend --region eu-west-1
aws ecr create-repository --repository-name do-flow-frontend --region eu-west-1

# Login ECR
aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT.dkr.ecr.eu-west-1.amazonaws.com
```

**3. Build e Push Immagini**
```bash
# Tag e push backend
docker tag do-flow-backend:latest YOUR_ACCOUNT.dkr.ecr.eu-west-1.amazonaws.com/do-flow-backend:latest
docker push YOUR_ACCOUNT.dkr.ecr.eu-west-1.amazonaws.com/do-flow-backend:latest

# Tag e push frontend
docker tag do-flow-frontend:latest YOUR_ACCOUNT.dkr.ecr.eu-west-1.amazonaws.com/do-flow-frontend:latest
docker push YOUR_ACCOUNT.dkr.ecr.eu-west-1.amazonaws.com/do-flow-frontend:latest
```

**4. Deploy su ECS**
```bash
# Crea cluster ECS
aws ecs create-cluster --cluster-name do-flow-cluster

# Crea task definition
aws ecs register-task-definition --cli-input-json file://aws/task-definition.json

# Crea servizio
aws ecs create-service --cluster do-flow-cluster --service-name do-flow-backend --task-definition do-flow-backend:1 --desired-count 2
```

### DigitalOcean Deployment

**1. Crea Droplet**
```bash
# Installa doctl
curl -sL https://github.com/digitalocean/doctl/releases/download/v1.94.0/doctl-1.94.0-linux-amd64.tar.gz | tar -xzv
sudo mv doctl /usr/local/bin

# Autentica
doctl auth init

# Crea droplet
doctl compute droplet create do-flow-prod \
  --size s-4vcpu-8gb \
  --image ubuntu-22-04-x64 \
  --region fra1 \
  --ssh-keys YOUR_SSH_KEY_ID \
  --enable-monitoring \
  --enable-backups
```

**2. Setup Droplet**
```bash
# Connetti al droplet
ssh root@DROPLET_IP

# Installa Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Clone repository
git clone https://github.com/your-org/do-flow.git
cd do-flow

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

### Google Cloud Platform

**1. Setup GCP**
```bash
# Installa gcloud CLI
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init

# Abilita servizi
gcloud services enable container.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

**2. Build con Cloud Build**
```bash
# Submit build
gcloud builds submit --config cloudbuild.yaml .
```

**3. Deploy su GKE**
```bash
# Crea cluster
gcloud container clusters create do-flow-cluster \
  --num-nodes=3 \
  --zone=europe-west1-b

# Deploy applicazione
kubectl apply -f k8s/
```

## Monitoraggio e Manutenzione

### Setup Monitoraggio

**1. Configurazione Prometheus**
```yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'do-flow-backend'
    static_configs:
      - targets: ['backend:3001']
    metrics_path: '/metrics'

  - job_name: 'do-flow-nginx'
    static_configs:
      - targets: ['nginx:9113']

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']
```

**2. Dashboard Grafana**
```bash
# Import dashboard predefiniti
curl -X POST \
  http://admin:admin@localhost:3003/api/dashboards/db \
  -H 'Content-Type: application/json' \
  -d @monitoring/grafana/dashboards/do-flow-overview.json
```

### Backup e Recovery

**1. Script Backup Automatico**
```bash
#!/bin/bash
# scripts/backup.sh

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Database backup
docker-compose exec -T database pg_dump -U postgres do_flow | gzip > $BACKUP_DIR/db_backup_$DATE.sql.gz

# Application data backup
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz \
  backend/uploads \
  backend/logs \
  .env.production

# Upload to S3 (optional)
aws s3 cp $BACKUP_DIR/db_backup_$DATE.sql.gz s3://do-flow-backups/
aws s3 cp $BACKUP_DIR/app_backup_$DATE.tar.gz s3://do-flow-backups/

# Cleanup old backups (keep last 30 days)
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete
```

**2. Cron Job Setup**
```bash
# Aggiungi a crontab
0 2 * * * /opt/do-flow/scripts/backup.sh >> /var/log/backup.log 2>&1
```

### Aggiornamenti

**1. Rolling Update**
```bash
# Build nuove immagini
docker build -t do-flow-backend:v1.1.0 ./backend
docker build -t do-flow-frontend:v1.1.0 ./frontend/do-flow-frontend

# Update docker-compose
sed -i 's/do-flow-backend:latest/do-flow-backend:v1.1.0/g' docker-compose.prod.yml
sed -i 's/do-flow-frontend:latest/do-flow-frontend:v1.1.0/g' docker-compose.prod.yml

# Deploy update
docker-compose -f docker-compose.prod.yml up -d --no-deps backend frontend
```

**2. Database Migration**
```bash
# Esegui migrazioni
docker-compose exec backend npm run migrate

# Verifica stato
docker-compose exec backend npm run migrate:status
```

## Troubleshooting

### Problemi Comuni

**1. Container non si avvia**
```bash
# Controlla logs
docker-compose logs backend
docker-compose logs frontend

# Verifica configurazione
docker-compose config

# Restart servizio
docker-compose restart backend
```

**2. Problemi Database**
```bash
# Controlla connessione
docker-compose exec backend npm run db:test

# Reset database (ATTENZIONE: cancella tutti i dati)
docker-compose down -v
docker-compose up -d database
docker-compose exec backend npm run migrate
```

**3. Problemi SSL**
```bash
# Rinnova certificati
docker-compose run --rm certbot renew

# Test configurazione SSL
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com
```

### Performance Tuning

**1. Database Optimization**
```sql
-- Ottimizzazioni PostgreSQL
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
SELECT pg_reload_conf();
```

**2. Nginx Optimization**
```nginx
# nginx/nginx.conf
worker_processes auto;
worker_connections 1024;

http {
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
}
```

**3. Node.js Optimization**
```javascript
// backend/server.js
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  // Start server
  app.listen(PORT);
}
```

## Sicurezza

### Hardening Checklist

**1. Sistema Operativo**
- [ ] Aggiornamenti automatici abilitati
- [ ] Firewall configurato (UFW/iptables)
- [ ] SSH key-based authentication
- [ ] Fail2ban installato e configurato
- [ ] User non-root per applicazioni

**2. Docker Security**
- [ ] Immagini da registry ufficiali
- [ ] User non-root nei container
- [ ] Secrets gestiti tramite Docker secrets
- [ ] Network isolation configurata
- [ ] Resource limits impostati

**3. Applicazione**
- [ ] HTTPS obbligatorio
- [ ] Security headers configurati
- [ ] Rate limiting attivo
- [ ] Input validation implementata
- [ ] Audit logging abilitato

**4. Database**
- [ ] Password complesse
- [ ] Connessioni SSL/TLS
- [ ] Backup crittografati
- [ ] Accesso limitato per IP
- [ ] Query logging abilitato

### Monitoring Sicurezza

**1. Log Analysis**
```bash
# Analizza tentativi di accesso
grep "Failed password" /var/log/auth.log

# Monitora errori applicazione
docker-compose logs backend | grep ERROR

# Controlla connessioni database
docker-compose exec database psql -U postgres -c "SELECT * FROM pg_stat_activity;"
```

**2. Automated Security Scanning**
```bash
# Scan vulnerabilità immagini Docker
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image do-flow-backend:latest

# Scan dipendenze Node.js
npm audit
npm audit fix
```

Questa guida fornisce una base solida per il deployment di Do-Flow in diversi ambienti. Adatta le configurazioni alle tue specifiche esigenze di sicurezza e performance.

