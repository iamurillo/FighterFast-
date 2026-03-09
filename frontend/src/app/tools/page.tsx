"use client";
import React, { useState, useEffect } from 'react';
import { Dumbbell, Scale, Plus, Calendar, Droplets, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/utils/storage';

export default function ToolsPage() {
    const [activeTab, setActiveTab] = useState<'diary' | 'calculator'>('diary');
    const [user, setUser] = useState<any>(null);

    // --- DIARY STATE ---
    const [logs, setLogs] = useState<any[]>([]);
    const [showDiaryForm, setShowDiaryForm] = useState(false);
    const [discipline, setDiscipline] = useState('Jiu-Jitsu / Grappling');
    const [notes, setNotes] = useState('');

    // --- CALCULATOR STATE ---
    const [currentWeight, setCurrentWeight] = useState('');
    const [targetKgs, setTargetKgs] = useState('');
    const [daysLeft, setDaysLeft] = useState('7');
    const [plan, setPlan] = useState<any>(null);

    useEffect(() => {
        const storedUser = db.getUser();
        if (storedUser) {
            setUser(storedUser);
            setCurrentWeight(storedUser.current_weight?.toString() || '');
            setTargetKgs(storedUser.target_weight?.toString() || '');
        }
        setLogs(db.getTrainingLogs().reverse()); // Mostrar recientes primero
    }, []);

    const handleAddLog = (e: React.FormEvent) => {
        e.preventDefault();
        const today = new Date().toISOString().split('T')[0];
        db.addTrainingDiaryLog(today, discipline, notes);
        setLogs(db.getTrainingLogs().reverse());
        setNotes('');
        setShowDiaryForm(false);
    };

    const handleCalculateCut = (e: React.FormEvent) => {
        e.preventDefault();
        const current = Number(currentWeight);
        const target = Number(targetKgs);
        const days = Number(daysLeft);

        if (!current || !target || days < 1) return;

        const difference = current - target;
        const waterLoadRec = current * 0.08; // 80ml per kg para Water Loading

        let protocol = '';
        let dangerLevel = 'low';

        if (difference <= 0) {
            protocol = 'Ya estás en peso o por debajo. ¡Mantenimiento!';
        } else if (difference <= current * 0.03) {
            protocol = 'Corte Ligero (Water cut simple). Reduce carbohidratos 3 días antes y sal 2 días antes.';
        } else if (difference <= current * 0.08) {
            protocol = 'Corte Moderado a Fuerte. Inicia Water Loading (Carga de agua) 5 días antes y corta a 0 líquidos 24h antes del pesaje. Usa sauna leve.';
            dangerLevel = 'medium';
        } else {
            protocol = 'Corte Peligroso (>8% de tu peso corporal). Requiere supervisión profesional. Mucho riesgo de deshidratación severa.';
            dangerLevel = 'high';
        }

        setPlan({
            difference: difference.toFixed(2),
            waterLoadRec: waterLoadRec.toFixed(1),
            protocol,
            dangerLevel
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="p-6 pb-24"
        >

            {/* Header */}
            <div className="flex justify-between items-center mb-6 pt-4">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-white mb-0">Herramientas</h1>
                    <p className="text-sm font-medium text-gray-400">Fight Camp</p>
                </div>
            </div>

            {/* Tab Selector */}
            <div className="flex bg-black/40 rounded-xl p-1 mb-6 border border-gray-800">
                <button
                    onClick={() => setActiveTab('diary')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${activeTab === 'diary' ? 'bg-[var(--color-fighter-surface)] text-white shadow-md' : 'text-gray-500'
                        }`}
                >
                    <Calendar className="w-4 h-4" /> Diario
                </button>
                <button
                    onClick={() => setActiveTab('calculator')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${activeTab === 'calculator' ? 'bg-[var(--color-fighter-surface)] text-white shadow-md' : 'text-gray-500'
                        }`}
                >
                    <Scale className="w-4 h-4" /> Corte Peso
                </button>
            </div>

            {/* --- DIARY TAB --- */}
            {activeTab === 'diary' && (
                <div className="animate-in fade-in slide-in-from-left-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Registro de Clases</h2>
                        <button
                            onClick={() => setShowDiaryForm(!showDiaryForm)}
                            className="bg-[var(--color-fighter-surface-hover)] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
                        >
                            <Plus className="w-3 h-3" /> Añadir
                        </button>
                    </div>

                    {showDiaryForm && (
                        <form onSubmit={handleAddLog} className="bg-[var(--color-fighter-surface)] p-4 rounded-xl border border-[var(--color-fighter-surface-hover)] mb-6">
                            <select
                                value={discipline} onChange={(e) => setDiscipline(e.target.value)}
                                className="w-full bg-black/50 text-white text-sm rounded-lg px-4 py-3 outline-none mb-3"
                            >
                                <option value="Jiu-Jitsu / Grappling">Jiu-Jitsu / Grappling</option>
                                <option value="Boxeo / Striking">Boxeo / Striking</option>
                                <option value="Sparring (MMA)">Sparring (MMA)</option>
                                <option value="Fuerza y Acondicionamiento">Fuerza y Acondicionamiento</option>
                            </select>

                            <textarea
                                required
                                value={notes} onChange={(e) => setNotes(e.target.value)}
                                placeholder="Notas de la clase (Ej: Hoy me enseñaron pase de guardia araña...)"
                                className="w-full bg-black/50 text-white text-sm rounded-lg px-4 py-3 outline-none h-24 resize-none mb-3"
                            ></textarea>

                            <button type="submit" className="w-full bg-[var(--color-fighter-red)] text-white font-bold rounded-lg py-3 text-sm">
                                GUARDAR EN EL DIARIO
                            </button>
                        </form>
                    )}

                    <div className="space-y-3">
                        {logs.length === 0 ? (
                            <div className="text-center py-10 border border-dashed border-gray-700 rounded-xl">
                                <Dumbbell className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                                <p className="text-gray-500 text-sm">No hay registros de entrenamiento aún.</p>
                            </div>
                        ) : (
                            logs.map((log: any) => (
                                <div key={log.id} className="bg-[var(--color-fighter-surface)] p-4 rounded-xl border border-[var(--color-fighter-surface-hover)] border-l-2 border-l-[var(--color-fighter-red)]">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-white text-sm">{log.discipline}</h3>
                                        <span className="text-xs text-gray-500">{new Date(log.date).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-xs text-gray-300 leading-relaxed">{log.notes}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* --- CALCULATOR TAB --- */}
            {activeTab === 'calculator' && (
                <div key="calc-tab" className="animate-in fade-in slide-in-from-right-4">
                    <div className="bg-[var(--color-fighter-surface)] p-5 rounded-2xl border border-[var(--color-fighter-surface-hover)] mb-6">
                        <h2 className="text-sm font-bold text-gray-300 mb-4 flex items-center gap-2">
                            <Droplets className="w-4 h-4 text-blue-400" /> Planificador de Corte (Water Cut)
                        </h2>

                        <form onSubmit={handleCalculateCut} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1 block">Peso Actual (kg)</label>
                                    <input type="number" step="any" required value={currentWeight} onChange={(e) => setCurrentWeight(e.target.value)} className="w-full bg-black/50 text-white text-sm rounded-lg px-4 py-3 outline-none text-center" />
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1 block">Límite Torneo (kg)</label>
                                    <input type="number" step="any" required value={targetKgs} onChange={(e) => setTargetKgs(e.target.value)} className="w-full bg-black/50 text-white text-sm rounded-lg px-4 py-3 outline-none text-center" />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1 block">Días para el Pesaje</label>
                                <input type="number" required value={daysLeft} onChange={(e) => setDaysLeft(e.target.value)} className="w-full bg-black/50 text-orange-400 text-sm font-bold rounded-lg px-4 py-3 outline-none text-center" />
                            </div>

                            <button type="submit" className="w-full bg-white text-black font-black rounded-xl py-3 mt-2 hover:bg-gray-200 transition-colors">
                                CALCULAR PROTOCOLO
                            </button>
                        </form>
                    </div>

                    {plan && (
                        <div className="bg-black p-5 rounded-2xl border border-gray-800 animate-in zoom-in-95">
                            <div className="flex justify-between items-end mb-4 border-b border-gray-800 pb-4">
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">A Cortar</p>
                                    <p className="text-3xl font-black text-white">{plan.difference} <span className="text-sm text-gray-500">kg</span></p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Carga de Agua (Pico)</p>
                                    <p className="text-xl font-bold text-blue-400">{plan.waterLoadRec} L</p>
                                </div>
                            </div>

                            <div className={`p-4 rounded-xl border ${plan.dangerLevel === 'high' ? 'bg-red-900/20 border-red-500/30' : plan.dangerLevel === 'medium' ? 'bg-orange-900/20 border-orange-500/30' : 'bg-green-900/20 border-green-500/30'}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle2 className={`w-4 h-4 ${plan.dangerLevel === 'high' ? 'text-red-500' : plan.dangerLevel === 'medium' ? 'text-orange-500' : 'text-green-500'}`} />
                                    <h3 className="font-bold text-sm text-white">Recomendación</h3>
                                </div>
                                <p className="text-xs leading-relaxed text-gray-300">
                                    {plan.protocol}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
}
