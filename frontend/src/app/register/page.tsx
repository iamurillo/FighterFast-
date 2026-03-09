"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Activity, User, Lock, Mail, ChevronRight } from 'lucide-react';
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
        activity_level: 'active',
        training_type: 'gym',
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

            // Guardar usuario en localStorage
            db.saveUser(payload);

            router.push('/dashboard');

            router.push('/dashboard');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center py-10 px-6 bg-[var(--color-fighter-bg)]">
            <div className="flex flex-col items-center mb-8">
                <div className="w-14 h-14 bg-[var(--color-fighter-surface)] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(225,29,72,0.15)] mb-3 border border-[var(--color-fighter-surface-hover)]">
                    <Activity className="w-7 h-7 text-[var(--color-fighter-red)]" />
                </div>
                <h1 className="text-2xl font-black tracking-tight text-white mb-1">Únete a FighterFast</h1>
            </div>

            <div className="w-full max-w-sm">
                <form onSubmit={handleRegister} className="space-y-4">

                    {/* Datos Personales */}
                    <div className="bg-[var(--color-fighter-surface)] p-4 rounded-xl border border-[var(--color-fighter-surface-hover)] space-y-3">
                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Cuenta</h2>

                        <input
                            name="name" type="text" required placeholder="Nombre completo"
                            onChange={handleInputChange} value={formData.name}
                            className="w-full bg-black/50 border border-transparent text-white text-sm rounded-lg focus:ring-1 focus:ring-[var(--color-fighter-red)] block px-4 py-3 outline-none"
                        />

                        <input
                            name="email" type="email" required placeholder="Correo electrónico"
                            onChange={handleInputChange} value={formData.email}
                            className="w-full bg-black/50 border border-transparent text-white text-sm rounded-lg focus:ring-1 focus:ring-[var(--color-fighter-red)] block px-4 py-3 outline-none"
                        />

                        <input
                            name="password" type="password" required placeholder="Contraseña segura"
                            onChange={handleInputChange} value={formData.password}
                            className="w-full bg-black/50 border border-transparent text-white text-sm rounded-lg focus:ring-1 focus:ring-[var(--color-fighter-red)] block px-4 py-3 outline-none"
                        />
                    </div>

                    {/* Físico */}
                    <div className="bg-[var(--color-fighter-surface)] p-4 rounded-xl border border-[var(--color-fighter-surface-hover)] space-y-3">
                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Biometría</h2>

                        <div className="grid grid-cols-2 gap-3">
                            <input name="age" type="number" required placeholder="Edad" onChange={handleInputChange} value={formData.age} className="bg-black/50 text-white text-sm rounded-lg block px-4 py-3 outline-none" />
                            <select name="gender" onChange={handleInputChange} value={formData.gender} className="bg-black/50 text-white text-sm rounded-lg block px-4 py-3 outline-none">
                                <option value="M">Hombre</option>
                                <option value="F">Mujer</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <input name="height" type="number" step="any" required placeholder="Altura (cm)" onChange={handleInputChange} value={formData.height} className="bg-black/50 text-white text-sm rounded-lg block px-4 py-3 outline-none" />
                            <input name="current_weight" type="number" step="any" required placeholder="Peso actual (kg)" onChange={handleInputChange} value={formData.current_weight} className="bg-black/50 text-white text-sm rounded-lg block px-4 py-3 outline-none" />
                        </div>

                        <input name="target_weight" type="number" step="any" required placeholder="Peso objetivo (kg)" onChange={handleInputChange} value={formData.target_weight} className="w-full bg-black/50 text-white text-sm rounded-lg block px-4 py-3 outline-none text-center border-b-2 border-b-[var(--color-fighter-green)]" />
                    </div>

                    {/* Entrenamiento */}
                    <div className="bg-[var(--color-fighter-surface)] p-4 rounded-xl border border-[var(--color-fighter-surface-hover)] space-y-3">
                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Entrenamiento</h2>

                        <select name="activity_level" onChange={handleInputChange} value={formData.activity_level} className="w-full bg-black/50 text-white text-sm rounded-lg block px-4 py-3 outline-none">
                            <option value="light">Ligero / Sedentario</option>
                            <option value="moderate">Moderado (2-3 días)</option>
                            <option value="active">Activo (4-5 días)</option>
                            <option value="fighter">Peleador / Extremo</option>
                        </select>

                        <select name="training_type" onChange={handleInputChange} value={formData.training_type} className="w-full bg-black/50 text-white text-sm rounded-lg block px-4 py-3 outline-none">
                            <option value="gym">Gimnasio / Pesas</option>
                            <option value="jiu-jitsu">Jiu-Jitsu / Grappling</option>
                            <option value="box">Boxeo / Striking</option>
                            <option value="crossfit">Crossfit</option>
                            <option value="running">Running / Cardio</option>
                        </select>
                    </div>

                    {error && <p className="text-[var(--color-fighter-red)] text-sm font-medium text-center">{error}</p>}

                    <button
                        type="submit" disabled={loading}
                        className="w-full text-white bg-[var(--color-fighter-red)] hover:bg-[var(--color-fighter-red-dark)] font-bold rounded-xl text-sm px-5 py-4 mt-6 flex justify-center items-center gap-2"
                    >
                        {loading ? 'CREANDO CUENTA...' : 'COMENZAR LA PREPARACIÓN'}
                    </button>
                </form>

                <div className="mt-6 text-center pb-8">
                    <Link href="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                        ¿Ya tienes cuenta? <span className="text-[var(--color-fighter-red)]">Inicia sesión</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
