"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User as UserIcon, LogOut, TrendingDown, Activity, Plus, Download, Upload, Shield, RotateCcw, TrendingUp, ChevronLeft, Calendar, Droplet, Zap, Trophy, Share2, Bookmark, Scale } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/utils/storage';

export default function ProfilePage() {
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Forms
    const [showWeightForm, setShowWeightForm] = useState(false);
    const [newWeight, setNewWeight] = useState('');

    const [showWorkoutForm, setShowWorkoutForm] = useState(false);
    const [workoutType, setWorkoutType] = useState('jiu-jitsu');
    const [workoutDuration, setWorkoutDuration] = useState('');
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = () => {
        const user = db.getUser();
        if (!user) return;
        const weights = db.getWeightHistory();
        const workouts = db.getWorkoutHistory();
        const streakVal = db.getTrainingStreak();
        const trophies = db.getTrophies();

        setData({ user, weights, workouts, trophies });
        setStreak(streakVal);
        setLoading(false);
    };

    const handleAddWeight = (e: React.FormEvent) => {
        e.preventDefault();
        db.addWeightLog(Number(newWeight), Number(bodyFat), Number(muscleMass));
        setShowWeightForm(false);
        setNewWeight('');
        setBodyFat('');
        setMuscleMass('');
        fetchProfileData();
    };

    const handleAddWorkout = (e: React.FormEvent) => {
        e.preventDefault();
        db.addWorkoutLog(workoutType, Number(workoutDuration), 'medium');
        setShowWorkoutForm(false);
        setWorkoutDuration('');
        fetchProfileData();
    };

    const handleLogout = () => {
        db.clearUser();
        router.push('/login');
    };

    const handleChangeAvatar = () => {
        const newSeed = Math.random().toString(36).substring(7);
        db.updateAvatar(newSeed);
        fetchProfileData();
    };

    const handleExportData = () => {
        const backup = db.getFullBackup();
        const blob = new Blob([backup], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fighterfast-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            if (db.restoreBackup(content)) {
                alert('¡Datos restaurados con éxito! La página se recargará.');
                window.location.reload();
            } else {
                alert('Error al restaurar el archivo. Asegúrate de que sea un JSON válido de FighterFast.');
            }
        };
        reader.readAsText(file);
    };

    const [bodyFat, setBodyFat] = useState<string>('');
    const [muscleMass, setMuscleMass] = useState<string>('');

    const handleResetApp = () => {
        if (confirm('¿ESTÁS SEGURO? Se borrarán todos tus entrenamientos, comidas y registros permanentemente.')) {
            localStorage.clear();
            window.location.href = '/register';
        }
    };

    const handleShareIdentity = async () => {
        if (typeof navigator === 'undefined' || !navigator.share) {
            alert('Tu navegador no soporta compartir directamente. ¡Toma una captura de pantalla!');
            return;
        }
        try {
            await navigator.share({
                title: 'Mi Rango en FighterFast 🥋',
                text: `Soy ${data.user.name} (${db.getFighterRank().name.toUpperCase()}) en FighterFast. ¡Únete al tatami digital!`,
                url: window.location.origin
            });
        } catch (e) { }
    };

    if (loading || !data) return (
        <div className="min-h-screen bg-[var(--color-fighter-background)] flex items-center justify-center p-6 text-center">
            <div className="w-8 h-8 border-2 border-[var(--color-fighter-red)] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const weightProgressData = [...data.weights].reverse();

    // Stats Analytics
    const totalSessions = data.workouts.length;
    const totalMinutes = data.workouts.reduce((acc: number, w: any) => acc + (Number(w.duration_minutes) || 0), 0);

    const workoutStats = data.workouts.reduce((acc: any, w: any) => {
        const type = w.type || 'Otro';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});

    const pieData = Object.keys(workoutStats).map(key => ({
        name: key,
        value: workoutStats[key]
    }));
    const PIE_COLORS = ['#E11D48', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'];

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="p-6 pb-24 max-w-md mx-auto"
        >
            {/* Header Profile Premium */}
            {/* Header Profile - Solo Botón de Logout arriba */}
            <div className="flex justify-end mb-4 pt-4">
                <button onClick={handleLogout} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-all active:scale-90">
                    <LogOut className="w-4 h-4" />
                </button>
            </div>

            {/* Fighter Identity Card - Apex Final */}
            <motion.div
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                className="relative mb-10 group"
            >
                <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-fighter-red)] via-orange-500 to-yellow-500 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 overflow-hidden shadow-2xl">
                    {/* Card Background Patterns */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-fighter-red)]/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl -ml-10 -mb-10"></div>

                    <div className="flex gap-6 items-start relative z-10">
                        {/* Photo/Avatar Section */}
                        <div className="flex flex-col items-center gap-3">
                            <div
                                className="w-24 h-24 rounded-2xl border-4 border-black flex items-center justify-center shadow-2xl overflow-hidden"
                                style={{ backgroundColor: db.getFighterRank().bg }}
                            >
                                <img
                                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${data.user.name}&backgroundColor=${db.getFighterRank().bg.replace('#', '')}&fontSize=45&fontWeight=900`}
                                    alt="Fighter"
                                    className="w-16 h-16"
                                />
                            </div>
                            <div
                                className="w-full py-1 rounded-md text-[7px] font-black uppercase text-center border border-white/10 shadow-lg"
                                style={{ backgroundColor: db.getFighterRank().bg, color: db.getFighterRank().color }}
                            >
                                {db.getFighterRank().name}
                            </div>
                        </div>

                        {/* Info Section */}
                        <div className="flex-1 space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[7px] font-black text-gray-500 uppercase tracking-widest mb-0.5">Identidad de Guerrero</p>
                                    <h2 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">{data.user.name}</h2>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={handleShareIdentity} className="text-gray-500 hover:text-white transition-colors">
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                    <Shield className="w-4 h-4 text-[var(--color-fighter-red)] opacity-50" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                                <div>
                                    <p className="text-[6px] font-black text-gray-500 uppercase tracking-widest mb-0.5">División</p>
                                    <p className="text-[10px] font-black text-white uppercase italic">{db.getWeightClass(data.user.current_weight).name}</p>
                                </div>
                                <div>
                                    <p className="text-[6px] font-black text-gray-500 uppercase tracking-widest mb-0.5">Racha</p>
                                    <div className="flex items-center gap-1">
                                        <Zap className="w-2 h-2 text-orange-500 fill-orange-500" />
                                        <p className="text-[10px] font-black text-white uppercase italic">{streak} DÍAS</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[6px] font-black text-gray-500 uppercase tracking-widest mb-0.5">Disciplina</p>
                                    <p className="text-[10px] font-black text-white uppercase italic">{data.user.training_type}</p>
                                </div>
                                <div>
                                    <p className="text-[6px] font-black text-gray-500 uppercase tracking-widest mb-0.5">Status</p>
                                    <p className="text-[10px] font-black text-emerald-400 uppercase italic">Active Duty</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card Footer Decor */}
                    <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center opacity-40">
                        <span className="text-[5px] font-mono text-gray-500 uppercase tracking-[0.3em]">FIGHTER-FAST-ID-{Date.now().toString().slice(-8)}</span>
                        <div className="flex gap-2">
                            <div className="w-6 h-1 bg-white/20 rounded-full"></div>
                            <div className="w-3 h-1 bg-[var(--color-fighter-red)] rounded-full"></div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Trophy Room (Sistema de Logros) */}
            <div className="mb-10 mt-6">
                <div className="flex items-center gap-2 mb-4">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Trophy Room</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {data.trophies && data.trophies.map((trophy: any, idx: number) => {
                        const IconComponent =
                            trophy.icon === 'Zap' ? Zap :
                                trophy.icon === 'Activity' ? Activity :
                                    trophy.icon === 'Shield' ? Shield :
                                        trophy.icon === 'Droplet' ? Droplet :
                                            trophy.icon === 'Bookmark' ? Bookmark :
                                                trophy.icon === 'Scale' ? Scale : Trophy;

                        return (
                            <div key={idx} className={`fighter-card border border-white/5 relative overflow-hidden transition-all ${trophy.achieved ? 'bg-gradient-to-br from-yellow-500/10 to-orange-500/5 border-yellow-500/30' : 'bg-white/5 opacity-50 grayscale'}`}>
                                {trophy.achieved && (
                                    <motion.div
                                        animate={{ x: ['-100%', '200%'] }}
                                        transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none"
                                    />
                                )}
                                {trophy.achieved && <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/20 rounded-full blur-xl -mr-8 -mt-8"></div>}
                                <div className="flex flex-col items-center text-center gap-2 relative z-10">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${trophy.achieved ? 'bg-yellow-500/20 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 'bg-white/10 text-gray-500'}`}>
                                        <IconComponent className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className={`text-[10px] font-black uppercase tracking-widest ${trophy.achieved ? 'text-yellow-400' : 'text-gray-400'} mb-1`}>{trophy.name}</p>
                                        <p className="text-[7px] font-bold text-gray-500 uppercase tracking-tight leading-tight">{trophy.desc}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Target & Current Weight Card - Glass */}
            <motion.div
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                className="fighter-card !bg-transparent glass-panel border-white/10 mb-8 overflow-hidden relative"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                <div className="flex justify-between items-center relative z-10">
                    <div>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1.5">Peso Actual</p>
                        <div className="flex items-baseline gap-1">
                            <p className="text-4xl font-black text-white tracking-tighter">{data.user.current_weight}</p>
                            <p className="text-xs text-gray-500 font-bold uppercase transition-all">kg</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="w-px h-12 bg-white/10"></div>
                        <TrendingDown className="w-4 h-4 text-emerald-500/50 mt-2" />
                    </div>

                    <div className="text-right">
                        <p className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.2em] mb-1.5">Objetivo</p>
                        <div className="flex items-baseline gap-1 justify-end">
                            <p className="text-4xl font-black text-emerald-500 tracking-tighter">{data.user.target_weight}</p>
                            <p className="text-xs text-emerald-900 font-bold uppercase">kg</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Weight Evolution Graph - High Contrast */}
            <div className="fighter-card mb-8 border-white/5 bg-gradient-to-b from-[var(--color-fighter-surface)] to-black">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500 italic">Evolución Pro</h2>
                    <TrendingUp className="w-4 h-4 text-[var(--color-fighter-red)]" />
                </div>

                {data.weights && data.weights.length >= 2 ? (
                    <div className="h-48 w-full -ml-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weightProgressData}>
                                <defs>
                                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(val) => new Date(val).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                    stroke="rgba(255,255,255,0.2)" fontSize={9} fontVariant="lining-nums"
                                    axisLine={false} tickLine={false}
                                />
                                <YAxis hide domain={['auto', 'auto']} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(5,5,5,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', backdropFilter: 'blur(10px)', color: 'white' }}
                                    labelFormatter={(val) => new Date(val).toLocaleDateString()}
                                    itemStyle={{ fontWeight: '900', color: '#10B981' }}
                                />
                                <Area type="monotone" dataKey="weight" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" animationDuration={1500} />
                                {weightProgressData[0]?.bodyFat && (
                                    <Area type="monotone" dataKey="bodyFat" stroke="#F59E0B" strokeWidth={2} fill="transparent" />
                                )}
                                {weightProgressData[0]?.muscleMass && (
                                    <Area type="monotone" dataKey="muscleMass" stroke="#3B82F6" strokeWidth={2} fill="transparent" />
                                )}
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-48 flex items-center justify-center border-2 border-dashed border-white/5 rounded-2xl bg-black/20">
                        <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest text-center px-8 leading-relaxed">
                            Registra más datos para desbloquear analítica avanzada
                        </p>
                    </div>
                )}

                <div className="mt-6 flex flex-col gap-3">
                    <input
                        type="number" step="0.1" placeholder="Peso (kg)"
                        value={newWeight} onChange={(e) => setNewWeight(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-red-500/50"
                    />
                    <div className="flex gap-2">
                        <input
                            type="number" step="0.1" placeholder="% Grasa"
                            value={bodyFat} onChange={(e) => setBodyFat(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500/50"
                        />
                        <input
                            type="number" step="0.1" placeholder="% Músculo"
                            value={muscleMass} onChange={(e) => setMuscleMass(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500/50"
                        />
                    </div>
                    <button
                        onClick={handleAddWeight}
                        className="w-full bg-[var(--color-fighter-red)] text-white font-black py-4 rounded-xl shadow-lg shadow-red-500/20 active:scale-95 transition-all text-xs uppercase tracking-widest"
                    >
                        Registrar Evolución
                    </button>
                </div>
            </div>

            {/* TRAINING HEATMAP SECTION */}
            <div className="flex items-center gap-2 mb-6 mt-12">
                <Calendar className="w-5 h-5 text-orange-500" />
                <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Consistencia (6 Meses)</h2>
            </div>
            <div className="fighter-card border-white/5 bg-white/5 p-4 overflow-hidden mb-12">
                <div className="flex gap-1 overflow-x-auto pb-4 no-scrollbar">
                    {Array.from({ length: 24 }).map((_, weekIdx) => (
                        <div key={weekIdx} className="flex flex-col gap-1 shrink-0">
                            {Array.from({ length: 7 }).map((_, dayIdx) => {
                                const date = new Date();
                                date.setDate(date.getDate() - (23 - weekIdx) * 7 - (6 - dayIdx));
                                const dateStr = date.toISOString().split('T')[0];
                                const hasActivity = [...data.workouts, ...db.getDailyMeals(dateStr).meals].length > 0;
                                return (
                                    <div
                                        key={dayIdx}
                                        title={dateStr}
                                        className={`w-3.5 h-3.5 rounded-sm transition-all duration-500 ${hasActivity ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]' : 'bg-white/5'}`}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-2 px-1">
                    <span className="text-[8px] font-black text-gray-600 uppercase tracking-tighter">Hace 6 meses</span>
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Hoy</span>
                </div>
            </div>

            {/* Combat Analytics Section */}
            <div className="flex items-center gap-2 mb-6 mt-4">
                <Activity className="w-5 h-5 text-purple-500" />
                <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Analítica de Combate</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="fighter-card !bg-transparent glass-panel border-white/5 text-center py-6">
                    <p className="text-4xl font-black text-white tracking-tighter leading-none mb-1">{totalSessions}</p>
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Sesiones Totales</p>
                </div>
                <div className="fighter-card !bg-transparent glass-panel border-white/5 text-center py-6">
                    <p className="text-4xl font-black text-[var(--color-fighter-red)] tracking-tighter leading-none mb-1">{totalMinutes}m</p>
                    <p className="text-[9px] font-black text-[var(--color-fighter-red)] opacity-50 uppercase tracking-widest">Tiempo en Tatami</p>
                </div>
            </div>

            <div className="fighter-card mb-8 border-white/5 !bg-transparent glass-panel">
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic mb-4 text-center">Distribución de Disciplinas</h2>
                {pieData.length > 0 ? (
                    <div className="h-48 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%" cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(5,5,5,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px', color: 'white', fontWeight: '900' }}
                                    itemStyle={{ color: 'white' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                            <span className="text-2xl font-black text-white">{totalSessions}</span>
                            <span className="text-[7px] font-black text-gray-500 uppercase tracking-widest leading-none mt-1">Total</span>
                        </div>
                    </div>
                ) : (
                    <div className="h-48 flex items-center justify-center">
                        <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest text-center px-8">
                            Sin datos suficientes
                        </p>
                    </div>
                )}
            </div>

            {/* Quick Record Actions */}
            <div className="grid grid-cols-2 gap-4 mb-10">
                <button
                    onClick={() => setShowWeightForm(!showWeightForm)}
                    className="fighter-card !bg-blue-500/5 hover:!bg-blue-500/10 !border-blue-500/10 flex flex-col items-center justify-center py-6 gap-3 group active:scale-95"
                >
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <TrendingDown className="w-6 h-6 text-blue-400" />
                    </div>
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Registrar Peso</span>
                </button>
                <button
                    onClick={() => setShowWorkoutForm(!showWorkoutForm)}
                    className="fighter-card !bg-purple-500/5 hover:!bg-purple-500/10 !border-purple-500/10 flex flex-col items-center justify-center py-6 gap-3 group active:scale-95"
                >
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Activity className="w-6 h-6 text-purple-400" />
                    </div>
                    <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Añadir Entreno</span>
                </button>
            </div>

            <AnimatePresence>
                {(showWeightForm || showWorkoutForm) && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
                        onClick={() => { setShowWeightForm(false); setShowWorkoutForm(false); }}
                    >
                        <motion.div
                            className="fighter-card w-full max-w-sm"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">
                                    {showWeightForm ? 'Nuevo Registro Peso' : 'Log Entrenamiento'}
                                </h3>
                                <button onClick={() => { setShowWeightForm(false); setShowWorkoutForm(false); }} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                    <Plus className="w-4 h-4 rotate-45 text-gray-500" />
                                </button>
                            </div>

                            {showWeightForm ? (
                                <form onSubmit={handleAddWeight} className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 block">Peso en KG</label>
                                    <input required type="number" step="any" autoFocus placeholder="0.0" value={newWeight} onChange={(e) => setNewWeight(e.target.value)} className="w-full bg-white/5 border border-white/10 text-white text-2xl font-black rounded-xl px-4 py-5 outline-none focus:ring-1 focus:ring-blue-500 text-center" />
                                    <button type="submit" className="fighter-btn-primary w-full bg-blue-600 hover:bg-blue-700">Actualizar Peso</button>
                                </form>
                            ) : (
                                <form onSubmit={handleAddWorkout} className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 block">Tipo de Sesión</label>
                                    <select value={workoutType} onChange={(e) => setWorkoutType(e.target.value)} className="w-full bg-white/5 border border-white/10 text-white text-sm font-bold rounded-xl px-4 py-4 outline-none appearance-none">
                                        <option value="jiu-jitsu">Jiu-Jitsu / BJJ</option>
                                        <option value="gym">Gym / Pesas</option>
                                        <option value="running">Running / Cardio</option>
                                        <option value="box">Boxeo / Striking</option>
                                    </select>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 block">Duración (Minutos)</label>
                                    <input required type="number" placeholder="60" value={workoutDuration} onChange={(e) => setWorkoutDuration(e.target.value)} className="w-full bg-white/5 border border-white/10 text-white text-2xl font-black rounded-xl px-4 py-5 outline-none focus:ring-1 focus:ring-purple-500 text-center" />
                                    <button type="submit" className="fighter-btn-primary w-full bg-purple-600 hover:bg-purple-700">Guardar Sesión</button>
                                </form>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* DATA MANAGEMENT - PHASE 3 PREMIUM */}
            <div className="flex items-center gap-2 mb-6 mt-4">
                <Shield className="w-5 h-5 text-emerald-500" />
                <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Bóveda de Datos</h2>
            </div>

            <div className="fighter-card !bg-transparent glass-panel border-white/5 overflow-hidden">
                <div className="divide-y divide-white/5">
                    <div className="flex items-center justify-between py-5">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                <Download className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                                <p className="text-sm font-black text-white italic uppercase tracking-tighter leading-none mb-1">Backup JSON</p>
                                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Descargar archivos locales</p>
                            </div>
                        </div>
                        <button onClick={handleExportData} className="px-5 py-2.5 bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white rounded-xl hover:bg-white/10 active:scale-95 transition-all">
                            Exportar
                        </button>
                    </div>

                    <div className="flex items-center justify-between py-5">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                <Upload className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                                <p className="text-sm font-black text-white italic uppercase tracking-tighter leading-none mb-1">Restaurar</p>
                                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Cargar copia de seguridad</p>
                            </div>
                        </div>
                        <label className="px-5 py-2.5 bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-blue-400 rounded-xl hover:bg-white/10 active:scale-95 transition-all cursor-pointer">
                            Importar
                            <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
                        </label>
                    </div>

                    <div className="flex items-center justify-between py-5 border-t border-red-900/10">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-red-900/10 flex items-center justify-center">
                                <RotateCcw className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                                <p className="text-sm font-black text-red-500 italic uppercase tracking-tighter leading-none mb-1">Hard Reset</p>
                                <p className="text-[9px] text-gray-700 font-bold uppercase tracking-widest">Borrado irreversible</p>
                            </div>
                        </div>
                        <button onClick={handleResetApp} className="px-5 py-2.5 bg-red-900/10 border border-red-500/10 text-[10px] font-black uppercase tracking-widest text-red-500 rounded-xl hover:bg-red-500/20 active:scale-95 transition-all">
                            Reiniciar
                        </button>
                    </div>
                </div>
            </div>

            {/* Recents Timeline */}
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500 italic mb-6 mt-12">Timeline de Guerras</h2>
            <div className="space-y-4">
                {data.workouts.length === 0 ? (
                    <div className="fighter-card bg-transparent border-dashed border-white/5 text-center py-12">
                        <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest italic">Aún no has sudado en el tatami.</p>
                    </div>
                ) : (
                    data.workouts.map((w: any, idx: number) => (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            key={w.id}
                            className="fighter-card group flex justify-between items-center border-white/5 hover:border-[var(--color-fighter-red)]/30"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-900/20 to-transparent border border-purple-500/10 flex items-center justify-center">
                                    <Activity className="w-6 h-6 text-purple-400 opacity-80" />
                                </div>
                                <div className="flex flex-col">
                                    <p className="font-black text-white uppercase italic text-sm tracking-tight leading-none mb-1.5">{w.type}</p>
                                    <div className="flex items-center gap-1.5 opacity-40">
                                        <Calendar className="w-2.5 h-2.5 text-white" />
                                        <span className="text-[9px] font-black uppercase text-white">{new Date(w.date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-black text-white tracking-tighter leading-none mb-1">{w.duration_minutes}</p>
                                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">MINUTOS</p>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </motion.div >
    );
}
