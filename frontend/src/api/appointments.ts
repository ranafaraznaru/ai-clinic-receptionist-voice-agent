import apiClient from './client';
import {
    AvailabilityRequest,
    AvailabilityResponse,
    CancelAppointmentRequest,
    CancelAppointmentResponse,
    ScheduleAppointmentRequest,
    ScheduleAppointmentResponse
} from '../types/clinic';

export const appointmentsApi = {
    checkAvailability: async (data: AvailabilityRequest): Promise<AvailabilityResponse> => {
        const response = await apiClient.post('/appointments/check-availability', data);
        return response.data;
    },
    cancelAppointment: async (data: CancelAppointmentRequest): Promise<CancelAppointmentResponse> => {
        const response = await apiClient.post('/appointments/cancel', data);
        return response.data;
    },
    scheduleAppointment: async (data: ScheduleAppointmentRequest): Promise<ScheduleAppointmentResponse> => {
        const response = await apiClient.post('/appointments/schedule', data);
        return response.data;
    }
};
