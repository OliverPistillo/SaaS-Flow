# Do-Flow - SaaS Platform per PMI

## Panoramica

Do-Flow è una piattaforma SaaS completa progettata per ottimizzare la gestione finanziaria e delle risorse umane nelle piccole e medie imprese. Ispirata a PrimeFlow, l'applicazione combina analisi finanziarie avanzate con test attitudinali basati su intelligenza artificiale per fornire insights strategici e supportare la crescita aziendale.

### Caratteristiche Principali

**Modulo Finanziario**
- Dashboard finanziaria in tempo reale con visualizzazioni interattive
- Previsioni del flusso di cassa basate su algoritmi di machine learning
- Analisi automatica dei rischi finanziari e raccomandazioni strategiche
- Generazione automatica di report finanziari personalizzabili
- Monitoraggio KPI e metriche di performance aziendali

**Modulo Risorse Umane**
- Test attitudinali AI-powered personalizzati per ruolo e settore
- Valutazione delle competenze del team con scoring automatico
- Analisi delle dinamiche di team e identificazione skill gaps
- Insights personalizzati per lo sviluppo professionale
- Sistema di raccomandazioni per assunzioni e promozioni

**Analytics e Business Intelligence**
- Correlazioni cross-funzionali tra performance finanziarie e HR
- Previsioni predittive per crescita, spese e organico
- Generazione automatica di insights strategici
- Dashboard esecutiva con KPI aziendali consolidati
- Report personalizzabili con export in multiple formati

**Sicurezza e Compliance**
- Compliance GDPR completa con gestione consensi
- Crittografia end-to-end per dati sensibili
- Audit trail completo per tracciabilità
- Gestione diritti degli interessati (export, cancellazione, rettifica)
- Middleware di sicurezza avanzato con rate limiting

## Architettura Tecnica

### Stack Tecnologico

**Backend**
- **Runtime**: Node.js 20.x con Express.js framework
- **Database**: PostgreSQL 15+ con Sequelize ORM
- **Autenticazione**: JWT tokens con bcrypt per hashing password
- **Sicurezza**: Helmet, CORS, rate limiting, validazione input
- **AI/ML**: Servizi proprietari per analisi predittive e test attitudinali

**Frontend**
- **Framework**: React 18+ con TypeScript support
- **Routing**: React Router DOM per navigazione SPA
- **UI Components**: shadcn/ui con Tailwind CSS per styling
- **Charts**: Recharts per visualizzazioni dati interattive
- **State Management**: Context API per gestione stato globale

**Infrastructure**
- **Containerization**: Docker e Docker Compose per sviluppo e deployment
- **Reverse Proxy**: Nginx per load balancing e SSL termination
- **Monitoring**: Prometheus e Grafana per metriche e alerting
- **CI/CD**: GitHub Actions per automazione deployment

### Architettura dei Servizi

L'applicazione segue un'architettura modulare con separazione chiara delle responsabilità:

**Livello API**
- Controller RESTful per gestione richieste HTTP
- Middleware per autenticazione, autorizzazione e audit
- Validazione input e sanitizzazione dati
- Rate limiting e protezione DDoS

**Livello Business Logic**
- Servizi specializzati per dominio (Financial, HR, Analytics)
- Motori AI per predizioni e valutazioni
- Gestione workflow e processi aziendali
- Integrazione con servizi esterni

**Livello Dati**
- Modelli Sequelize per ORM e migrazioni
- Servizi di crittografia per dati sensibili
- Gestione backup e recovery
- Ottimizzazioni query e indicizzazione

## Requisiti di Sistema

### Ambiente di Sviluppo

**Software Richiesto**
- Node.js 20.x o superiore
- PostgreSQL 15+ 
- Docker e Docker Compose
- Git per version control
- Editor con supporto TypeScript/JavaScript

**Dipendenze Backend**
- express: Framework web per Node.js
- sequelize: ORM per PostgreSQL
- jsonwebtoken: Gestione autenticazione JWT
- bcryptjs: Hashing sicuro password
- helmet: Security headers HTTP
- cors: Cross-Origin Resource Sharing
- express-rate-limit: Rate limiting middleware
- express-validator: Validazione e sanitizzazione input

**Dipendenze Frontend**
- react: Libreria UI componenti
- react-router-dom: Routing client-side
- tailwindcss: Framework CSS utility-first
- recharts: Libreria charting per React
- lucide-react: Icone SVG ottimizzate

