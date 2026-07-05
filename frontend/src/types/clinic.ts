import { z } from 'zod'; // If I add zod later, but using standard types for now

export interface AvailabilityRequest {
    date: string;
}

export interface AvailabilityResponse {
    available_slots: string[];
    message: string;
}

export interface CancelAppointmentRequest {
    date: string;
    patient_name: string;
}

export interface CancelAppointmentResponse {
    success: boolean;
    message: string;
}

export interface ScheduleAppointmentRequest {
    patient_name: string;
    start_time: string;
    reason: string;
}

export interface ScheduleAppointmentResponse {
    success: boolean;
    message: string;
    appointment_id?: number;
}
