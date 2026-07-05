from datetime import datetime, date, timedelta, timezone
from sqlalchemy.orm import Session
from sqlalchemy import select, and_
from app.database.schema.appointment_schema import AppointmentSchema
from app.database.schema.patient_schema import PatientSchema
from app.models.clinic import AvailabilityResponse, CancelAppointmentResponse, ScheduleAppointmentResponse

class AppointmentService:
    def __init__(self, db: Session):
        self.db = db

    def _parse_flexible_date(self, date_str: str) -> date:
        try:
            return datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            pass

        clean_date = date_str.lower()
        for suffix in ["st", "nd", "rd", "th"]:
            if " " in clean_date:
                parts = clean_date.split()
                cleaned_parts = [p.replace(suffix, "") if p.endswith(suffix) else p for p in parts]
                clean_date = " ".join(cleaned_parts)

        formats = ["%d %B", "%B %d", "%d %b", "%b %d"]

        for fmt in formats:
            try:
                parsed_date = datetime.strptime(clean_date, fmt)
                return parsed_date.replace(year=datetime.now().year).date()
            except ValueError:
                continue

        raise ValueError(f"Could not parse date: {date_str}")

    def check_availability(self, check_date_str: str) -> AvailabilityResponse:
        try:
            check_date = self._parse_flexible_date(check_date_str)
        except ValueError:
            return AvailabilityResponse(available_slots=[], message="I couldn't understand the date. Please use a format like '2026-07-06' or '6 July'.")

        start_of_day = datetime.combine(check_date, datetime.min.time()).replace(hour=9, tzinfo=timezone.utc)
        end_of_day = datetime.combine(check_date, datetime.min.time()).replace(hour=17, tzinfo=timezone.utc)

        # Since we removed doctor_id, we check if ANY appointment exists in that slot
        stmt = select(AppointmentSchema).where(
            and_(
                AppointmentSchema.start_time >= start_of_day,
                AppointmentSchema.start_time < end_of_day,
                AppointmentSchema.status != "cancelled"
            )
        )
        existing_appointments = self.db.execute(stmt).scalars().all()

        available_slots = []
        current_slot = start_of_day
        while current_slot < end_of_day:
            slot_end = current_slot + timedelta(minutes=30)
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

    def cancel_appointment(self, date_str: str, patient_name: str) -> CancelAppointmentResponse:
        try:
            check_date = self._parse_flexible_date(date_str)
        except ValueError:
            return CancelAppointmentResponse(success=False, message="I couldn't understand the date. Please use a format like '2026-07-06' or '6 July'.")

        start_of_day = datetime.combine(check_date, datetime.min.time()).replace(tzinfo=timezone.utc)
        end_of_day = datetime.combine(check_date, datetime.max.time()).replace(tzinfo=timezone.utc)

        # Directly query the appointments table using patient_name (Denormalized)
        appt_stmt = select(AppointmentSchema).where(
            and_(
                AppointmentSchema.patient_name.ilike(f"%{patient_name}%"),
                AppointmentSchema.start_time >= start_of_day,
                AppointmentSchema.start_time <= end_of_day,
                AppointmentSchema.status != "cancelled"
            )
        )
        appointment = self.db.execute(appt_stmt).scalars().first()

        if not appointment:
            return CancelAppointmentResponse(success=False, message=f"No active appointment found for {patient_name} on {check_date.strftime('%B %d')}.")

        appointment.status = "cancelled"
        self.db.commit()
        self.db.refresh(appointment)

        return CancelAppointmentResponse(
            success=True,
            message=f"Appointment for {appointment.patient_name} on {check_date.strftime('%B %d')} has been successfully cancelled."
        )

    def schedule_appointment(self, patient_name: str, start_time_str: str, reason: str) -> ScheduleAppointmentResponse:
        try:
            start_time = datetime.fromisoformat(start_time_str.replace("Z", "+00:00"))
        except ValueError:
            try:
                time_obj = datetime.strptime(start_time_str, "%I:%M %p").time()
                start_time = datetime.combine(date.today(), time_obj).replace(tzinfo=timezone.utc)
            except ValueError:
                return ScheduleAppointmentResponse(
                    success=False,
                    message="Invalid time format. Please provide time as '04:00 PM' or a full ISO timestamp."
                )

        patient_stmt = select(PatientSchema).where(PatientSchema.name.ilike(f"%{patient_name}%"))
        patient = self.db.execute(patient_stmt).scalars().first()

        if not patient:
            patient = PatientSchema(
                name=patient_name,
                dob=date(1990, 1, 1),
                email=f"{patient_name.lower().replace(' ', '.')}@example.com",
                phone="0000000000",
                medical_record_number=f"AUTO-{datetime.now().strftime('%Y%m%d%H%M%S')}"
            )
            self.db.add(patient)
            self.db.commit()
            self.db.refresh(patient)

        end_time = start_time + timedelta(minutes=30)
        collision_stmt = select(AppointmentSchema).where(
            and_(
                AppointmentSchema.status != "cancelled",
                AppointmentSchema.start_time < end_time,
                AppointmentSchema.end_time > start_time
            )
        )
        collision = self.db.execute(collision_stmt).scalars().first()

        if collision:
            return ScheduleAppointmentResponse(
                success=False,
                message=f"I'm sorry, that time slot is no longer available. Please choose another time."
            )

        new_appointment = AppointmentSchema(
            patient_id=patient.id,
            patient_name=patient_name,
            start_time=start_time,
            end_time=end_time,
            notes=reason,
            status="scheduled"
        )

        self.db.add(new_appointment)
        self.db.commit()
        self.db.refresh(new_appointment)

        return ScheduleAppointmentResponse(
            success=True,
            appointment_id=new_appointment.id,
            message=f"Great! I've scheduled your appointment for {patient_name} on {start_time.strftime('%B %d at %I:%M %p')}."
        )
