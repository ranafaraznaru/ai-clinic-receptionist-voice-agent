from datetime import datetime, date, timedelta, timezone
from sqlalchemy.orm import Session
from sqlalchemy import select, and_
from app.database.schema.appointment_schema import AppointmentSchema
from app.database.schema.patient_schema import PatientSchema
from app.database.schema.doctor_schema import DoctorSchema
from app.models.clinic import AvailabilityResponse, CancelAppointmentResponse, ScheduleAppointmentResponse

class AppointmentService:
    def __init__(self, db: Session):
        self.db = db

    def check_availability(self, check_date_str: str) -> AvailabilityResponse:
        try:
            check_date = datetime.strptime(check_date_str, "%Y-%m-%d").date()
        except ValueError:
            return AvailabilityResponse(available_slots=[], message="Invalid date format. Please use YYYY-MM-DD.")

        start_of_day = datetime.combine(check_date, datetime.min.time()).replace(hour=9, tzinfo=timezone.utc)
        end_of_day = datetime.combine(check_date, datetime.min.time()).replace(hour=17, tzinfo=timezone.utc)

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
            check_date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return CancelAppointmentResponse(success=False, message="Invalid date format. Please use YYYY-MM-DD.")

        patient_stmt = select(PatientSchema).where(PatientSchema.name == patient_name)
        patient = self.db.execute(patient_stmt).scalar_one_or_none()

        if not patient:
            return CancelAppointmentResponse(success=False, message=f"Could not find any patient record for {patient_name}.")

        start_of_day = datetime.combine(check_date, datetime.min.time()).replace(tzinfo=timezone.utc)
        end_of_day = datetime.combine(check_date, datetime.max.time()).replace(tzinfo=timezone.utc)

        appt_stmt = select(AppointmentSchema).where(
            and_(
                AppointmentSchema.patient_id == patient.id,
                AppointmentSchema.start_time >= start_of_day,
                AppointmentSchema.start_time <= end_of_day,
                AppointmentSchema.status != "cancelled"
            )
        )
        appointment = self.db.execute(appt_stmt).scalar_one_or_none()

        if not appointment:
            return CancelAppointmentResponse(success=False, message=f"No active appointment found for {patient_name} on {date_str}.")

        appointment.status = "cancelled"
        self.db.commit()
        self.db.refresh(appointment)

        return CancelAppointmentResponse(
            success=True,
            message=f"Appointment for {patient_name} on {date_str} has been successfully cancelled."
        )

    def schedule_appointment(self, patient_name: str, start_time: datetime, reason: str) -> ScheduleAppointmentResponse:
        # 1. Handle Patient (Search or Create minimal)
        patient_stmt = select(PatientSchema).where(PatientSchema.name == patient_name)
        patient = self.db.execute(patient_stmt).scalar_one_or_none()

        if not patient:
            # In a real app, the AI would collect these. For the Vapi prototype, we create a partial record.
            patient = PatientSchema(
                name=patient_name,
                dob=date(1990, 1, 1), # Placeholder
                email=f"{patient_name.lower().replace(' ', '.')}@example.com", # Placeholder
                phone="0000000000", # Placeholder
                medical_record_number=f"AUTO-{datetime.now().strftime('%Y%m%d%H%M%S')}"
            )
            self.db.add(patient)
            self.db.commit()
            self.db.refresh(patient)

        # 2. Handle Doctor (Assign to first available doctor for the prototype)
        doc_stmt = select(DoctorSchema)
        doctor = self.db.execute(doc_stmt).scalar_one_or_none()

        if not doctor:
            return ScheduleAppointmentResponse(
                success=False,
                message="No doctors are currently available in the system to take this appointment."
            )

        # 3. Collision Detection
        end_time = start_time + timedelta(minutes=30)
        collision_stmt = select(AppointmentSchema).where(
            and_(
                AppointmentSchema.doctor_id == doctor.id,
                AppointmentSchema.status != "cancelled",
                AppointmentSchema.start_time < end_time,
                AppointmentSchema.end_time > start_time
            )
        )
        collision = self.db.execute(collision_stmt).scalar_one_or_none()

        if collision:
            return ScheduleAppointmentResponse(
                success=False,
                message=f"I'm sorry, that time slot is no longer available. Please choose another time."
            )

        # 4. Create Appointment
        new_appointment = AppointmentSchema(
            patient_id=patient.id,
            doctor_id=doctor.id,
            start_time=start_time,
            end_time=end_time,
            reason=reason, # This field was 'notes' in the schema
            status="scheduled"
        )
        # Fix: map 'reason' to 'notes' field in schema
        new_appointment.notes = reason

        self.db.add(new_appointment)
        self.db.commit()
        self.db.refresh(new_appointment)

        return ScheduleAppointmentResponse(
            success=True,
            appointment_id=new_appointment.id,
            message=f"Great! I've scheduled your appointment for {patient_name} on {start_time.strftime('%B %d at %I:%M %p')}."
        )
