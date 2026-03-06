# Production CI/CD Pipeline with Jenkins (Groovy)

## Overview

This repository demonstrates a **production-grade CI/CD pipeline implemented using Jenkins (Groovy Declarative Pipeline)** for deploying a **Node.js backend** and a **Next.js frontend** application.

The pipeline automates the full software delivery lifecycle including:

- Dependency installation
- Testing
- Static code analysis
- Security vulnerability scanning
- Docker image building
- Container security scanning
- Artifact publishing
- Application deployment
- Health checks

The pipeline follows modern **DevOps best practices** including security gates, immutable artifacts, and automated deployments.

---

# Architecture

Developer → Git Repository  
↓  
Jenkins CI/CD Pipeline  
↓  
Build + Test + Security Scan  
↓  
Docker Image Build  
↓  
Container Vulnerability Scan (Trivy)  
↓  
Push Image to Container Registry  
↓  
Deploy Containers  
↓  
Health Check

---

# Project Structure

```
enterprise-devops-pipeline
│
├── backend
│   ├── src/app.js
│   ├── package.json
│   ├── package-lock.json
│   └── Dockerfile
│
├── frontend
│   ├── pages/index.js
│   ├── package.json
│   └── Dockerfile
│
├── Jenkinsfile
└── README.md
```

---

# Backend

The backend service is a **Node.js Express API**.

Features:
- REST API
- Health check endpoint `/health`
- Security middleware using Helmet
- Logging using Morgan

Run locally:

```
cd backend
npm install
npm start
```

The backend runs on:

```
http://localhost:3000
```

---

# Frontend

The frontend is a **Next.js web application**.

Run locally:

```
cd frontend
npm install
npm run dev
```

The frontend runs on:

```
http://localhost:3000
```

---

# Docker Images

Both services are containerized using **Docker**.

### Backend Container

Uses:
- multi-stage build
- minimal runtime image
- Node.js 20

### Frontend Container

Builds the Next.js application and runs the production server.

Build locally:

```
docker build -t backend ./backend
docker build -t frontend ./frontend
```

---

# Jenkins CI/CD Pipeline

The pipeline is defined in the **Jenkinsfile** using **Declarative Groovy syntax**.

## Pipeline Stages

### 1. Checkout
Clones the source code from the Git repository.

### 2. Install Dependencies
Runs `npm ci` for both frontend and backend to install locked dependencies.

### 3. Unit Tests
Runs test scripts for both services.

### 4. Static Code Analysis
Runs ESLint to detect code quality issues.

### 5. Dependency Security Scan
Uses `npm audit` to detect vulnerable dependencies.

The pipeline fails if **HIGH severity vulnerabilities** are detected.

### 6. Build Docker Images
Creates Docker images for:
- Backend API
- Frontend Web App

### 7. Container Security Scan
Uses **Trivy** to scan images for vulnerabilities.

The pipeline fails if **HIGH or CRITICAL vulnerabilities** are detected.

### 8. Push Images to Registry
Pushes images to the configured container registry.

### 9. Deployment
Deploys the application containers using Docker.

### 10. Health Check
Verifies that the backend service is running correctly by calling:

```
/health
```

---

# Security Practices

This pipeline implements several security best practices:

- Dependency vulnerability scanning (`npm audit`)
- Container image scanning (`Trivy`)
- Minimal container images
- Immutable artifacts
- Automated security gates

---

# Environment Variables

The pipeline uses the following variables:

| Variable | Description |
|--------|-------------|
| REGISTRY | Docker container registry |
| BACKEND_IMAGE | Backend image name |
| FRONTEND_IMAGE | Frontend image name |
| VERSION | Image version tag |

---

# Running Jenkins Pipeline

1. Install Jenkins
2. Install required plugins:
   - Docker Pipeline
   - Git
   - Pipeline
3. Create Jenkins Pipeline job
4. Connect repository
5. Run pipeline

---

# Health Check

After deployment, Jenkins verifies the backend service using:

```
curl http://localhost:3000/health
```

If the health check fails, the pipeline fails.

---

# DevOps Best Practices Implemented

- Immutable container images
- Automated CI/CD pipeline
- Security vulnerability scanning
- Parallel pipeline stages
- Infrastructure automation
- Health monitoring

---

# Future Improvements

Potential enhancements for production environments:

- Kubernetes deployment
- Blue-Green deployment strategy
- Canary deployments
- Helm charts
- Monitoring with Prometheus and Grafana
- Centralized logging with ELK stack

---

# Conclusion

This repository demonstrates a **secure and production-ready CI/CD pipeline using Jenkins**, supporting modern DevOps workflows for building, testing, securing, and deploying microservices.