"use client";

import React, { useState } from 'react';
import { LucideArrowRight, LucideCalendar, LucideUser, LucideXCircle, LucideBot, LucideCheck, LucideZap, LucideLayers, LucideStar, LucideUser as LucideUserIcon } from 'lucide-react';
import { appointmentsApi } from '@/api/appointments';

export default function Page() {
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
        } catch (e) {
            const err = e as { response?: { data?: { message?: string } } };
            setMessage(err.response?.data?.message || "Error checking availability");
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
        } catch (e) {
            const err = e as { response?: { data?: { message?: string } } };
            setMessage(err.response?.data?.message || "Error scheduling appointment");
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
        } catch (e) {
            const err = e as { response?: { data?: { message?: string } } };
            setMessage(err.response?.data?.message || "Error cancelling appointment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection-red relative overflow-x-hidden font-sans">
            {/* Global Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-[#1a0505] to-black"></div>
                <div className="absolute top-0 left-0 w-[1px] h-[1px] bg-transparent stars-1 animate-[animStar_50s_linear_infinite]"></div>
                <div className="absolute top-0 left-0 w-[2px] h-[2px] bg-transparent stars-2 animate-[animStar_80s_linear_infinite]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/5 rounded-full blur-[120px]"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(circle_at_center,black_40%,transparent_80%)]"></div>
            </div>

            {/* Navbar */}
            <header className="fixed top-0 left-0 w-full z-50 pt-6 px-4">
                <nav className="max-w-5xl mx-auto flex items-center justify-between bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 shadow-2xl">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-[#ef233c] rounded-sm rotate-45"></div>
                        <span className="text-lg font-bold tracking-tight font-manrope">Clinic AI</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Features</a>
                        <a href="#demo" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Demo</a>
                        <a href="#pricing" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Pricing</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-white/5 px-6 py-2 transition-transform active:scale-95">
                            <span className="absolute inset-0 border border-white/10 rounded-full"></span>
                            <span className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_75%,#ef233c_100%)] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                            <span className="absolute inset-[1px] rounded-full bg-black"></span>
                            <span className="relative z-10 flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                                Get Access <LucideArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </span>
                        </button>
                    </div>
                </nav>
            </header>

            <main className="relative z-10">
                {/* Hero Section */}
                <section className="min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 animate-fade-up">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ef233c]"></span>
                        </span>
                        <span className="text-xs font-medium text-red-100/90 tracking-wide font-manrope">
                            Clinic AI 2.0 is now live
                        </span>
                        <LucideArrowRight className="w-3 h-3 text-red-400" />
                    </div>

                    <h1 className="text-6xl md:text-8xl font-semibold tracking-tighter font-manrope leading-[1.1] mb-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                        <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">Intelligent</span>
                        <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">
                            <span className="text-[#ef233c] inline-block relative">
                                Receptionist
                                <svg className="absolute w-full h-3 -bottom-2 left-0 text-[#ef233c] opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                                </svg>
                            </span>
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-up" style={{ animationDelay: '0.3s' }}>
                        Blending advanced Vapi voice AI with precision scheduling to transform patient experiences. Instant bookings, zero friction.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 animate-fade-up" style={{ animationDelay: '0.4s' }}>
                        <a href="#demo" className="shiny-cta group">
                            <span className="relative z-10 flex items-center gap-2 text-white font-medium">
                                Try the Demo <LucideArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </span>
                        </a>
                        <button className="group px-8 py-4 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium hover:text-white hover:bg-zinc-800 transition-all flex items-center gap-2">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/></svg>
                            View on GitHub
                        </button>
                    </div>
                </section>

                {/* Logo Strip */}
                <div className="w-full border-y border-white/5 bg-white/[0.02] backdrop-blur-sm py-10 opacity-60 hover:opacity-100 transition-opacity">
                    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-8 md:gap-16">
                        <p className="text-sm font-bold tracking-widest text-zinc-500 uppercase shrink-0">Integrated with:</p>
                        <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center w-full">
                            <div className="flex items-center gap-2 font-manrope font-semibold"><div className="w-6 h-6 bg-white/20 rounded-full"></div>Vapi AI</div>
                            <div className="flex items-center gap-2 font-manrope font-semibold"><div className="w-6 h-6 bg-white/20 rounded-full"></div>FastAPI</div>
                            <div className="flex items-center gap-2 font-manrope font-semibold"><div className="w-6 h-6 bg-white/20 rounded-full"></div>PostgreSQL</div>
                            <div className="flex items-center gap-2 font-manrope font-semibold"><div className="w-6 h-6 bg-white/20 rounded-full"></div>Next.js</div>
                            <div className="flex items-center gap-2 font-manrope font-semibold"><div className="w-6 h-6 bg-white/20 rounded-full"></div>Tailwind</div>
                        </div>
                    </div>
                </div>

                {/* Features Bento Grid */}
                <section id="features" className="py-32 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-20 text-center max-w-3xl mx-auto animate-fade-up">
                            <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight font-manrope mb-6">
                                The Operating System for <br />
                                <span className="text-[#ef233c]">Modern Healthcare</span>
                            </h2>
                            <p className="text-lg text-zinc-400 font-light">
                                Replacing fragmented booking systems with one cohesive voice-first platform.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-auto lg:h-[700px]">
                            <div className="lg:col-span-2 lg:row-span-2 group relative overflow-hidden p-8 border border-white/10 bg-gradient-to-b from-zinc-900/50 to-black hover:border-white/20 transition-all rounded-xl">
                                <div className="relative z-10 h-full flex flex-col">
                                    <div className="mb-6 inline-flex p-3 rounded-lg bg-white/5 border border-white/10 text-[#ef233c]">
                                        <LucideBot className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-3xl font-semibold text-white font-manrope mb-4 tracking-tight">Vapi Voice Engine</h3>
                                    <p className="text-zinc-400 text-lg leading-relaxed">Instant voice interaction that sounds human. Alex manages your appointments in real-time, handles cancellations, and checks availability without a single click.</p>
                                    <div className="mt-auto flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                        <span className="text-xs font-mono text-[#ef233c]">EXPLORE CORE</span>
                                        <LucideArrowRight className="w-4 h-4 text-[#ef233c]" />
                                    </div>
                                </div>
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" style={{background: 'radial-gradient(circle at top right, #ef233c, transparent 70%)'}}></div>
                            </div>

                            <div className="lg:col-span-2 group relative overflow-hidden p-8 border border-white/10 bg-black hover:border-white/20 transition-all rounded-xl">
                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="mb-4 inline-flex p-3 rounded-lg bg-white/5 border border-white/10 text-blue-400">
                                        <LucideZap className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-semibold text-white font-manrope mb-2">Instant Conflict Check</h3>
                                    <p className="text-zinc-400">Our backend automatically detects double-bookings and suggests the next available slot in milliseconds.</p>
                                </div>
                            </div>

                            <div className="group relative overflow-hidden p-8 border border-white/10 bg-black hover:border-white/20 transition-all rounded-xl">
                                <div className="relative z-10">
                                    <div className="mb-4 inline-flex p-3 rounded-lg bg-white/5 border border-white/10 text-yellow-400">
                                        <LucideCalendar className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white font-manrope mb-2">Smart Scheduling</h3>
                                    <p className="text-sm text-zinc-400">Flexible date parsing allows patients to book using natural language like &quot;6th of July&quot;.</p>
                                </div>
                            </div>

                            <div className="group relative overflow-hidden p-8 border border-white/10 bg-black hover:border-white/20 transition-all rounded-xl">
                                <div className="relative z-10">
                                    <div className="mb-4 inline-flex p-3 rounded-lg bg-white/5 border border-white/10 text-purple-400">
                                        <LucideLayers className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white font-manrope mb-2">Unified Patient Records</h3>
                                    <p className="text-sm text-zinc-400">Auto-creation of patient profiles ensures no one is left behind during a booking.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* INTERACTIVE DEMO SECTION */}
                <section id="demo" className="py-32 px-6 bg-zinc-950/50 relative border-y border-white/5">
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

                {/* Testimonial Banner */}
                <div className="w-full bg-[#ef233c] py-20 px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="flex justify-center gap-1 text-black mb-6">
                            <LucideStar className="w-6 h-6" fill="currentColor" />
                            <LucideStar className="w-6 h-6" fill="currentColor" />
                            <LucideStar className="w-6 h-6" fill="currentColor" />
                            <LucideStar className="w-6 h-6" fill="currentColor" />
                            <LucideStar className="w-6 h-6" fill="currentColor" />
                        </div>
                        <h3 className="text-3xl md:text-5xl font-bold text-black font-manrope leading-tight mb-8">
                            &quot;This AI Receptionist has completely transformed how we manage our bookings. Zero errors, instant responses.&quot;
                        </h3>
                        <div className="flex items-center justify-center gap-4">
                            <div className="w-12 h-12 bg-black rounded-full overflow-hidden flex items-center justify-center">
                                <LucideUserIcon className="text-white w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <div className="text-black font-bold text-lg">Dr. Sarah Jenkins</div>
                                <div className="text-black/70 font-medium">Chief of Medicine, Dubai Clinic</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pricing */}
                <section id="pricing" className="py-32 px-6 bg-black relative border-t border-white/5">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-5xl font-semibold text-white font-manrope mb-4">Simple, Transparent Pricing</h2>
                            <p className="text-zinc-400">Scalable infrastructure for clinics of all sizes.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Starter */}
                            <div className="p-8 border border-zinc-800 bg-black hover:border-zinc-700 transition-all rounded-xl flex flex-col">
                                <h3 className="text-xl font-bold font-manrope mb-2">Starter</h3>
                                <p className="text-zinc-500 text-sm mb-8 h-10">For small practices exploring AI automation.</p>
                                <div className="mb-8 flex items-baseline gap-1">
                                    <span className="text-zinc-500">$</span>
                                    <span className="text-5xl font-bold text-white">0</span>
                                    <span className="text-zinc-500 text-sm">/mo</span>
                                </div>
                                <ul className="space-y-4 mb-8 flex-1">
                                    <li className="flex items-center gap-3 text-sm text-zinc-300"><LucideCheck className="text-[#ef233c]" /> 1 AI Agent</li>
                                    <li className="flex items-center gap-3 text-sm text-zinc-300"><LucideCheck className="text-[#ef233c]" /> 100 Bookings/mo</li>
                                    <li className="flex items-center gap-3 text-sm text-zinc-300"><LucideCheck className="text-[#ef233c]" /> Community Support</li>
                                </ul>
                                <button className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg text-sm font-bold uppercase tracking-wider transition-all">Get Started</button>
                            </div>

                            {/* Pro */}
                            <div className="relative p-8 border border-[#ef233c] bg-zinc-900/40 shadow-[0_0_30px_rgba(239,35,60,0.1)] rounded-xl flex flex-col scale-105 z-10">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ef233c] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Recommended</div>
                                <h3 className="text-xl font-bold font-manrope mb-2">Pro</h3>
                                <p className="text-zinc-400 text-sm mb-8 h-10">For high-growth clinics and multi-doctor practices.</p>
                                <div className="mb-8 flex items-baseline gap-1">
                                    <span className="text-zinc-500">$</span>
                                    <span className="text-5xl font-bold text-white">49</span>
                                    <span className="text-zinc-500 text-sm">/mo</span>
                                </div>
                                <ul className="space-y-4 mb-8 flex-1">
                                    <li className="flex items-center gap-3 text-sm text-zinc-300"><LucideCheck className="text-[#ef233c]" /> Unlimited Bookings</li>
                                    <li className="flex items-center gap-3 text-sm text-zinc-300"><LucideCheck className="text-[#ef233c]" /> Priority AI Processing</li>
                                    <li className="flex items-center gap-3 text-sm text-zinc-300"><LucideCheck className="text-[#ef233c]" /> Advanced Analytics</li>
                                    <li className="flex items-center gap-3 text-sm text-zinc-300"><LucideCheck className="text-[#ef233c]" /> Dedicated Support</li>
                                </ul>
                                <button className="w-full py-3 px-4 bg-[#ef233c] hover:bg-red-700 text-white rounded-lg text-sm font-bold uppercase tracking-wider transition-all">Go Pro</button>
                            </div>

                            {/* Team */}
                            <div className="p-8 border border-zinc-800 bg-black hover:border-zinc-700 transition-all rounded-xl flex flex-col">
                                <h3 className="text-xl font-bold font-manrope mb-2">Enterprise</h3>
                                <p className="text-zinc-500 text-sm mb-8 h-10">For hospital networks and large healthcare groups.</p>
                                <div className="mb-8 flex items-baseline gap-1">
                                    <span className="text-zinc-500">$</span>
                                    <span className="text-5xl font-bold text-white">199</span>
                                    <span className="text-zinc-500 text-sm">/mo</span>
                                </div>
                                <ul className="space-y-4 mb-8 flex-1">
                                    <li className="flex items-center gap-3 text-sm text-zinc-300"><LucideCheck className="text-[#ef233c]" /> Custom AI Workflows</li>
                                    <li className="flex items-center gap-3 text-sm text-zinc-300"><LucideCheck className="text-[#ef233c]" /> SSO & Security Audit</li>
                                    <li className="flex items-center gap-3 text-sm text-zinc-300"><LucideCheck className="text-[#ef233c]" /> API Access</li>
                                </ul>
                                <button className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg text-sm font-bold uppercase tracking-wider transition-all">Contact Sales</button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Waitlist */}
                <section className="py-32 px-6 text-center bg-zinc-950/40">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-5xl md:text-7xl font-bold font-manrope mb-8 tracking-tighter">Ready to <span className="text-[#ef233c]">Scale?</span></h2>
                        <p className="text-xl text-zinc-400 mb-12">Join the future of clinic management. Experience the power of AI voice reception.</p>

                        <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
                            <input type="email" placeholder="Enter your email" className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-4 text-white focus:outline-none focus:border-[#ef233c] transition-all" />
                            <button className="bg-[#ef233c] hover:bg-red-700 text-white font-bold rounded-full px-8 py-4 transition-all">Join Now</button>
                        </form>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-black border-t border-zinc-900 pt-20 pb-10 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-24 relative z-10">
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-5 h-5 bg-[#ef233c] rounded-sm rotate-45"></div>
                            <span className="text-2xl font-bold font-manrope tracking-tight">Clinic AI</span>
                        </div>
                        <p className="text-zinc-500 max-w-xs leading-relaxed">Pioneering the future of patient interactions through intelligent voice automation and precision scheduling.</p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="text-xs font-bold text-[#ef233c] uppercase tracking-widest mb-2">Platform</h4>
                        <a href="#features" className="text-zinc-400 text-sm hover:text-white transition-colors">Features</a>
                        <a href="#" className="text-zinc-400 text-sm hover:text-white transition-colors">Integrations</a>
                        <a href="#pricing" className="text-zinc-400 text-sm hover:text-white transition-colors">Pricing</a>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="text-xs font-bold text-[#ef233c] uppercase tracking-widest mb-2">Company</h4>
                        <a href="#" className="text-zinc-400 text-sm hover:text-white transition-colors">About Us</a>
                        <a href="#" className="text-zinc-400 text-sm hover:text-white transition-colors">Careers</a>
                        <a href="#" className="text-zinc-400 text-sm hover:text-white transition-colors">Legal</a>
                    </div>
                </div>

                <div className="flex justify-center items-center py-10 opacity-20 pointer-events-none">
                    <h1 className="text-[15vw] leading-none font-bold font-manrope tracking-tighter text-stroke select-none">CLINIC AI</h1>
                </div>

                <div className="max-w-7xl mx-auto px-6 border-t border-zinc-900 pt-8 flex flex-col md:flex-row items-center justify-between text-zinc-600 text-[10px] uppercase tracking-widest">
                    <p>&copy; 2024 Clinic AI Receptionist. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-zinc-400">Twitter</a>
                        <a href="#" className="hover:text-zinc-400">LinkedIn</a>
                        <a href="#" className="hover:text-zinc-400">GitHub</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
