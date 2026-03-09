"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User as UserIcon, LogOut, TrendingDown, Activity, Plus, Download, Upload, Shield, RotateCcw, TrendingUp, ChevronLeft } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
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

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = () => {
        const user = db.getUser();
        if (!user) return;
        const weights = db.getWeightHistory();
        const workouts = db.getWorkoutHistory();

        setData({ user, weights, workouts });
        setLoading(false);
    };

    const handleAddWeight = (e: React.FormEvent) => {
        e.preventDefault();
        db.addWeightLog(Number(newWeight));
        setShowWeightForm(false);
        setNewWeight('');
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

    const handleResetApp = () => {
        if (confirm('¿ESTÁS SEGURO? Se borrarán todos tus entrenamientos, comidas y registros permanentemente.')) {
            localStorage.clear();
            window.location.href = '/register';
        }
    };

    if (loading || !data) return (
        <div className="min-h-screen bg-[var(--color-fighter-background)] flex items-center justify-center p-6 text-center">
            <div className="w-8 h-8 border-2 border-[var(--color-fighter-red)] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const weightProgressData = [...data.weights].reverse();

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="p-6 pb-24 max-w-md mx-auto"
        >
            {/* Header Profile Premium */}
            <div className="flex items-center gap-6 mb-10 pt-4">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-fighter-red)] to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                    <div className="relative w-24 h-24 rounded-2xl bg-[var(--color-fighter-surface)] border border-white/10 p-1 bg-clip-border overflow-hidden ring-4 ring-black">
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.name}&backgroundColor=transparent`}
                            className="w-full h-full rounded-xl"
                            alt="Avatar"
                        />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 rounded-lg border-4 border-black flex items-center justify-center">
                        <Shield className="w-3 h-3 text-black fill-black" />
                    </div>
                </div>

                <div className="flex-1">
                    <span className="text-[var(--color-fighter-red)] text-[9px] font-black uppercase tracking-[0.3em] mb-1.5 block">V1 Elite Member</span>
                    <h1 className="text-3xl font-black text-white leading-tight uppercase italic">{data.user.name}</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <Activity className="w-3 h-3 text-gray-500" />
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{data.user.training_type}</span>
                    </div>
                </div>

                <button onClick={handleLogout} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-all active:scale-90">
                    <LogOut className="w-5 h-5" />
                </button>
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
        </motion.div>
    );
}
