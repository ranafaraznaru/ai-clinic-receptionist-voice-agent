from datetime import datetime, date, timedelta, timezone
from sqlalchemy.orm import Session
from sqlalchemy import select, and_
from app.database.schema.appointment_schema import AppointmentSchema
from app.models.clinic import AvailabilityResponse

class AppointmentService:
    def __init__(self, db: Session):
        self.db = db

    def check_availability(self, check_date_str: str) -> AvailabilityResponse:
        try:
            check_date = datetime.strptime(check_date_str, "%Y-%m-%d").date()
        except ValueError:
            return AvailabilityResponse(available_slots=[], message="Invalid date format. Please use YYYY-MM-DD.")

        # Define working hours: 09:00 to 17:00
        start_of_day = datetime.combine(check_date, datetime.min.time()).replace(hour=9, tzinfo=timezone.utc)
        end_of_day = datetime.combine(check_date, datetime.min.time()).replace(hour=17, tzinfo=timezone.utc)

        # Find all existing appointments for this date
        stmt = select(AppointmentSchema).where(
            and_(
                AppointmentSchema.start_time >= start_of_day,
                AppointmentSchema.start_time < end_of_day,
                AppointmentSchema.status != "cancelled"
            )
        )
        existing_appointments = self.db.execute(stmt).scalars().all()

        # Generate slots (every 30 mins)
        available_slots = []
        current_slot = start_of_day
        while current_slot < end_of_day:
            slot_end = current_slot + timedelta(minutes=30)

            # Check if any existing appointment overlaps with this slot
            is_booked = any(
                (current_slot < appt.end_time and slot_end > appt.start_time)
                for appt in existing_appointments
            )

            if not is_booked:
                available_slots.append(current_slot.strftime("%H:%M"))

            current_slot = slot_end

        if not available_slots:
            return AvailabilityResponse(available_slots=[], message="Sorry, there are no available slots for the selected date.")

        return AvailabilityResponse(
            available_slots=available_slots,
            message=f"The following slots are available: {', '.join(available_slots)}."
        )
