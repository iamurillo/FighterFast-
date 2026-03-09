"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User as UserIcon, LogOut, TrendingDown, Activity, Plus, Download, Upload, Shield, RotateCcw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

    if (loading || !data) return <div className="p-6 text-center text-gray-500 mt-10">Cargando perfil...</div>;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 pb-24"
        >

            {/* Header Profile */}
            <div className="flex items-center gap-4 mb-8 pt-4">
                <div className="w-16 h-16 rounded-full bg-[var(--color-fighter-surface)] border-2 border-[var(--color-fighter-surface-hover)] p-1">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.name}&backgroundColor=transparent`} className="w-full h-full rounded-full" />
                </div>
                <div className="flex-1">
                    <h1 className="text-2xl font-black tracking-tight text-white mb-0">{data.user.name}</h1>
                    <p className="text-sm font-medium text-gray-400 capitalize">{data.user.training_type} Atleta</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleLogout} className="p-2 bg-red-900/20 text-red-500 rounded-lg hover:bg-red-900/40 transition-colors">
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Target & Current Weight Card */}
            <motion.div
                whileHover={{ scale: 1.01 }}
                className="bg-[var(--color-fighter-surface)] p-5 rounded-2xl border border-[var(--color-fighter-surface-hover)] mb-6 flex justify-between items-center"
            >
                <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Peso Actual</p>
                    <div className="flex items-end gap-2">
                        <p className="text-3xl font-black text-white">{data.user.current_weight}</p>
                        <p className="text-sm text-gray-500 mb-1 font-bold">kg</p>
                    </div>
                </div>

                <div className="w-px h-12 bg-gray-800"></div>

                <div className="text-right">
                    <p className="text-xs text-[var(--color-fighter-green)] font-bold uppercase tracking-wider mb-1">Peso Objetivo</p>
                    <div className="flex items-end gap-2 justify-end">
                        <p className="text-3xl font-black text-[var(--color-fighter-green)]">{data.user.target_weight}</p>
                        <p className="text-sm text-green-900 mb-1 font-bold">kg</p>
                    </div>
                </div>
            </motion.div>

            {/* Weight Chart */}
            <div className="bg-[var(--color-fighter-surface)] p-5 rounded-2xl border border-[var(--color-fighter-surface-hover)] mb-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Evolución de Peso</h2>
                {data.weights && data.weights.length >= 2 ? (
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={[...data.weights].reverse()}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(val) => new Date(val).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                    stroke="#4a5568" fontSize={9}
                                />
                                <YAxis domain={['auto', 'auto']} stroke="#4a5568" fontSize={9} width={25} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px', fontSize: '12px' }}
                                    labelFormatter={(val) => new Date(val).toLocaleDateString()}
                                />
                                <Line type="stepAfter" dataKey="weight" stroke="var(--color-fighter-green)" strokeWidth={3} dot={{ r: 4, fill: "var(--color-fighter-green)" }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-48 flex items-center justify-center border-2 border-dashed border-gray-700 rounded-xl">
                        <p className="text-gray-500 text-sm text-center px-4">Registra al menos 2 pesos para ver tu gráfica de progreso.</p>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-8">
                <button onClick={() => setShowWeightForm(!showWeightForm)} className="flex items-center justify-center gap-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 font-bold py-4 rounded-2xl border border-blue-500/20 transition-all active:scale-95">
                    <TrendingDown className="w-5 h-5" /> Peso
                </button>
                <button onClick={() => setShowWorkoutForm(!showWorkoutForm)} className="flex items-center justify-center gap-2 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 font-bold py-4 rounded-2xl border border-purple-500/20 transition-all active:scale-95">
                    <Activity className="w-5 h-5" /> Entreno
                </button>
            </div>

            <AnimatePresence>
                {showWeightForm && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleAddWeight} className="bg-[var(--color-fighter-surface)] p-4 rounded-xl border border-[var(--color-fighter-surface-hover)] mb-6 flex gap-3 overflow-hidden"
                    >
                        <input required type="number" step="any" placeholder="Peso (kg)" value={newWeight} onChange={(e) => setNewWeight(e.target.value)} className="w-full bg-black/50 text-white text-sm rounded-lg px-4 py-2 outline-none" />
                        <button type="submit" className="bg-blue-500 text-white px-4 rounded-lg font-bold"><Plus className="w-5 h-5" /></button>
                    </motion.form>
                )}

                {showWorkoutForm && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleAddWorkout} className="bg-[var(--color-fighter-surface)] p-4 rounded-xl border border-[var(--color-fighter-surface-hover)] mb-6 flex flex-col gap-3 overflow-hidden"
                    >
                        <select value={workoutType} onChange={(e) => setWorkoutType(e.target.value)} className="w-full bg-black/50 text-white text-sm rounded-lg px-4 py-3 outline-none">
                            <option value="jiu-jitsu">Jiu-Jitsu / BJJ</option>
                            <option value="gym">Gym / Pesas</option>
                            <option value="running">Running / Cardio</option>
                            <option value="box">Boxeo / Striking</option>
                        </select>
                        <div className="flex gap-3">
                            <input required type="number" placeholder="Minutos" value={workoutDuration} onChange={(e) => setWorkoutDuration(e.target.value)} className="w-full bg-black/50 text-white text-sm rounded-lg px-4 py-2 outline-none" />
                            <button type="submit" className="bg-purple-500 text-white px-6 rounded-lg font-bold"><Plus className="w-5 h-5" /></button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* SEGURIDAD DE DATOS (Fase 3) */}
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" /> Seguridad de Datos
            </h2>
            <div className="bg-[var(--color-fighter-surface)] p-4 rounded-2xl border border-[var(--color-fighter-surface-hover)] mb-8 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-white">Respaldo Local</p>
                        <p className="text-[10px] text-gray-500">Descarga tus datos en un archivo JSON.</p>
                    </div>
                    <button onClick={handleExportData} className="flex items-center gap-2 bg-green-500/10 text-green-500 px-4 py-2 rounded-xl text-xs font-bold border border-green-500/20 active:scale-95 transition-all">
                        <Download className="w-4 h-4" /> Exportar
                    </button>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                    <div>
                        <p className="text-sm font-bold text-white">Restaurar Datos</p>
                        <p className="text-[10px] text-gray-500">Carga un archivo de respaldo previo.</p>
                    </div>
                    <label className="flex items-center gap-2 bg-blue-500/10 text-blue-500 px-4 py-2 rounded-xl text-xs font-bold border border-blue-500/20 cursor-pointer active:scale-95 transition-all">
                        <Upload className="w-4 h-4" /> Importar
                        <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
                    </label>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                    <div>
                        <p className="text-sm font-bold text-red-500">Reiniciar App</p>
                        <p className="text-[10px] text-gray-500">Borra todos los datos del celular permanentemente.</p>
                    </div>
                    <button onClick={handleResetApp} className="flex items-center gap-2 bg-red-900/10 text-red-500 px-4 py-2 rounded-xl text-xs font-bold border border-red-900/20 active:scale-95 transition-all">
                        <RotateCcw className="w-4 h-4" /> Reiniciar
                    </button>
                </div>
            </div>

            {/* Recents */}
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">Últimas Actividades</h2>
            <div className="space-y-3">
                {data.workouts.length === 0 ? (
                    <p className="text-xs text-gray-600 bg-black/20 p-4 rounded-xl text-center">No hay entrenamientos recientes.</p>
                ) : (
                    data.workouts.map((w: any) => (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                            key={w.id} className="bg-[var(--color-fighter-surface)] p-3 rounded-xl border border-[var(--color-fighter-surface-hover)] flex justify-between items-center"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-purple-900/20 flex items-center justify-center">
                                    <Activity className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <p className="font-bold text-white uppercase text-sm">{w.type}</p>
                                    <p className="text-xs text-gray-500">{new Date(w.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <p className="text-lg font-black">{w.duration_minutes} <span className="text-[10px] text-gray-500 uppercase">min</span></p>
                        </motion.div>
                    ))
                )}
            </div>

        </motion.div>
    );
}
