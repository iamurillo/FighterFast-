"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User as UserIcon, LogOut, TrendingDown, Activity, Plus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

    const fetchProfileData = async () => {
        try {
            const token = localStorage.getItem('fighterToken');
            const res = await fetch('http://localhost:5000/api/progress', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const json = await res.json();
                setData(json);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddWeight = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('fighterToken');
            await fetch('http://localhost:5000/api/progress/weight', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ weight: Number(newWeight) })
            });
            setShowWeightForm(false);
            setNewWeight('');
            fetchProfileData();
        } catch (err) { console.error(err); }
    };

    const handleAddWorkout = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('fighterToken');
            await fetch('http://localhost:5000/api/progress/workout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ type: workoutType, duration_minutes: Number(workoutDuration) })
            });
            setShowWorkoutForm(false);
            setWorkoutDuration('');
            fetchProfileData();
        } catch (err) { console.error(err); }
    };

    const handleLogout = () => {
        localStorage.removeItem('fighterToken');
        localStorage.removeItem('fighterUser');
        router.push('/login');
    };

    if (loading || !data) return <div className="p-6 text-center text-gray-500 mt-10">Cargando perfil...</div>;

    return (
        <div className="p-6">

            {/* Header Profile */}
            <div className="flex items-center gap-4 mb-8 pt-4">
                <div className="w-16 h-16 rounded-full bg-[var(--color-fighter-surface)] border-2 border-[var(--color-fighter-surface-hover)] p-1">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.name}&backgroundColor=transparent`} className="w-full h-full rounded-full" />
                </div>
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-white mb-0">{data.user.name}</h1>
                    <p className="text-sm font-medium text-gray-400 capitalize">{data.user.training_type} Atleta</p>
                </div>
                <button onClick={handleLogout} className="ml-auto p-2 bg-red-900/30 text-red-500 rounded-lg hover:bg-red-900/50">
                    <LogOut className="w-5 h-5" />
                </button>
            </div>

            {/* Target & Current Weight Card */}
            <div className="bg-[var(--color-fighter-surface)] p-5 rounded-2xl border border-[var(--color-fighter-surface-hover)] mb-6 flex justify-between items-center">
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
            </div>

            {/* Weight Chart */}
            <div className="bg-[var(--color-fighter-surface)] p-5 rounded-2xl border border-[var(--color-fighter-surface-hover)] mb-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Evolución de Peso</h2>
                {data.weights && data.weights.length >= 2 ? (
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={[...data.weights].reverse()}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
                                <XAxis
                                    dataKey="recorded_at"
                                    tickFormatter={(val) => new Date(val).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                    stroke="#718096" fontSize={10} tickMargin={10}
                                />
                                <YAxis domain={['auto', 'auto']} stroke="#718096" fontSize={10} width={30} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a202c', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    labelFormatter={(val) => new Date(val).toLocaleDateString()}
                                />
                                <Line type="monotone" dataKey="weight" stroke="var(--color-fighter-green)" strokeWidth={3} dot={{ r: 4, fill: "var(--color-fighter-green)", strokeWidth: 2, stroke: "#1a202c" }} activeDot={{ r: 6 }} />
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
                <button onClick={() => setShowWeightForm(!showWeightForm)} className="flex items-center justify-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 font-bold py-3 rounded-xl border border-blue-500/20 transition-all">
                    <TrendingDown className="w-5 h-5" /> Registrar Peso
                </button>
                <button onClick={() => setShowWorkoutForm(!showWorkoutForm)} className="flex items-center justify-center gap-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 font-bold py-3 rounded-xl border border-purple-500/20 transition-all">
                    <Activity className="w-5 h-5" /> Entreno
                </button>
            </div>

            {/* Forms */}
            {showWeightForm && (
                <form onSubmit={handleAddWeight} className="bg-[var(--color-fighter-surface)] p-4 rounded-xl border border-[var(--color-fighter-surface-hover)] mb-6 flex gap-3">
                    <input required type="number" step="any" placeholder="Peso (kg)" value={newWeight} onChange={(e) => setNewWeight(e.target.value)} className="w-full bg-black/50 text-white text-sm rounded-lg px-4 py-2 outline-none" />
                    <button type="submit" className="bg-blue-500 text-white px-4 rounded-lg font-bold"><Plus className="w-5 h-5" /></button>
                </form>
            )}

            {showWorkoutForm && (
                <form onSubmit={handleAddWorkout} className="bg-[var(--color-fighter-surface)] p-4 rounded-xl border border-[var(--color-fighter-surface-hover)] mb-6 flex flex-col gap-3">
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
                </form>
            )}

            {/* Recents */}
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">Últimas Actividades</h2>
            <div className="space-y-3">
                {data.workouts.length === 0 ? (
                    <p className="text-xs text-gray-600 bg-black/20 p-4 rounded-xl text-center">No hay entrenamientos recientes.</p>
                ) : (
                    data.workouts.map((w: any) => (
                        <div key={w.id} className="bg-[var(--color-fighter-surface)] p-3 rounded-xl border border-[var(--color-fighter-surface-hover)] flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-purple-900/20 flex items-center justify-center">
                                    <Activity className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <p className="font-bold text-white uppercase text-sm">{w.type}</p>
                                    <p className="text-xs text-gray-500">{new Date(w.recorded_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <p className="text-lg font-black">{w.duration_minutes} <span className="text-[10px] text-gray-500 uppercase">min</span></p>
                        </div>
                    ))
                )}
            </div>

        </div>
    );
}
