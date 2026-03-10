import React, { useState, useRef, useEffect } from 'react';
import { X, Mail, Lock, Loader2, User, Phone, Calendar } from 'lucide-react';
import gsap from 'gsap';
import { useStore } from '../../store/useStore';
import { supabase } from '../../lib/supabaseClient';

export default function AuthModal() {
    const { isAuthModalOpen, setAuthModalOpen, setUser } = useStore();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [dob, setDob] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const overlayRef = useRef(null);
    const modalRef = useRef(null);

    useEffect(() => {
        if (isAuthModalOpen) {
            document.body.style.overflow = 'hidden';
            gsap.to(overlayRef.current, { opacity: 1, pointerEvents: 'auto', duration: 0.4, ease: 'power2.out' });
            gsap.fromTo(modalRef.current,
                { y: 50, opacity: 0, scale: 0.95 },
                { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)', delay: 0.1 }
            );
        } else {
            document.body.style.overflow = 'auto';
            gsap.to(overlayRef.current, { opacity: 0, pointerEvents: 'none', duration: 0.3, ease: 'power2.in' });
            gsap.to(modalRef.current, { y: 20, opacity: 0, scale: 0.95, duration: 0.3, ease: 'power2.in' });

            // Reset state
            setTimeout(() => {
                setEmail('');
                setPassword('');
                setName('');
                setMobile('');
                setDob('');
                setError('');
                setIsLogin(true);
            }, 300);
        }
    }, [isAuthModalOpen]);

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Form Validation for Signup
        if (!isLogin) {
            // Mobile Number Validation
            if (!/^\d{10}$/.test(mobile)) {
                setError('Mobile number must be exactly 10 digits.');
                setLoading(false);
                return;
            }

            // Date of Birth Validation
            const selectedDate = new Date(dob);
            const today = new Date();
            if (selectedDate > today) {
                setError('Date of birth cannot be in the future.');
                setLoading(false);
                return;
            }

            // Email Validation (contains @ and .com)
            const emailRegex = /^[^\s@]+@[^\s@]+\.com$/;
            if (!emailRegex.test(email)) {
                setError('Email must contain @ and end with .com');
                setLoading(false);
                return;
            }
        }

        try {
            if (isLogin) {
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) {
                    if (error.message.includes("Email not confirmed")) {
                        throw new Error("Your email hasn't been confirmed yet. Please check your inbox for a verification link.");
                    }
                    throw error;
                }
                setUser(data.user);
                setAuthModalOpen(false);
            } else {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: name,
                            mobile_number: mobile,
                            dob: dob
                        }
                    }
                });
                if (error) throw error;

                // Manually insert into the public 'users' table 
                if (data.user) {
                    try {
                        const { error: insertError } = await supabase.from('users').insert([{
                            id: data.user.id,
                            email: email,
                            full_name: name,
                            mobile_number: mobile,
                            dob: dob
                        }]);

                        if (insertError) {
                            console.error("Sync to public.users failed:", insertError);
                            setError(`Account created, but profiles sync failed: ${insertError.message}. Please contact support.`);
                            // Don't throw, we still want to show the signup success part
                        }
                    } catch (insertErr) {
                        console.error("Critical insert error:", insertErr);
                        setError(`Critical Sync Error: ${insertErr.message}`);
                    }
                }

                // Handle session or confirmation requirement
                if (data.session) {
                    setUser(data.user);
                    setAuthModalOpen(false);
                } else if (data.user && data.user.identities && data.user.identities.length === 0) {
                    setError("This email is already registered. Please login instead.");
                } else {
                    setError("Welcome! Please check your email inbox to verify your account.");
                }
            }
        } catch (err) {
            setError(err.message || 'An error occurred during authentication.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[80] flex items-center justify-center p-4 opacity-0 pointer-events-none"
        >
            {/* Dark blur overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => !loading && setAuthModalOpen(false)}
            />

            {/* Modal Content */}
            <div
                ref={modalRef}
                className="relative w-full max-w-md max-h-[90vh] overflow-y-auto scrollbar-hide bg-[#050508]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl opacity-0"
            >
                <button
                    onClick={() => !loading && setAuthModalOpen(false)}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-8 mt-2">
                    <p className="text-[color:var(--color-gold)] tracking-[0.3em] text-xs font-semibold uppercase mb-3">
                        Authentication Required
                    </p>
                    <h2 className="text-3xl font-serif text-white tracking-widest">
                        {isLogin ? 'ENTER ORBIT' : 'INITIALIZE'}
                    </h2>
                </div>

                {error && (
                    <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                    {!isLogin && (
                        <>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                <input
                                    type="text"
                                    required
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[color:var(--color-gold)]/50 focus:bg-white/10 transition-all font-sans"
                                />
                            </div>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                <input
                                    type="tel"
                                    required
                                    placeholder="Mobile Number"
                                    value={mobile}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        if (value.length <= 10) setMobile(value);
                                    }}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[color:var(--color-gold)]/50 focus:bg-white/10 transition-all font-sans"
                                    pattern="\d{10}"
                                    maxLength="10"
                                />
                            </div>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                <input
                                    type="date"
                                    required
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                    max={new Date().toISOString().split('T')[0]}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[color:var(--color-gold)]/50 focus:bg-white/10 transition-all font-sans"
                                    style={{ colorScheme: 'dark' }}
                                />
                            </div>
                        </>
                    )}

                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                        <input
                            type="email"
                            required
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[color:var(--color-gold)]/50 focus:bg-white/10 transition-all font-sans"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                        <input
                            type="password"
                            required
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[color:var(--color-gold)]/50 focus:bg-white/10 transition-all font-sans"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full liquid-btn border border-[color:var(--color-gold)] bg-[color:var(--color-gold)]/10 hover:bg-[color:var(--color-gold)] text-[color:var(--color-gold)] hover:text-black rounded-xl py-4 text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300 flex justify-center items-center mt-4 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <span className="relative z-10 transition-colors group-hover:text-black">{isLogin ? 'Access' : 'Commence'}</span>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                        }}
                        disabled={loading}
                        className="text-white/50 hover:text-white text-sm transition-colors border-b border-white/20 hover:border-white pb-1"
                    >
                        {isLogin ? 'No active terminal? Initialize.' : 'Already initialized? Access terminal.'}
                    </button>
                </div>
            </div>
        </div>
    );
}
