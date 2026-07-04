from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.services.appointment_service import AppointmentService
from app.models.clinic import (
    AvailabilityRequest,
    AvailabilityResponse,
    CancelAppointmentRequest,
    CancelAppointmentResponse,
    ScheduleAppointmentRequest,
    ScheduleAppointmentResponse
)

router = APIRouter()

@router.post("/check-availability", response_model=AvailabilityResponse)
async def check_doctor_availability(
    request: AvailabilityRequest,
    db: Session = Depends(get_db)
):
    """
    Tool for Vapi to check available appointment slots for a specific date.
    """
    service = AppointmentService(db)
    return service.check_availability(request.date)

@router.post("/cancel", response_model=CancelAppointmentResponse)
async def cancel_appointment(
    request: CancelAppointmentRequest,
    db: Session = Depends(get_db)
):
    """
    Tool for Vapi to cancel an existing appointment for a patient.
    """
    service = AppointmentService(db)
    return service.cancel_appointment(request.date, request.patient_name)

@router.post("/schedule", response_model=ScheduleAppointmentResponse)
async def schedule_appointment(
    request: ScheduleAppointmentRequest,
    db: Session = Depends(get_db)
):
    """
    Tool for Vapi to schedule a new appointment.
    """
    service = AppointmentService(db)
    return service.schedule_appointment(
        patient_name=request.patient_name,
        start_time_str=request.start_time,
        reason=request.reason
    )
