"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Lock, ChevronRight, Activity } from 'lucide-react';

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
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Error al iniciar sesión');
            }

            // Guardar token y usuario
            localStorage.setItem('fighterToken', data.token);
            localStorage.setItem('fighterUser', JSON.stringify(data.user));

            router.push('/dashboard');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--color-fighter-bg)]">

            {/* Header Logo */}
            <div className="flex flex-col items-center mb-10">
                <div className="w-16 h-16 bg-[var(--color-fighter-surface)] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(225,29,72,0.15)] mb-4 border border-[var(--color-fighter-surface-hover)]">
                    <Activity className="w-8 h-8 text-[var(--color-fighter-red)]" />
                </div>
                <h1 className="text-3xl font-black tracking-tight text-white mb-1">FighterFast</h1>
                <p className="text-sm text-gray-400 font-medium tracking-wide uppercase">Modo Peleador</p>
            </div>

            {/* Login Form */}
            <div className="w-full max-w-sm">
                <form onSubmit={handleLogin} className="space-y-4">

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <User className="w-5 h-5 text-gray-500" />
                        </div>
                        <input
                            type="email"
                            required
                            className="w-full bg-[var(--color-fighter-surface)] border border-[var(--color-fighter-surface-hover)] text-white text-sm rounded-xl focus:ring-1 focus:ring-[var(--color-fighter-red)] focus:border-[var(--color-fighter-red)] block px-11 py-4 outline-none transition-all placeholder-gray-500"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <Lock className="w-5 h-5 text-gray-500" />
                        </div>
                        <input
                            type="password"
                            required
                            className="w-full bg-[var(--color-fighter-surface)] border border-[var(--color-fighter-surface-hover)] text-white text-sm rounded-xl focus:ring-1 focus:ring-[var(--color-fighter-red)] focus:border-[var(--color-fighter-red)] block px-11 py-4 outline-none transition-all placeholder-gray-500"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && (
                        <p className="text-[var(--color-fighter-red)] text-sm font-medium text-center bg-[var(--color-fighter-surface)] py-2 rounded-lg border border-red-900/30">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full text-white bg-[var(--color-fighter-red)] hover:bg-[var(--color-fighter-red-dark)] focus:ring-4 focus:outline-none focus:ring-red-900 font-bold rounded-xl text-sm px-5 py-4 text-center tracking-wide mt-6 flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Entrando...' : 'INICIAR SESIÓN'}
                        {!loading && <ChevronRight className="w-5 h-5" />}
                    </button>
                </form>

                <div className="mt-8 text-center flex flex-col gap-3">
                    <Link href="/register" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                        ¿No tienes cuenta? <span className="text-[var(--color-fighter-red)]">Regístrate</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
