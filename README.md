# 🏥 AI Clinic Receptionist

A production-grade FastAPI backend designed to power an AI Voice Agent (via Vapi) for managing clinic appointments. This system acts as the "brain" for the AI receptionist, handling scheduling, availability checks, and cancellations with a clean, scalable architecture.

## 🛠️ Tech Stack

- **Language**: Python 3.12+
- **Package Manager**: [uv](https://github.com/astral-sh/uv)
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Server**: Uvicorn
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy 2.0
- **Migrations**: Alembic
- **Validation**: Pydantic v2 (with `email-validator`)

## 🏗️ Architecture

The project follows a **Clean Architecture** pattern to ensure the business logic remains independent of the delivery mechanism (API):

- `app/routing`: HTTP layer (Controllers). Handles requests/responses.
- `app/services`: Business logic layer. Handles rules, validations, and orchestration.
- `app/database/schema`: Persistence layer. SQLAlchemy ORM models.
- `app/models`: Data Transfer Objects (DTOs). Pydantic models for API validation.
- `app/config`: Environment and application configuration.

## 🚀 Getting Started

### 1. Prerequisites
- Install `uv`: `curl -LsSf https://astral.sh/uv/install.sh | sh`
- PostgreSQL installed and running.

### 2. Setup
```bash
# Clone the repository
git clone <repo-url>
cd ai-clinic-receptionist

# Initialize environment and dependencies
uv sync
```

### 3. Configuration
Copy the example environment file and update it with your PostgreSQL credentials:
```bash
cp .env.example .env
```
Edit `.env`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/clinic_db
```

### 4. Database Initialization
```bash
# Create the database in Postgres manually first:
# psql -U postgres -c "CREATE DATABASE clinic_db;"

# Run migrations to create tables
uv run alembic upgrade head
```

### 5. Running the Server
```bash
uv run uvicorn app.app:app --reload
```
The server will be available at `http://localhost:8000`.

## 🤖 Vapi Integration (Tool API)

This backend provides three specific tools for the Vapi AI agent (Alex):

### 1. Check Availability
- **Endpoint**: `POST /api/v1/appointments/check-availability`
- **Input**: `{"date": "YYYY-MM-DD"}`
- **Description**: Returns available 30-minute slots between 09:00 and 17:00.

### 2. Cancel Appointment
- **Endpoint**: `POST /api/v1/appointments/cancel`
- **Input**: `{"date": "YYYY-MM-DD", "patient_name": "Name"}`
- **Description**: Locates an active appointment for a patient on a specific date and marks it as cancelled.

### 3. Schedule Appointment
- **Endpoint**: `POST /api/v1/appointments/schedule`
- **Input**: `{"patient_name": "Name", "start_time": "ISO-Timestamp", "reason": "Reason"}`
- **Description**: Checks for collisions and books a 30-minute slot. Automatically creates a minimal patient record if one does not exist.

## 📖 API Documentation
With the server running, you can access the interactive Swagger UI at:
👉 [http://localhost:8000/docs](http://localhost:8000/docs)
