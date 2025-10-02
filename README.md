# Minimal Node.js Microservices (Express only, NO security)

This is a **bare-minimum** setup using **only Express** (no Helmet, no CORS, no cookies, no JWT, no bcrypt).
It is intentionally insecure — for learning/experimenting only.

Services:
- **API Gateway** (serves static login page, proxies to other services)
- **Auth Service** (MySQL; stores **plaintext** passwords — do NOT use in prod)
- **Payments Service** (open stub endpoint; no auth)

## 1) Prerequisites (Windows)

- Node.js v20+
- MySQL 8+

## 2) MySQL Setup

```sql
CREATE DATABASE IF NOT EXISTS ims_auth CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ims_auth;
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_plain VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 3) Configure

Copy each `.env.example` → `.env` and update values if needed.

## 4) Install & Run (3 terminals)

### API Gateway
```powershell
cd api-gateway
npm install
npm run dev
```

### Auth Service
```powershell
cd auth-service
npm install
npm run dev
```

### Payments Service
```powershell
cd payments-service
npm install
npm run dev
```

Open http://localhost:4000

## 5) Try

- Click **Quick register demo user** on the page.
- Login with username `demo` and password `Passw0rd!`.
- Click **Test payment call** (no auth here; just a stub).
