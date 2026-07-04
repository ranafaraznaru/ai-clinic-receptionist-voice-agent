from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field

# --- Doctor Models ---
class DoctorBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    specialty: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    phone: str = Field(..., min_length=5, max_length=20)

class DoctorCreate(DoctorBase):
    pass

class DoctorResponse(DoctorBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

# --- Patient Models ---
class PatientBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    dob: date
    email: EmailStr
    phone: str = Field(..., min_length=5, max_length=20)
    medical_record_number: str = Field(..., min_length=1, max_length=50)

class PatientCreate(PatientBase):
    pass

class PatientResponse(PatientBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

# --- Appointment Models ---
class AppointmentBase(BaseModel):
    patient_id: int
    doctor_id: int
    start_time: datetime
    end_time: datetime
    status: str = Field(default="scheduled", pattern="^(scheduled|completed|cancelled)$")
    notes: Optional[str] = Field(None, max_length=1000)

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentResponse(AppointmentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

# --- Vapi Integration Models ---

class AvailabilityRequest(BaseModel):
    date: str = Field(..., description="Date in YYYY-MM-DD format")

class AvailabilityResponse(BaseModel):
    available_slots: List[str]
    message: str
