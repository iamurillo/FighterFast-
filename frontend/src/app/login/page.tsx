"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Lock, ChevronRight, Activity, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { db } from '@/utils/storage';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = db.getUser();
            if (!user) {
                throw new Error('No se encontró ninguna cuenta en este dispositivo. Por favor, regístrate primero.');
            }
            if (user.email !== email || user.password !== password) {
                throw new Error('Correo o contraseña incorrectos');
            }

            db.saveUser(user);
            router.push('/dashboard');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--color-fighter-background)] relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[var(--color-fighter-red)]/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-20%] w-[500px] h-[500px] bg-red-900/5 rounded-full blur-[150px]" />

            {/* Logo Section */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex flex-col items-center mb-12 relative z-10"
            >
                <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-fighter-surface)] to-black rounded-3xl flex items-center justify-center shadow-2xl mb-6 border border-white/10 relative group">
                    <div className="absolute inset-0 bg-[var(--color-fighter-red)]/20 blur-xl group-hover:bg-[var(--color-fighter-red)]/40 transition-all duration-500 rounded-full" />
                    <Zap className="w-10 h-10 text-[var(--color-fighter-red)] relative z-10 fill-[var(--color-fighter-red)]" />
                </div>
                <h1 className="text-4xl font-black tracking-tighter text-white mb-2 italic">FIGHTER<span className="text-[var(--color-fighter-red)]">FAST</span></h1>
                <div className="h-1 w-12 bg-[var(--color-fighter-red)] rounded-full mb-3" />
                <p className="text-[10px] text-gray-400 font-black tracking-[0.4em] uppercase">Elite Performance Tracker</p>
            </motion.div>

            {/* Form Section */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="w-full max-w-sm relative z-10"
            >
                <div className="fighter-card !bg-transparent glass-panel border-white/5 p-8 shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">E-mail</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                    <User className="w-4 h-4 text-gray-500 group-focus-within:text-[var(--color-fighter-red)] transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-2xl focus:ring-1 focus:ring-[var(--color-fighter-red)] focus:border-[var(--color-fighter-red)] block px-11 py-5 outline-none transition-all placeholder-gray-600 font-medium"
                                    placeholder="correo@ejemplo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Contraseña</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                    <Lock className="w-4 h-4 text-gray-500 group-focus-within:text-[var(--color-fighter-red)] transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-2xl focus:ring-1 focus:ring-[var(--color-fighter-red)] focus:border-[var(--color-fighter-red)] block px-11 py-5 outline-none transition-all placeholder-gray-600 font-medium"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-[var(--color-fighter-red)] text-[10px] font-black uppercase text-center bg-red-500/10 py-3 rounded-xl border border-red-500/20"
                            >
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="fighter-btn-primary w-full py-5 text-sm tracking-[0.2em] mt-2 flex justify-center items-center gap-3 active:scale-95 shadow-[0_10px_30px_rgba(225,29,72,0.3)]"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    LOGIN
                                    <ChevronRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-10 text-center">
                    <Link href="/register" className="group">
                        <p className="text-xs font-bold text-gray-500 hover:text-white transition-colors">
                            ¿Aún no tienes cuenta? <span className="text-[var(--color-fighter-red)] group-hover:underline underline-offset-4">Únete al Campamento</span>
                        </p>
                    </Link>
                </div>
            </motion.div>

            {/* Footer version */}
            <div className="absolute bottom-8 text-[9px] font-black text-gray-700 tracking-[0.5em] uppercase">
                FighterFast v1.0.0 Alpha
            </div>
        </div>
    );
}