### Ambiente di Produzione

**Requisiti Hardware Minimi**
- CPU: 2 vCPU (4 vCPU raccomandati)
- RAM: 4GB (8GB raccomandati)
- Storage: 50GB SSD (100GB raccomandati)
- Network: 100Mbps bandwidth

**Requisiti Software**
- Sistema Operativo: Ubuntu 22.04 LTS o CentOS 8+
- Docker Engine 24.x o superiore
- Docker Compose v2.x
- Nginx per reverse proxy
- SSL/TLS certificati (Let's Encrypt raccomandato)

## Installazione e Setup

### Setup Ambiente di Sviluppo

**1. Clone del Repository**
```bash
git clone https://github.com/your-org/do-flow.git
cd do-flow
```

**2. Configurazione Backend**
```bash
cd backend
npm install
cp .env.example .env
# Modifica .env con le tue configurazioni
```

**3. Setup Database**
```bash
# Avvia PostgreSQL con Docker
docker run --name do-flow-db -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15

# Inizializza database
npm run init-db
npm run seed
```

**4. Avvio Backend**
```bash
npm run dev
# Server disponibile su http://localhost:3001
```

**5. Configurazione Frontend**
```bash
cd ../frontend/do-flow-frontend
npm install
# Modifica src/services/apiService.js se necessario
```

**6. Avvio Frontend**
```bash
npm run dev
# Applicazione disponibile su http://localhost:3000
```

### Setup con Docker Compose

Per un setup rapido dell'intero stack:

```bash
# Dalla root del progetto
docker-compose up -d

# Verifica che tutti i servizi siano attivi
docker-compose ps

# Visualizza logs
docker-compose logs -f
```

Questo comando avvierà:
- Database PostgreSQL sulla porta 5432
- Backend API sulla porta 3001  
- Frontend React sulla porta 3000
- Nginx reverse proxy sulla porta 80

## Configurazione

### Variabili d'Ambiente Backend

Il file `.env` nel backend deve contenere le seguenti configurazioni:

```env
# Server Configuration
NODE_ENV=development
PORT=3001
HOST=0.0.0.0

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=do_flow
DB_USER=postgres
DB_PASSWORD=password
DB_SSL=false

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
BCRYPT_ROUNDS=12

# Security
ENCRYPTION_KEY=your-32-character-encryption-key
SESSION_SECRET=your-session-secret-key
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX=5

# GDPR Compliance
GDPR_RETENTION_DAYS=2555
AUDIT_LOG_RETENTION_DAYS=3650
CONSENT_VERSION=1.0

# External Services (se applicabile)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Monitoring
LOG_LEVEL=info
ENABLE_METRICS=true
METRICS_PORT=9090
```

### Configurazione Frontend

Il frontend utilizza variabili d'ambiente per la configurazione:

```env
# API Configuration
VITE_API_URL=http://localhost:3001/api/v1
VITE_APP_NAME=Do-Flow
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEMO_MODE=true
VITE_ENABLE_DEBUG=false

# External Services
VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
VITE_SENTRY_DSN=your-sentry-dsn
```

## Deployment

### Deployment con Docker

**1. Build delle Immagini**
```bash
# Build backend
docker build -t do-flow-backend ./backend

# Build frontend  
docker build -t do-flow-frontend ./frontend/do-flow-frontend
```

**2. Deploy con Docker Compose**
```bash
# Deploy in produzione
docker-compose -f docker-compose.prod.yml up -d

# Verifica deployment
docker-compose -f docker-compose.prod.yml ps
```

### Deployment su AWS

**1. Preparazione Infrastruttura**
```bash
# Installa Terraform
curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
sudo apt-get update && sudo apt-get install terraform

# Deploy infrastruttura
cd infrastructure/terraform
terraform init
terraform plan
terraform apply
```

**2. Deploy Applicazione**
```bash
# Build e push immagini su ECR
aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin your-account.dkr.ecr.eu-west-1.amazonaws.com

docker tag do-flow-backend:latest your-account.dkr.ecr.eu-west-1.amazonaws.com/do-flow-backend:latest
docker push your-account.dkr.ecr.eu-west-1.amazonaws.com/do-flow-backend:latest

docker tag do-flow-frontend:latest your-account.dkr.ecr.eu-west-1.amazonaws.com/do-flow-frontend:latest  
docker push your-account.dkr.ecr.eu-west-1.amazonaws.com/do-flow-frontend:latest

# Deploy su ECS
aws ecs update-service --cluster do-flow-cluster --service do-flow-backend --force-new-deployment
aws ecs update-service --cluster do-flow-cluster --service do-flow-frontend --force-new-deployment
```

### Deployment su DigitalOcean

**1. Setup Droplet**
```bash
# Crea droplet Ubuntu 22.04
doctl compute droplet create do-flow-prod \
  --size s-2vcpu-4gb \
  --image ubuntu-22-04-x64 \
  --region fra1 \
  --ssh-keys your-ssh-key-id

# Connetti al droplet
ssh root@your-droplet-ip
```

**2. Installazione Docker**
```bash
# Installa Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Installa Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

**3. Deploy Applicazione**
```bash
# Clone repository
git clone https://github.com/your-org/do-flow.git
cd do-flow

# Configura environment
cp .env.example .env.production
# Modifica .env.production con configurazioni di produzione

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

## Monitoraggio e Manutenzione

### Logging

L'applicazione implementa un sistema di logging strutturato su più livelli:

**Backend Logging**
- **Audit Logs**: Tracciamento completo delle azioni utente per compliance GDPR
- **Security Logs**: Monitoraggio tentativi di accesso e attività sospette  
- **Application Logs**: Errori applicativi e performance metrics
- **Database Logs**: Query lente e errori di connessione

**Frontend Logging**
- **Error Tracking**: Cattura errori JavaScript e React
- **User Analytics**: Tracciamento interazioni utente (anonimizzato)
- **Performance Metrics**: Core Web Vitals e metriche di caricamento

### Metriche e Monitoring

**Prometheus Metrics**
```yaml
# Metriche esposte dall'applicazione
- http_requests_total: Contatore richieste HTTP per endpoint
- http_request_duration_seconds: Durata richieste HTTP
- database_connections_active: Connessioni database attive
- user_sessions_active: Sessioni utente attive
- ai_predictions_total: Predizioni AI generate
- gdpr_requests_total: Richieste GDPR processate
```

**Grafana Dashboards**
- **Application Overview**: Metriche generali applicazione
- **Financial Module**: KPI specifici modulo finanziario
- **HR Module**: Metriche test attitudinali e valutazioni
- **Security Dashboard**: Eventi sicurezza e compliance
- **Infrastructure**: Metriche sistema e database

### Backup e Recovery

**Database Backup**
```bash
# Backup automatico giornaliero
0 2 * * * /usr/local/bin/backup-db.sh

# Script backup
#!/bin/bash
BACKUP_DIR="/backups/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h localhost -U postgres do_flow > $BACKUP_DIR/do_flow_$DATE.sql
gzip $BACKUP_DIR/do_flow_$DATE.sql

# Mantieni solo backup ultimi 30 giorni
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
```

**Application Backup**
```bash
# Backup configurazioni e logs
tar -czf /backups/app/do_flow_config_$DATE.tar.gz \
  /opt/do-flow/.env \
  /opt/do-flow/logs \
  /opt/do-flow/uploads
```

**Recovery Procedure**
```bash
# Restore database
gunzip -c /backups/postgresql/do_flow_YYYYMMDD_HHMMSS.sql.gz | psql -h localhost -U postgres do_flow

# Restore applicazione
tar -xzf /backups/app/do_flow_config_YYYYMMDD_HHMMSS.tar.gz -C /

# Restart servizi
docker-compose restart
```

## Sicurezza

### Autenticazione e Autorizzazione

**JWT Implementation**
- Token JWT con scadenza configurabile (default 24h)
- Refresh token per rinnovo automatico sessioni
- Blacklist token per logout sicuro
- Rate limiting su endpoint di autenticazione

**Role-Based Access Control**
```javascript
// Ruoli disponibili
const ROLES = {
  ADMIN: 'admin',           // Accesso completo sistema
  MANAGER: 'manager',       // Gestione team e report
  USER: 'user',            // Accesso base dashboard
  VIEWER: 'viewer'         // Solo lettura
};

// Permessi per endpoint
const PERMISSIONS = {
  'GET /api/v1/financial': ['admin', 'manager', 'user'],
  'POST /api/v1/financial': ['admin', 'manager'],
  'DELETE /api/v1/users': ['admin'],
  'GET /api/v1/analytics': ['admin', 'manager']
};
```

### Protezione Dati

**Crittografia**
- AES-256-GCM per dati sensibili a riposo
- TLS 1.3 per dati in transito
- Hashing bcrypt per password (12 rounds)
- Chiavi di crittografia gestite tramite environment variables

**Data Sanitization**
- Validazione input con express-validator
- Sanitizzazione XSS su tutti i campi testo
- Protezione SQL injection tramite ORM parametrizzato
- Rate limiting per prevenire attacchi brute force

### Compliance GDPR

**Diritti degli Interessati**
- **Accesso**: Export completo dati personali in formato JSON
- **Rettifica**: Modifica dati personali con audit trail
- **Cancellazione**: Eliminazione sicura con possibilità di retention legale
- **Portabilità**: Export dati in formato machine-readable

**Gestione Consensi**
```javascript
// Tipi di consenso tracciati
const CONSENT_TYPES = {
  MARKETING: 'marketing_communications',
  ANALYTICS: 'analytics_tracking', 
  PROFILING: 'automated_profiling',
  DATA_PROCESSING: 'data_processing'
};

// Audit trail consensi
const consentRecord = {
  userId: 'user_123',
  consentType: 'marketing_communications',
  granted: true,
  timestamp: '2024-06-08T10:00:00Z',
  ipAddress: '192.168.1.100',
  userAgent: 'Mozilla/5.0...',
  version: '1.0'
};
```

## API Reference

### Autenticazione

**POST /api/v1/auth/register**
```json
{
  "firstName": "Mario",
  "lastName": "Rossi", 
  "email": "mario.rossi@esempio.com",
  "password": "SecurePass123!",
  "companyName": "Esempio SRL",
  "industry": "Tecnologia"
}
```

**POST /api/v1/auth/login**
```json
{
  "email": "mario.rossi@esempio.com",
  "password": "SecurePass123!"
}
```

**Response**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "firstName": "Mario",
    "lastName": "Rossi",
    "email": "mario.rossi@esempio.com",
    "role": "user",
    "company": {
      "id": 1,
      "name": "Esempio SRL",
      "industry": "Tecnologia"
    }
  }
}
```

### Modulo Finanziario

**GET /api/v1/financial/dashboard**
```json
{
  "summary": {
    "totalRevenue": 285000,
    "totalExpenses": 195000,
    "netProfit": 90000,
    "profitMargin": 31.6,
    "revenueGrowth": 12.5
  },
  "trends": {
    "revenue": {
      "direction": "up",
      "strength": 0.125,
      "volatility": 0.08
    }
  },
  "predictions": {
    "predictions": [
      {
        "month": 1,
        "revenue": 67500,
        "confidence": 0.85
      }
    ]
  }
}
```

**POST /api/v1/financial/data**
```json
{
  "date": "2024-06-01",
  "revenue": 55000,
  "expenses": 38000,
  "category": "Vendite Online",
  "description": "Ricavi mensili e-commerce"
}
```

### Modulo HR

**POST /api/v1/hr/assessments**
```json
{
  "role": "developer",
  "difficulty": "medium",
  "customizations": {
    "focusAreas": ["technical", "logical"]
  }
}
```

**Response**
```json
{
  "id": "test_1717840800_abc123def",
  "role": "developer",
  "difficulty": "medium",
  "questions": [
    {
      "id": "log_001",
      "category": "logical",
      "text": "Se A > B e B > C, quale delle seguenti affermazioni è vera?",
      "options": ["A < C", "A > C", "A = C", "Non si può determinare"],
      "correct": 1
    }
  ],
  "timeLimit": 1800,
  "createdAt": "2024-06-08T10:00:00Z"
}
```

**POST /api/v1/hr/assessments/{testId}/evaluate**
```json
{
  "answers": [
    {
      "questionId": "log_001",
      "selectedOption": 1
    }
  ],
  "candidateInfo": {
    "firstName": "Laura",
    "lastName": "Bianchi",
    "email": "laura.bianchi@esempio.com"
  }
}
```

### Analytics

**GET /api/v1/analytics/overview**
```json
{
  "financial": {
    "revenue": 285000,
    "profit": 90000,
    "margin": 31.6,
    "growth": 12.5
  },
  "hr": {
    "employees": 24,
    "performance": 82.4,
    "coverage": 75
  },
  "insights": [
    {
      "type": "positive",
      "category": "productivity",
      "title": "Alta produttività per dipendente",
      "description": "Profitto per dipendente: €3.750",
      "impact": "high"
    }
  ]
}
```

**GET /api/v1/analytics/predictions**
```json
{
  "type": "revenue",
  "period": 6,
  "predictions": [
    {
      "month": 1,
      "value": 67500,
      "confidence": 0.85
    }
  ],
  "methodology": "Machine learning basato su dati storici e trend stagionali"
}
```

## Troubleshooting

### Problemi Comuni

**1. Errore Connessione Database**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Soluzione:**
- Verifica che PostgreSQL sia in esecuzione
- Controlla configurazioni in .env
- Verifica firewall e porte aperte

**2. Errore CORS Frontend**
```
Access to fetch at 'http://localhost:3001' from origin 'http://localhost:3000' has been blocked by CORS policy
```
**Soluzione:**
- Verifica CORS_ORIGIN in .env backend
- Controlla configurazione corsOptions in security middleware

**3. Token JWT Scaduto**
```
Error: jwt expired
```
**Soluzione:**
- Implementa refresh token logic
- Aumenta JWT_EXPIRES_IN se necessario
- Gestisci logout automatico nel frontend

**4. Rate Limit Raggiunto**
```
Error: Too many requests, please try again later
```
**Soluzione:**
- Attendi il reset del rate limit
- Configura limiti più alti se necessario
- Implementa retry logic nel frontend

### Debug e Diagnostica

**Abilitazione Debug Mode**
```bash
# Backend
DEBUG=do-flow:* npm run dev

