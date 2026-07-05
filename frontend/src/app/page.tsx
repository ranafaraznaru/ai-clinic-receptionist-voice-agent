"use client";

import React, { useState } from 'react';
import { LucideArrowRight, LucideCalendar, LucideUser, LucideXCircle, LucideBot } from 'lucide-react';
import { appointmentsApi } from '@/api/appointments';
import {
    AvailabilityRequest, AvailabilityResponse,
    CancelAppointmentRequest, CancelAppointmentResponse,
    ScheduleAppointmentRequest, ScheduleAppointmentResponse
} from '@/types/clinic';

export default function Page() {
    const [view, setView] = useState<'hero' | 'booking'>('hero');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Form States
    const [date, setDate] = useState("");
    const [patientName, setPatientName] = useState("");
    const [startTime, setStartTime] = useState("");
    const [reason, setReason] = useState("");
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);

    const handleCheckAvailability = async () => {
        if (!date) return setMessage("Please enter a date");
        setLoading(true);
        setMessage("");
        try {
            const res = await appointmentsApi.checkAvailability({ date });
            setAvailableSlots(res.available_slots);
            setMessage(res.message);
        } catch (e: any) {
            setMessage(e.response?.data?.message || "Error checking availability");
        } finally {
            setLoading(false);
        }
    };

    const handleSchedule = async () => {
        if (!patientName || !startTime || !reason) return setMessage("Please fill in all fields");
        setLoading(true);
        setMessage("");
        try {
            const res = await appointmentsApi.scheduleAppointment({
                patient_name: patientName,
                start_time: startTime,
                reason: reason
            });
            setMessage(res.message);
            setAvailableSlots([]);
        } catch (e: any) {
            setMessage(e.response?.data?.message || "Error scheduling appointment");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!date || !patientName) return setMessage("Please enter both name and date");
        setLoading(true);
        setMessage("");
        try {
            const res = await appointmentsApi.cancelAppointment({
                date,
                patient_name: patientName
            });
            setMessage(res.message);
        } catch (e: any) {
            setMessage(e.response?.data?.message || "Error cancelling appointment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection-red relative overflow-x-hidden font-sans">
            {/* Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-[#1a0505] to-black"></div>
                <div className="absolute top-0 left-0 w-[1px] h-[1px] bg-transparent stars-1 animate-[animStar_50s_linear_infinite]"></div>
                <div className="absolute top-0 left-0 w-[2px] h-[2px] bg-transparent stars-2 animate-[animStar_80s_linear_infinite]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/5 rounded-full blur-[120px]"></div>
            </div>

            {/* Navbar */}
            <header className="fixed top-0 left-0 w-full z-50 pt-6 px-4">
                <nav className="max-w-5xl mx-auto flex items-center justify-between bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 shadow-2xl">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('hero')}>
                        <div className="w-5 h-5 bg-[#ef233c] rounded-sm rotate-45"></div>
                        <span className="text-lg font-bold tracking-tight font-manrope">Clinic AI</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setView('booking')}
                            className="text-xs font-bold uppercase tracking-wider px-6 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                        >
                            Manage Bookings
                        </button>
                    </div>
                </nav>
            </header>

            <main className="relative z-10">
                {view === 'hero' ? (
                    <section className="min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 animate-fade-up">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ef233c]"></span>
                            </span>
                            <span className="text-xs font-medium text-red-100/90 tracking-wide">AI Receptionist Live</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-semibold tracking-tighter leading-[1.1] mb-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">Intelligent</span>
                            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">
                                <span className="text-[#ef233c]">Clinic</span> Management
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-up" style={{ animationDelay: '0.3s' }}>
                            Experience the future of healthcare scheduling with our AI voice agent. Instant booking, zero wait times.
                        </p>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-6 animate-fade-up" style={{ animationDelay: '0.4s' }}>
                            <button
                                onClick={() => setView('booking')}
                                className="shiny-cta group"
                            >
                                <span className="relative z-10 flex items-center gap-2 text-white font-medium">
                                    Try the Demo <LucideArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </span>
                            </button>
                        </div>
                    </section>
                ) : (
                    <section className="pt-32 pb-20 px-6 min-h-screen">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex items-center gap-4 mb-12 animate-fade-up">
                                <div className="p-3 rounded-lg bg-[#ef233c]/10 border border-[#ef233c]/20 text-[#ef233c]">
                                    <LucideBot className="w-6 h-6" />
                                </div>
                                <h2 className="text-4xl font-semibold font-manrope tracking-tight">AI Receptionist Dashboard</h2>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Column 1: Check Availability */}
                                <div className="p-8 border border-white/10 bg-zinc-900/30 backdrop-blur-sm rounded-2xl flex flex-col gap-6 transition-all hover:border-white/20">
                                    <div className="flex items-center gap-3 text-zinc-400 mb-2">
                                        <LucideCalendar className="w-5 h-5" />
                                        <span className="text-sm font-bold uppercase tracking-widest">Check Availability</span>
                                    </div>
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            placeholder="Date (e.g. 6 July)"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ef233c] transition-all"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                        />
                                        <button
                                            onClick={handleCheckAvailability}
                                            disabled={loading}
                                            className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold transition-all"
                                        >
                                            {loading ? "Checking..." : "Check Slots"}
                                        </button>
                                    </div>
                                    {availableSlots.length > 0 && (
                                        <div className="grid grid-cols-3 gap-2 mt-4">
                                            {availableSlots.map(slot => (
                                                <button
                                                    key={slot}
                                                    onClick={() => setStartTime(slot)}
                                                    className={`py-2 text-xs rounded-lg border ${startTime === slot ? 'bg-[#ef233c] border-[#ef233c] text-white' : 'bg-black border-white/10 text-zinc-400 hover:border-white/30'}`}
                                                >
                                                    {slot}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Column 2: Schedule Appointment */}
                                <div className="p-8 border border-[#ef233c]/30 bg-[#ef233c]/5 backdrop-blur-sm rounded-2xl flex flex-col gap-6 transition-all hover:border-[#ef233c]/50 shadow-[0_0_20px_rgba(239,35,60,0.1)]">
                                    <div className="flex items-center gap-3 text-[#ef233c] mb-2">
                                        <LucideUser className="w-5 h-5" />
                                        <span className="text-sm font-bold uppercase tracking-widest">Book Appointment</span>
                                    </div>
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            placeholder="Patient Name"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ef233c] transition-all"
                                            value={patientName}
                                            onChange={(e) => setPatientName(e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Time (e.g. 04:00 PM)"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ef233c] transition-all"
                                            value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Reason (e.g. Headache)"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ef233c] transition-all"
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                        />
                                        <button
                                            onClick={handleSchedule}
                                            disabled={loading}
                                            className="w-full py-3 bg-[#ef233c] hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-red-600/20"
                                        >
                                            {loading ? "Booking..." : "Confirm Booking"}
                                        </button>
                                    </div>
                                </div>

                                {/* Column 3: Cancel Appointment */}
                                <div className="p-8 border border-white/10 bg-zinc-900/30 backdrop-blur-sm rounded-2xl flex flex-col gap-6 transition-all hover:border-white/20">
                                    <div className="flex items-center gap-3 text-zinc-400 mb-2">
                                        <LucideXCircle className="w-5 h-5" />
                                        <span className="text-sm font-bold uppercase tracking-widest">Quick Cancel</span>
                                    </div>
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            placeholder="Patient Name"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ef233c] transition-all"
                                            value={patientName}
                                            onChange={(e) => setPatientName(e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Date (e.g. 6 July)"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ef233c] transition-all"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                        />
                                        <button
                                            onClick={handleCancel}
                                            disabled={loading}
                                            className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold text-zinc-300 transition-all"
                                        >
                                            {loading ? "Cancelling..." : "Cancel Appointment"}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {message && (
                                <div className={`mt-12 p-6 rounded-2xl border max-w-3xl mx-auto animate-fade-up text-center ${
                                    message.includes('successfully') || message.includes('available')
                                    ? 'bg-green-500/10 border-green-500/20 text-green-400'
                                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                                }`}>
                                    <p className="font-medium">{message}</p>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                <footer className="py-20 px-6 border-t border-zinc-900 bg-black">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-zinc-600 text-[10px] uppercase tracking-widest">
                        <p>&copy; 2024 Clinic AI Receptionist. All rights reserved.</p>
                        <div className="flex gap-6 mt-4 md:mt-0">
                            <a href="#" className="hover:text-zinc-400">Twitter</a>
                            <a href="#" className="hover:text-zinc-400">LinkedIn</a>
                            <a href="#" className="hover:text-zinc-400">GitHub</a>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}
