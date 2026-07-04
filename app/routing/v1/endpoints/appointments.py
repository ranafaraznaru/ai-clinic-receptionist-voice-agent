from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.services.appointment_service import AppointmentService
from app.models.clinic import AvailabilityRequest, AvailabilityResponse

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
