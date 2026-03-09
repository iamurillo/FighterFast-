"use client";
import React, { useState, useEffect } from 'react';
import { Play, Droplet, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/utils/storage';

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [macros, setMacros] = useState<any>(null);
    const [water, setWater] = useState(0);

    // Fasting UI State
    const [isFasting, setIsFasting] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const storedUser = db.getUser();
        if (storedUser) {
            setUser(storedUser);
            fetchMacrosData(storedUser);
            setWater(db.getDailyWater());
        }
    }, []);

    const fetchMacrosData = (currentUser?: any) => {
        const activeUser = currentUser || user;
        if (!activeUser) return;

        // Traer Macros localmente
        const calculatedMacros = db.calculateMacros(activeUser);

        // Calcular lo consumido vs lo objetivo
        const { summary } = db.getDailyMeals();

        if (calculatedMacros) {
            setMacros({
                ...calculatedMacros,
                summary // Consumo real del día
            });
        }

        // Traer Ayuno Activo
        const fastState = db.getFastState();
        if (fastState && fastState.active) {
            setIsFasting(true);
            // Lógica para progreso omitida
        }
    };

    const handleStartFast = () => {
        db.startFast(16);
        setIsFasting(true);
    };

    const handleStopFast = () => {
        db.stopFast();
        setIsFasting(false);
        setProgress(0);
    };

    const handleAddWater = (amount: number) => {
        const newTotal = db.addWater(amount);
        setWater(newTotal);
    };

    const circumference = 2 * Math.PI * 120; // 120 is the radius

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="p-6 pb-24"
        >

            {/* Header */}
            <motion.div
                initial={{ y: -20 }} animate={{ y: 0 }}
                className="flex justify-between items-center mb-8 pt-4"
            >
                <div>
                    <h1 className="text-2xl font-black tracking-tight">Hola, {user?.name?.split(' ')[0] || 'Atleta'}</h1>
                    <p className="text-sm font-medium text-gray-400">Objetivo: {user?.target_weight} kg</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-[var(--color-fighter-surface)] border border-[var(--color-fighter-surface-hover)] flex justify-center items-center overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}&backgroundColor=transparent`} alt="Avatar" className="w-8 h-8 rounded-full" />
                </div>
            </motion.div>

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
                        <p className="text-xl font-black text-white">{macros.summary?.protein || 0} / {macros.macros.protein_grams}g</p>
                    </div>

                    <div className="bg-[var(--color-fighter-surface)] p-4 rounded-xl border border-[var(--color-fighter-surface-hover)] border-t-2 border-t-yellow-500">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Grasas</p>
                        <p className="text-xl font-black text-white">{macros.summary?.fats || 0} / {macros.macros.fat_grams}g</p>
                    </div>

                    <div className="col-span-2 bg-[var(--color-fighter-surface)] p-4 rounded-xl border border-[var(--color-fighter-surface-hover)] border-t-2 border-t-green-500">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Carbohidratos</p>
                        <p className="text-xl font-black text-white">{macros.summary?.carbs || 0} / {macros.macros.carbs_grams}g</p>
                    </div>

                </div>
            ) : (
                <div className="animate-pulse bg-[var(--color-fighter-surface)] h-32 rounded-2xl border border-[var(--color-fighter-surface-hover)] flex items-center justify-center">
                    <p className="text-sm font-bold text-gray-500">Calculando métricas...</p>
                </div>
            )}

            {/* Water Tracker Section */}
            <h2 className="text-lg font-bold mb-4 mt-10">Hidratación (Agua)</h2>
            <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-[var(--color-fighter-surface)] p-5 rounded-2xl border border-[var(--color-fighter-surface-hover)]"
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Droplet className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Total Consumido</p>
                            <p className="text-2xl font-black text-white">{water} <span className="text-xs text-gray-500">ml</span></p>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-black/50 rounded-full h-3.5 mb-5 relative overflow-hidden border border-[var(--color-fighter-surface-hover)]">
                    <div className="bg-blue-500 h-3.5 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${Math.min((water / 3500) * 100, 100)}%` }}></div>
                </div>

                <p className="text-xs text-center text-gray-500 font-medium mb-4">
                    Objetivo mínimo: 3500 ml
                </p>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => handleAddWater(250)}
                        className="flex items-center justify-center gap-2 bg-[var(--color-fighter-surface-hover)] hover:bg-black/50 border border-[var(--color-fighter-surface-hover)] p-3 rounded-xl transition-colors">
                        <Plus className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-bold text-gray-300">250 ml</span>
                    </button>
                    <button
                        onClick={() => handleAddWater(500)}
                        className="flex items-center justify-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 p-3 rounded-xl transition-colors">
                        <Plus className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-bold text-blue-400">500 ml</span>
                    </button>
                </div>
            </motion.div>

        </motion.div>
    );
}
