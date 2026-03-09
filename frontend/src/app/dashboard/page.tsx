"use client";
import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import { API_URL } from '@/utils/config';

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [macros, setMacros] = useState<any>(null);

    // Fasting UI State
    const [isFasting, setIsFasting] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const storedUser = localStorage.getItem('fighterUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        fetchMacrosData();
    }, []);

    const fetchMacrosData = async () => {
        try {
            const token = localStorage.getItem('fighterToken');

            // Traer Macros
            const resMacros = await fetch(`${API_URL}/api/nutrition/calculate`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (resMacros.ok) {
                const data = await resMacros.json();
                setMacros(data);
            }

            // Traer Ayuno Activo
            const resFast = await fetch(`${API_URL}/api/fasts/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (resFast.ok) {
                const fastData = await resFast.json();
                if (fastData.active) {
                    setIsFasting(true);
                    // Lógica para setear progreso según start_time omitida por brevedad
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleStartFast = async () => {
        try {
            const token = localStorage.getItem('fighterToken');
            const res = await fetch(`${API_URL}/api/fasts/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ target_hours: 16 })
            });
            if (res.ok) {
                setIsFasting(true);
            }
        } catch (err) { console.error(err); }
    };

    const handleStopFast = async () => {
        try {
            const token = localStorage.getItem('fighterToken');
            await fetch(`${API_URL}/api/fasts/stop`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setIsFasting(false);
            setProgress(0);
        } catch (err) { console.error(err); }
    };

    const circumference = 2 * Math.PI * 120; // 120 is the radius

    return (
        <div className="p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-8 pt-4">
                <div>
                    <h1 className="text-2xl font-black tracking-tight">Hola, {user?.name?.split(' ')[0] || 'Atleta'}</h1>
                    <p className="text-sm font-medium text-gray-400">Objetivo: {user?.target_weight} kg</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-[var(--color-fighter-surface)] border border-[var(--color-fighter-surface-hover)] flex justify-center items-center">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}&backgroundColor=transparent`} alt="Avatar" className="w-8 h-8 rounded-full" />
                </div>
            </div>

            {/* Timer Section */}
            <div className="flex flex-col items-center justify-center mb-10">
                <div className="relative w-72 h-72 flex items-center justify-center">

                    {/* Background Circle SVG */}
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                        <circle
                            cx="144" cy="144" r="120"
                            stroke="var(--color-fighter-surface-hover)" strokeWidth="12" fill="none"
                        />
                        <circle
                            cx="144" cy="144" r="120"
                            stroke={isFasting ? "var(--color-fighter-green)" : "var(--color-fighter-red)"}
                            strokeWidth="12" fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={circumference - (progress / 100) * circumference}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-in-out"
                        />
                    </svg>

                    {/* Inner Content */}
                    <div className="z-10 flex flex-col items-center text-center">
                        {isFasting ? (
                            <>
                                <p className="text-gray-400 text-sm font-bold tracking-widest uppercase mb-1">Restante</p>
                                <p className="text-5xl font-black tracking-tighter mb-2">14:59:02</p>
                                <p className="text-[var(--color-fighter-green)] text-xs font-bold bg-green-900/20 px-3 py-1 rounded-full">EN AYUNO (16:8)</p>
                            </>
                        ) : (
                            <>
                                <p className="text-gray-400 text-sm font-bold tracking-widest uppercase mb-2">Comiendo</p>
                                <p className="text-4xl font-black tracking-tighter mb-4 text-gray-300">LISTO</p>
                                <button
                                    onClick={handleStartFast}
                                    className="bg-[var(--color-fighter-red)] hover:bg-[var(--color-fighter-red-dark)] text-white font-bold rounded-full w-14 h-14 flex items-center justify-center shadow-[0_0_20px_rgba(225,29,72,0.4)] transition-all"
                                >
                                    <Play className="w-6 h-6 ml-1 filter drop-shadow-md" />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {isFasting && (
                    <button
                        onClick={handleStopFast}
                        className="mt-6 text-sm font-bold border border-[var(--color-fighter-surface-hover)] bg-[var(--color-fighter-surface)] px-6 py-2 rounded-full text-gray-300 hover:text-white transition-colors"
                    >
                        FINALIZAR AYUNO
                    </button>
                )}
            </div>

            {/* Macros Section */}
            <h2 className="text-lg font-bold mb-4">Nutrición del Día</h2>

            {macros ? (
                <div className="grid grid-cols-2 gap-4">

                    <div className="col-span-2 bg-[var(--color-fighter-surface)] p-5 rounded-2xl border border-[var(--color-fighter-surface-hover)] flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400 font-medium">Calorías Restantes</p>
                            <p className="text-3xl font-black text-white">{macros.metrics.target_calories}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">TMB</p>
                            <p className="text-sm font-bold text-gray-300">{macros.metrics.tmb} kcal</p>
                        </div>
                    </div>

                    <div className="bg-[var(--color-fighter-surface)] p-4 rounded-xl border border-[var(--color-fighter-surface-hover)] border-t-2 border-t-blue-500">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Proteína</p>
                        <p className="text-xl font-black text-white">0 / {macros.macros.protein_grams}g</p>
                    </div>

                    <div className="bg-[var(--color-fighter-surface)] p-4 rounded-xl border border-[var(--color-fighter-surface-hover)] border-t-2 border-t-yellow-500">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Grasas</p>
                        <p className="text-xl font-black text-white">0 / {macros.macros.fat_grams}g</p>
                    </div>

                    <div className="col-span-2 bg-[var(--color-fighter-surface)] p-4 rounded-xl border border-[var(--color-fighter-surface-hover)] border-t-2 border-t-green-500">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Carbohidratos</p>
                        <p className="text-xl font-black text-white">0 / {macros.macros.carbs_grams}g</p>
                    </div>

                </div>
            ) : (
                <div className="animate-pulse bg-[var(--color-fighter-surface)] h-32 rounded-2xl border border-[var(--color-fighter-surface-hover)] flex items-center justify-center">
                    <p className="text-sm font-bold text-gray-500">Calculando métricas...</p>
                </div>
            )}
        </div>
    );
}
