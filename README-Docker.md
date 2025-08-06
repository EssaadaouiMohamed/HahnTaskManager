# Hahn Task Manager - Docker Setup

This document provides instructions for running the Hahn Task Manager application using Docker and Docker Compose.

## Prerequisites

- Docker Desktop installed and running
- At least 4GB of available RAM
- At least 10GB of available disk space

## Quick Start

### Production Environment

To run the application in production mode:

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up --build -d
```

### Development Environment

To run the application in development mode with hot reloading:

```bash
# Build and start all services with development configuration
docker-compose -f docker-compose.dev.yml up --build

# Or run in detached mode
docker-compose -f docker-compose.dev.yml up --build -d
```

## Services

The application consists of the following services:

### 1. SQL Server Database
- **Port**: 1433
- **Username**: sa
- **Password**: Admin@123
- **Database**: HahnTaskManager
- **Health Check**: Enabled

### 2. .NET API
- **HTTP Port**: 5000
- **HTTPS Port**: 5001
- **Environment**: Development/Production
- **Features**: 
  - JWT Authentication
  - Entity Framework with SQL Server
  - Swagger/OpenAPI documentation
  - CORS enabled

### 3. Angular Client
- **Port**: 4200 (dev) / 80 (prod)
- **Features**:
  - Modern Angular 18 application
  - Responsive UI
  - JWT token management
  - Task management interface

## Access Points

Once the services are running, you can access:

- **Angular Application**: http://localhost:4200 (dev) or http://localhost (prod)
- **API Documentation**: https://localhost:5001/swagger
- **API Endpoints**: https://localhost:5001/api
- **Database**: localhost:1433 (using SQL Server Management Studio or Azure Data Studio)

## Development Features

### Hot Reloading
- **API**: Changes to C# files will automatically restart the API
- **Client**: Changes to Angular files will automatically reload the browser

### Volume Mounts
- Source code is mounted as volumes for real-time development
- Node modules and build artifacts are excluded from mounts

## Environment Variables

### API Configuration
- `ASPNETCORE_ENVIRONMENT`: Development/Production
- `ConnectionStrings__DefaultConnection`: SQL Server connection string
- `Jwt__Key`: JWT signing key
- `Jwt__Issuer`: JWT issuer
- `Jwt__Audience`: JWT audience

### Database Configuration
- `SA_PASSWORD`: SQL Server SA password
- `ACCEPT_EULA`: SQL Server license acceptance
- `MSSQL_PID`: SQL Server edition

## Useful Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f client
docker-compose logs -f sql-server
```

### Stop Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Rebuild Services
```bash
# Rebuild specific service
docker-compose build api
docker-compose build client

# Rebuild all services
docker-compose build --no-cache
```

### Database Operations
```bash
# Access SQL Server container
docker-compose exec sql-server /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P Admin@123

# Reset database (remove volume)
docker-compose down -v
docker-compose up
```

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   - Ensure ports 1433, 4200, 5000, and 5001 are not in use
   - Change ports in docker-compose.yml if needed

2. **Database Connection Issues**
   - Wait for SQL Server to be healthy (check health check)
   - Verify connection string in environment variables

3. **Build Failures**
   - Clear Docker cache: `docker system prune -a`
   - Rebuild without cache: `docker-compose build --no-cache`

4. **Memory Issues**
   - Increase Docker Desktop memory allocation
   - Close unnecessary applications

### Performance Optimization

1. **Development Mode**
   - Use `docker-compose.dev.yml` for faster development
   - Hot reloading reduces build time

2. **Production Mode**
   - Use multi-stage builds for smaller images
   - Nginx serves static files efficiently

## Security Notes

- Default passwords are used for development
- JWT key should be changed in production
- SQL Server password should be changed in production
- Consider using Docker secrets for sensitive data

## Network Configuration

All services communicate through the `hahn-network` bridge network:
- Internal communication between services
- Isolated from host network
- Automatic DNS resolution between services

## File Structure

```
HahnTaskManager/
├── docker-compose.yml          # Production configuration
├── docker-compose.dev.yml      # Development configuration
├── Dockerfile.api              # Production API Dockerfile
├── Dockerfile.api.dev          # Development API Dockerfile
├── hahntaskmanager.client/
│   ├── Dockerfile              # Production client Dockerfile
│   ├── Dockerfile.dev          # Development client Dockerfile
│   └── nginx.conf              # Nginx configuration
└── .dockerignore               # Docker ignore rules
``` 