# Frontend  
VITE_ENABLE_DEBUG=true npm run dev
```

**Controllo Logs**
```bash
# Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend

# System logs
tail -f /var/log/do-flow/application.log
tail -f /var/log/do-flow/security.log
```

**Health Checks**
```bash
# Backend health
curl http://localhost:3001/api/v1/health

# Database connectivity
curl http://localhost:3001/api/v1/health/db

# Frontend build
curl http://localhost:3000/health
```

## Contribuzione

### Setup Ambiente di Sviluppo

**1. Fork del Repository**
```bash
git clone https://github.com/your-username/do-flow.git
cd do-flow
git remote add upstream https://github.com/original-org/do-flow.git
```

**2. Creazione Branch Feature**
```bash
git checkout -b feature/nome-feature
git push -u origin feature/nome-feature
```

**3. Commit Guidelines**
```bash
# Formato commit
type(scope): description

# Esempi
feat(auth): add JWT refresh token support
fix(financial): resolve cash flow prediction accuracy
docs(api): update authentication endpoints
test(hr): add unit tests for assessment evaluation
```

### Code Style

**Backend (Node.js)**
- ESLint con configurazione Airbnb
- Prettier per formatting automatico
- JSDoc per documentazione funzioni
- Test coverage minimo 80%

**Frontend (React)**
- ESLint con regole React/TypeScript
- Prettier con configurazione Tailwind
- Componenti funzionali con hooks
- PropTypes o TypeScript per type checking

### Testing

**Backend Testing**
```bash
# Unit tests
npm run test

# Integration tests  
npm run test:integration

# Coverage report
npm run test:coverage
```

**Frontend Testing**
```bash
# Component tests
npm run test

# E2E tests
npm run test:e2e

# Visual regression tests
npm run test:visual
```

## Licenza

Questo progetto è rilasciato sotto licenza MIT. Vedi il file [LICENSE](LICENSE) per i dettagli completi.

## Supporto

Per supporto tecnico e domande:

- **Email**: support@do-flow.com
- **Documentation**: https://docs.do-flow.com
- **GitHub Issues**: https://github.com/your-org/do-flow/issues
- **Discord Community**: https://discord.gg/do-flow

## Changelog

### v1.0.0 (2024-06-08)
- Rilascio iniziale con moduli Financial e HR
- Implementazione AI per predizioni e test attitudinali
- Dashboard React con visualizzazioni interattive
- Compliance GDPR completa
- Sistema di sicurezza avanzato
- Documentazione completa e setup Docker

---

**Sviluppato con ❤️ dal team Do-Flow**

