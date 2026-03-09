"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Activity, User, Lock, Mail, ChevronRight, Zap, Target, Shield, Dumbbell } from 'lucide-react';
import { motion } from 'framer-motion';
import { db } from '@/utils/storage';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        age: '',
        gender: 'M',
        height: '',
        current_weight: '',
        target_weight: '',
        activity_level: 'moderate',
        training_type: 'jiu-jitsu',
        training_days: '4'
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const payload = {
                ...formData,
                age: Number(formData.age),
                height: Number(formData.height),
                current_weight: Number(formData.current_weight),
                target_weight: Number(formData.target_weight),
                training_days: Number(formData.training_days)
            };

            db.saveUser(payload);
            router.push('/dashboard');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-fighter-background)] py-12 px-6 relative overflow-x-hidden">
            {/* Background Light Effects */}
            <div className="absolute top-[-5%] right-[-10%] w-[400px] h-[400px] bg-[var(--color-fighter-red)]/10 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex flex-col items-center mb-10 relative z-10"
            >
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-fighter-surface)] to-black rounded-2xl flex items-center justify-center shadow-2xl mb-6 border border-white/10 relative group">
                    <Zap className="w-8 h-8 text-[var(--color-fighter-red)] fill-[var(--color-fighter-red)]" />
                </div>
                <h1 className="text-3xl font-black tracking-tighter text-white mb-2 italic uppercase">Únete al <span className="text-[var(--color-fighter-red)]">Campamento</span></h1>
                <p className="text-[9px] text-gray-500 font-black tracking-[0.3em] uppercase">Comienza tu transformación elite</p>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="w-full max-w-md mx-auto relative z-10"
            >
                <form onSubmit={handleRegister} className="space-y-6 pb-12 text-white">

                    {/* SECTION: IDENTITY */}
                    <div className="fighter-card !bg-transparent glass-panel border-white/5 space-y-4">
                        <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-3">
                            <User className="w-4 h-4 text-[var(--color-fighter-red)]" />
                            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Identidad del Peleador</h2>
                        </div>

                        <div className="space-y-4">
                            <input
                                name="name" type="text" required placeholder="Nombre de Guerra"
                                onChange={handleInputChange} value={formData.name}
                                className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-4 outline-none focus:ring-1 focus:ring-[var(--color-fighter-red)] transition-all font-medium"
                            />
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <input
                                    name="email" type="email" required placeholder="Email de contacto"
                                    onChange={handleInputChange} value={formData.email}
                                    className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-4 outline-none focus:ring-1 focus:ring-[var(--color-fighter-red)] transition-all font-medium"
                                />
                                <input
                                    name="password" type="password" required placeholder="Contraseña segura"
                                    onChange={handleInputChange} value={formData.password}
                                    className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-4 outline-none focus:ring-1 focus:ring-[var(--color-fighter-red)] transition-all font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECTION: BIOMETRICS */}
                    <div className="fighter-card !bg-transparent glass-panel border-white/5 space-y-4">
                        <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-3">
                            <Shield className="w-4 h-4 text-blue-400" />
                            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Biometría y Perfil Antropométrico</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Edad</label>
                                <input name="age" type="number" required placeholder="Años" onChange={handleInputChange} value={formData.age} className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-4 outline-none focus:ring-1 focus:ring-blue-500" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Género</label>
                                <select name="gender" onChange={handleInputChange} value={formData.gender} className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-4 outline-none appearance-none font-bold">
                                    <option value="M">Masculino</option>
                                    <option value="F">Femenino</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Estatura (cm)</label>
                                <input name="height" type="number" step="any" required placeholder="175" onChange={handleInputChange} value={formData.height} className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-4 outline-none focus:ring-1 focus:ring-blue-500" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Peso Actual (kg)</label>
                                <input name="current_weight" type="number" step="any" required placeholder="80.0" onChange={handleInputChange} value={formData.current_weight} className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-4 outline-none focus:ring-1 focus:ring-blue-500 font-black" />
                            </div>
                        </div>

                        <div className="space-y-1 relative">
                            <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Objetivo del Campamento (kg)</label>
                            <input name="target_weight" type="number" step="any" required placeholder="Peso meta" onChange={handleInputChange} value={formData.target_weight} className="w-full bg-white/5 border-2 border-emerald-500/20 text-emerald-400 text-lg font-black rounded-xl px-4 py-4 outline-none text-center focus:border-emerald-500 transition-all" />
                            <Target className="absolute right-4 bottom-4 w-5 h-5 text-emerald-500/30" />
                        </div>
                    </div>

                    {/* SECTION: TRAINING */}
                    <div className="fighter-card !bg-transparent glass-panel border-white/5 space-y-4">
                        <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-3">
                            <Dumbbell className="w-4 h-4 text-purple-400" />
                            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Régimen de Entrenamiento</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Nivel de Actividad Diaria</label>
                                <select name="activity_level" onChange={handleInputChange} value={formData.activity_level} className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-4 outline-none appearance-none font-bold">
                                    <option value="light">Ligero / Sedentario</option>
                                    <option value="moderate">Moderado (2-3 días)</option>
                                    <option value="active">Activo (4-5 días)</option>
                                    <option value="fighter">Peleador / Competidor</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Especialidad de Combate</label>
                                <select name="training_type" onChange={handleInputChange} value={formData.training_type} className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-4 outline-none appearance-none font-bold">
                                    <option value="jiu-jitsu">Jiu-Jitsu / BJJ</option>
                                    <option value="mma">Artes Marciales Mixtas</option>
                                    <option value="boxeo">Boxeo / Muay Thai</option>
                                    <option value="fuerza">Fuerza y Potencia</option>
                                    <option value="hibrido">Entrenamiento Híbrido</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="text-[10px] font-black text-[var(--color-fighter-red)] uppercase text-center bg-red-500/10 py-4 rounded-xl border border-red-500/20 italic">
                            Error: {error}
                        </div>
                    )}

                    <button
                        type="submit" disabled={loading}
                        className="fighter-btn-primary w-full py-5 text-sm tracking-[0.2em] flex justify-center items-center gap-3 active:scale-95 shadow-[0_10px_30px_rgba(225,29,72,0.3)]"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                COMENZAR PREPARACIÓN
                                <ChevronRight className="w-5 h-5" />
                            </>
                        )}
                    </button>

                    <div className="text-center">
                        <Link href="/login" className="group">
                            <p className="text-xs font-bold text-gray-500 hover:text-white transition-colors">
                                ¿Ya tienes acceso? <span className="text-[var(--color-fighter-red)] group-hover:underline underline-offset-4">Inicia Sesión</span>
                            </p>
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
