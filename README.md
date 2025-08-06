# Hahn Task Manager

This is a full-stack task management application built with .NET 8 for the backend and Angular for the frontend.

## Features

- **Backend:**
  - ASP.NET Core 8 Web API
  - Entity Framework Core for data access
  - SQL Server for the database
  - JWT-based authentication
  - Swagger/OpenAPI documentation

- **Frontend:**
  - Angular
  - TypeScript
  - Bootstrap for styling
  - JWT token handling

## Getting Started

You can run this application either locally on your machine or using Docker.

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js and npm](https://nodejs.org/)
- [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)
- A running instance of SQL Server.

### Local Setup

1.  **Configure the database connection:**
    - Open `HahnTaskManager.Api/appsettings.Development.json`.
    - Modify the `DefaultConnection` string to point to your local SQL Server instance.

2.  **Run the backend API:**
    ```bash
    cd HahnTaskManager.Api
    dotnet run
    ```
    The API will be available at `https://localhost:5001`.

3.  **Run the frontend application:**
    ```bash
    cd hahntaskmanager.client
    npm install
    npm start
    ```
    The frontend application will be available at `http://localhost:4200`.

## Docker Setup

If you prefer to use Docker, you can use the provided `docker-compose.yml` file to set up the entire application stack.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop)

### Running with Docker

1.  **Build and run the services:**
    ```bash
    docker-compose up --build
    ```
    To run in detached mode, add the `-d` flag:
    ```bash
    docker-compose up --build -d
    ```

This command will:
- Build the Docker images for the API and the client.
- Start containers for the API, client, and a SQL Server database.
- The database will be initialized and seeded on the first run.

## Access Points

- **Frontend Application:** [http://localhost:4200](http://localhost:4200)
- **API (Swagger UI):** [http://localhost:5001/swagger](http://localhost:5001/swagger/index.html)
- **SQL Server Database:** `localhost:1433`

## Project Structure

- `HahnTaskManager.Api/`: The ASP.NET Core Web API project (backend).
- `hahntaskmanager.client/`: The Angular project (frontend).
- `HahnTaskManager.Application/`: Contains application logic, services, and interfaces.
- `HahnTaskManager.Domain/`: Contains domain entities and core business logic.
- `HahnTaskManager.Infrastructure/`: Contains infrastructure concerns like data access and external services.
- `docker-compose.yml`: Docker Compose file for production-like setup.
- `Dockerfile`: Docker configurations for the API and client.
