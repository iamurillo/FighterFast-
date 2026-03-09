"use client";
import React, { useState, useEffect } from 'react';
import { Play, Droplet, Plus, Zap, TrendingUp, Trophy } from 'lucide-react';
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
            fetchData(storedUser);
        }
    }, []);

    const fetchData = (currentUser?: any) => {
        const activeUser = currentUser || user;
        if (!activeUser) return;

        // Macros y Consumo
        const calculatedMacros = db.calculateMacros(activeUser);
        const { summary } = db.getDailyMeals();

        if (calculatedMacros) {
            setMacros({
                target: calculatedMacros,
                current: summary
            });
        }

        // Agua
        setWater(db.getDailyWater());

        // Ayuno
        const fastState = db.getFastState();
        if (fastState && fastState.active) {
            setIsFasting(true);
            calculateFastProgress(fastState.startTime, fastState.duration);
        }
    };

    const calculateFastProgress = (startTime: number, durationHours: number) => {
        const now = Date.now();
        const elapsed = now - startTime;
        const total = durationHours * 60 * 60 * 1000;
        const p = Math.min((elapsed / total) * 100, 100);
        setProgress(p);
    };

    const handleStartFast = () => {
        db.startFast(16);
        setIsFasting(true);
        setProgress(0);
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

    const circumference = 2 * Math.PI * 120;
    const waterGoal = 3500;
    const waterProgress = Math.min(Math.round((water / waterGoal) * 100), 100);

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="p-6 pb-24 max-w-md mx-auto"
        >
            {/* Header Premium */}
            <motion.div
                initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                className="flex justify-between items-center mb-10 pt-4"
            >
                <div className="flex flex-col">
                    <span className="text-[var(--color-fighter-red)] text-[10px] font-black uppercase tracking-[0.2em] mb-1">Elite Performance</span>
                    <h1 className="text-3xl font-black text-white leading-none">Hola, {user?.name?.split(' ')[0] || 'Atleta'}</h1>
                </div>
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-fighter-red)] to-orange-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                    <div className="relative w-12 h-12 rounded-full bg-[var(--color-fighter-surface)] border border-white/10 flex justify-center items-center overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}&backgroundColor=transparent`} alt="Avatar" className="w-10 h-10" />
                    </div>
                </div>
            </motion.div>

            {/* Fasting Circular Timer */}
            <div className="flex flex-col items-center justify-center mb-12">
                <div className="relative w-80 h-80 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90 scale-110">
                        <circle
                            cx="144" cy="144" r="120"
                            stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="none"
                            className="transform translate-x-[16px] translate-y-[16px]"
                        />
                        <motion.circle
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: circumference - (progress / 100) * circumference }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            cx="144" cy="144" r="120"
                            stroke={isFasting ? "#10B981" : "var(--color-fighter-red)"}
                            strokeWidth="10" fill="none"
                            strokeDasharray={circumference}
                            strokeLinecap="round"
                            className="transform translate-x-[16px] translate-y-[16px] drop-shadow-[0_0_8px_rgba(225,29,72,0.3)]"
                        />
                    </svg>

                    <div className="z-10 flex flex-col items-center">
                        <AnimatePresence mode="wait">
                            {isFasting ? (
                                <motion.div
                                    key="fasting"
                                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                                    className="flex flex-col items-center"
                                >
                                    <Zap className="w-6 h-6 text-emerald-400 mb-2 animate-pulse" />
                                    <p className="text-5xl font-black text-white tracking-tighter mb-1">14:59:02</p>
                                    <p className="text-[10px] font-black text-emerald-400 tracking-[0.3em] uppercase">Estado: Autofagia</p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="eating"
                                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                                    className="flex flex-col items-center"
                                >
                                    <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-4">Ventana de Alimentación</p>
                                    <button
                                        onClick={handleStartFast}
                                        className="fighter-btn-primary w-20 h-20 !rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(225,29,72,0.3)]"
                                    >
                                        <Play className="w-8 h-8 ml-1 fill-white" />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {isFasting && (
                    <button
                        onClick={handleStopFast}
                        className="mt-6 text-[10px] font-black tracking-widest border border-white/10 bg-white/5 px-8 py-3 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all uppercase"
                    >
                        Terminar Ayuno
                    </button>
                )}
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-12">
                <div className="fighter-card relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">Peso Actual</p>
                    <p className="text-3xl font-black text-white">{user?.current_weight || '--'} <span className="text-sm font-normal text-gray-500">kg</span></p>
                    <div className="w-12 h-1 bg-[var(--color-fighter-red)] mt-3 rounded-full"></div>
                </div>
                <div className="fighter-card relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Trophy className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">Grasa Corporal</p>
                    <p className="text-3xl font-black text-white">{user?.body_fat || '--'} <span className="text-sm font-normal text-gray-500">%</span></p>
                    <div className="w-12 h-1 bg-emerald-500 mt-3 rounded-full"></div>
                </div>
            </div>

            {/* Nutrition Glass Banner */}
            <div className="mb-12">
                <div className="flex justify-between items-end mb-4">
                    <h2 className="text-xl font-black text-white">Nutrición de Hoy</h2>
                    <span className="text-xs font-bold text-gray-500">{macros?.current?.calories || 0} / {macros?.target?.calories || 2000} kcal</span>
                </div>

                <div className="fighter-card !bg-transparent glass-panel backdrop-blur-xl border-white/5">
                    <div className="grid grid-cols-3 gap-6">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-red-400 uppercase tracking-tighter mb-1">Proteína</span>
                            <div className="flex items-end gap-1">
                                <span className="text-lg font-black text-white leading-none">{macros?.current?.protein || 0}g</span>
                                <span className="text-[10px] text-gray-500 mb-0.5">/ {macros?.target?.protein || 0}g</span>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-tighter mb-1">Carbos</span>
                            <div className="flex items-end gap-1">
                                <span className="text-lg font-black text-white leading-none">{macros?.current?.carbs || 0}g</span>
                                <span className="text-[10px] text-gray-500 mb-0.5">/ {macros?.target?.carbs || 0}g</span>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-tighter mb-1">Grasas</span>
                            <div className="flex items-end gap-1">
                                <span className="text-lg font-black text-white leading-none">{macros?.current?.fats || 0}g</span>
                                <span className="text-[10px] text-gray-500 mb-0.5">/ {macros?.target?.fats || 0}g</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Water Tracker */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-black text-white">Hidratación</h2>
                    <div className="flex items-center gap-2 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20">
                        <Droplet className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
                        <span className="text-[10px] font-black text-blue-400 uppercase">{waterProgress}%</span>
                    </div>
                </div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="fighter-card relative overflow-hidden group border-blue-500/10"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent pointer-events-none" />
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
                                <Droplet className={`w-7 h-7 ${waterProgress > 0 ? 'text-blue-400 fill-blue-400 animate-pulse' : 'text-blue-400'}`} />
                            </div>
                            <div>
                                <p className="text-3xl font-black text-white leading-none">{water} <span className="text-xs font-normal text-gray-500 uppercase">ml</span></p>
                                <p className="text-[10px] font-black text-gray-500 uppercase mt-1">Objetivo: 3500ml</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleAddWater(250)}
                                className="w-12 h-12 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 flex items-center justify-center transition-all active:scale-90"
                            >
                                <Plus className="w-6 h-6 text-blue-400" />
                            </button>
                        </div>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full mt-6 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${waterProgress}%` }}
                            className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                        />
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
