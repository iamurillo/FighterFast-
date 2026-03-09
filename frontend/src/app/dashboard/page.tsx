"use client";
import React, { useState, useEffect } from 'react';
import { Play, Droplet, Plus, Zap, TrendingUp, Trophy, Utensils, ChevronRight, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/utils/storage';

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [macros, setMacros] = useState<any>(null);
    const [water, setWater] = useState(0);
    const [rank, setRank] = useState<any>(null);
    const [streak, setStreak] = useState(0);
    const [quote, setQuote] = useState("");

    // Fasting UI State
    const [isFasting, setIsFasting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [targetHours, setTargetHours] = useState(16);

    useEffect(() => {
        const storedUser = db.getUser();
        if (storedUser) {
            setUser(storedUser);
            fetchData(storedUser);
        }
        setRank(db.getFighterRank());
        setStreak(db.getTrainingStreak());
        setQuote(db.getWarriorQuote());
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
            setTargetHours(fastState.target_hours);
            calculateFastProgress(fastState.start_time, fastState.target_hours);
        }
    };

    const calculateFastProgress = (startTimeStr: string, durationHours: number) => {
        const startTime = new Date(startTimeStr).getTime();
        const now = Date.now();
        const elapsed = now - startTime;
        const total = durationHours * 60 * 60 * 1000;
        const p = Math.min((elapsed / total) * 100, 100);
        setProgress(p);
    };

    const handleStartFast = () => {
        db.startFast(targetHours);
        setIsFasting(true);
        setProgress(0);
        fetchData();
    };

    const handleStopFast = () => {
        db.stopFast();
        setIsFasting(false);
        setProgress(0);
        fetchData();
    };

    const handleAddWater = (amount: number) => {
        const newTotal = db.addWater(amount);
        setWater(newTotal);
    };

    const handleSubtractWater = (amount: number) => {
        const newTotal = db.subtractWater(amount);
        setWater(newTotal);
    };

    const circumference = 2 * Math.PI * 120;
    const waterGoal = 3500;
    const waterProgress = Math.min(Math.round((water / waterGoal) * 100), 100);

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="p-6 pb-32 max-w-md mx-auto"
        >
            {/* Warrior Quote Context */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="mb-8 pt-4 px-4 py-3 bg-[var(--color-fighter-red)]/5 border-l-2 border-[var(--color-fighter-red)] rounded-r-xl"
            >
                <p className="text-[10px] font-black italic text-gray-400 uppercase tracking-widest leading-relaxed">
                    "{quote}"
                </p>
            </motion.div>

            {/* Header Premium */}
            <motion.div
                initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                className="flex justify-between items-center mb-10"
            >
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[var(--color-fighter-red)] text-[10px] font-black uppercase tracking-[0.2em]">Elite Performance</span>
                        {streak > 0 && (
                            <div className="flex items-center gap-1 bg-orange-500/20 px-2 py-0.5 rounded-full border border-orange-500/30">
                                <Zap className="w-2.5 h-2.5 text-orange-500 fill-orange-500" />
                                <span className="text-[8px] font-black text-orange-500">{streak} DÍAS</span>
                            </div>
                        )}
                    </div>
                    <h1 className="text-3xl font-black text-white leading-none">Hola, {user?.name?.split(' ')[0] || 'Atleta'}</h1>
                </div>
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-fighter-red)] to-orange-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                    <div className="relative w-12 h-12 rounded-full bg-[var(--color-fighter-surface)] border border-white/10 flex justify-center items-center overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.avatar_seed || user?.name}&backgroundColor=transparent`} alt="Avatar" className="w-10 h-10" />
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
                                    <p className="text-5xl font-black text-white tracking-tighter mb-1">
                                        {Math.floor((progress * targetHours / 100))}:{((progress * targetHours / 100) % 1 * 60).toFixed(0).padStart(2, '0')}:02
                                    </p>
                                    <p className="text-[10px] font-black text-emerald-400 tracking-[0.3em] uppercase">Meta: {targetHours}H</p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="eating"
                                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                                    className="flex flex-col items-center"
                                >
                                    <div className="flex gap-2 mb-4">
                                        {[16, 18, 20].map(h => (
                                            <button
                                                key={h}
                                                onClick={() => setTargetHours(h)}
                                                className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${targetHours === h ? 'bg-[var(--color-fighter-red)] text-white' : 'bg-white/5 text-gray-500 hover:text-white'}`}
                                            >
                                                {h}H
                                            </button>
                                        ))}
                                    </div>
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

            {/* Quick Stats Grid with Belt Rank */}
            <div className="grid grid-cols-2 gap-4 mb-12">
                <div
                    className="fighter-card relative overflow-hidden group border-white/10"
                    style={{ backgroundColor: rank?.bg ? `${rank.bg}22` : 'transparent' }}
                >
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Trophy className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">Rango Actual</p>
                    <div className="flex items-center gap-2">
                        <p className="text-xl font-black text-white italic uppercase tracking-tighter">{rank?.name || 'Iniciando'}</p>
                    </div>
                    <div
                        className="w-full h-2 mt-3 rounded-full overflow-hidden flex"
                        style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                        <div className="h-full w-3/4" style={{ backgroundColor: rank?.bg || '#F3F4F6' }}></div>
                        <div className="h-full w-1/4 bg-black"></div>
                    </div>
                </div>
                <div className="fighter-card relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">Peso</p>
                    <p className="text-3xl font-black text-white">{user?.current_weight || '--'} <span className="text-sm font-normal text-gray-500">kg</span></p>
                    <div className="w-12 h-1 bg-[var(--color-fighter-red)] mt-3 rounded-full"></div>
                </div>
            </div>

            {/* Nutrition Glass Banner */}
            <motion.div
                whileHover={{ y: -5 }}
                className="fighter-card mb-12 border-emerald-500/20 bg-emerald-500/5 group"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                            <Utensils className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Consumo Diario</p>
                            <h2 className="text-lg font-black text-white italic uppercase tracking-tighter">Plan Nutricional</h2>
                        </div>
                    </div>
                    <button className="text-emerald-400 group-hover:translate-x-1 transition-transform">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <div>
                        <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1.5 opacity-60 text-center">Proteína</p>
                        <div className="text-center">
                            <span className="text-base font-black text-white leading-none">{macros?.current?.protein || 0}</span>
                            <span className="text-[10px] text-gray-600 block">/ {macros?.target?.macros?.protein_grams || 0}g</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1.5 opacity-60 text-center">Carbs</p>
                        <div className="text-center">
                            <span className="text-base font-black text-white leading-none">{macros?.current?.carbs || 0}</span>
                            <span className="text-[10px] text-gray-600 block">/ {macros?.target?.macros?.carbs_grams || 0}g</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1.5 opacity-60 text-center">Grasas</p>
                        <div className="text-center">
                            <span className="text-base font-black text-white leading-none">{macros?.current?.fats || 0}</span>
                            <span className="text-[10px] text-gray-600 block">/ {macros?.target?.macros?.fat_grams || 0}g</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Water Tracker Advanced */}
            <div className="fighter-card border-blue-500/20 bg-blue-500/5 relative overflow-hidden mb-12">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Droplet className="w-20 h-20 text-blue-500" />
                </div>

                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
                            <Droplet className="w-5 h-5 text-blue-400" />
                        </div>
                        <h2 className="text-lg font-black text-white italic uppercase tracking-tighter">Hidratación</h2>
                    </div>
                    <div className="bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{waterProgress}%</span>
                    </div>
                </div>

                <div className="flex flex-col items-center mb-8">
                    <p className="text-5xl font-black text-white italic tracking-tighter leading-none mb-1">{(water / 1000).toFixed(1)} <span className="text-lg font-normal text-gray-500 not-italic">L</span></p>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Meta: 3.5L</p>
                </div>

                <div className="grid grid-cols-4 gap-2 relative z-10">
                    <button
                        onClick={() => handleSubtractWater(250)}
                        className="bg-red-500/10 border border-red-500/20 h-10 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-all font-black text-lg"
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleAddWater(250)}
                        className="bg-white/5 border border-white/10 h-10 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all text-[10px] font-black"
                    >
                        +250ml
                    </button>
                    <button
                        onClick={() => handleAddWater(500)}
                        className="bg-white/5 border border-white/10 h-10 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all text-[10px] font-black"
                    >
                        +500ml
                    </button>
                    <button
                        onClick={() => handleAddWater(1000)}
                        className="bg-blue-500 text-white h-10 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 text-[10px] font-black"
                    >
                        +1.0L
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
