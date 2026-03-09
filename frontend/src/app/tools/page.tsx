"use client";
import React, { useState, useEffect } from 'react';
import { Dumbbell, Scale, Plus, Calendar, Droplets, ChevronRight, CheckCircle2, AlertTriangle, Info, BookOpen, Trophy } from 'lucide-react';
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
            className="p-6 pb-24 max-w-md mx-auto"
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-8 pt-4">
                <div>
                    <span className="text-[var(--color-fighter-red)] text-[10px] font-black uppercase tracking-[0.2em] mb-1">Fight Prep</span>
                    <h1 className="text-3xl font-black text-white leading-none">Herramientas</h1>
                </div>
            </div>

            {/* Tab Selector - Glass Pill */}
            <div className="flex bg-white/5 backdrop-blur-md rounded-2xl p-1.5 mb-8 border border-white/5">
                <button
                    onClick={() => setActiveTab('diary')}
                    className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'diary'
                        ? 'bg-[var(--color-fighter-red)] text-white shadow-[0_0_15px_rgba(225,29,72,0.3)]'
                        : 'text-gray-500 hover:text-gray-300'
                        }`}
                >
                    <BookOpen className="w-4 h-4" /> Diario
                </button>
                <button
                    onClick={() => setActiveTab('calculator')}
                    className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'calculator'
                        ? 'bg-[var(--color-fighter-red)] text-white shadow-[0_0_15px_rgba(225,29,72,0.3)]'
                        : 'text-gray-500 hover:text-gray-300'
                        }`}
                >
                    <Scale className="w-4 h-4" /> Corte
                </button>
            </div>

            {/* --- DIARY TAB --- */}
            <AnimatePresence mode="wait">
                {activeTab === 'diary' && (
                    <motion.div
                        key="diary"
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                        className="space-y-6"
                    >
                        <div className="flex justify-between items-center">
                            <h2 className="text-sm font-black text-gray-500 uppercase tracking-widest">Entrenamientos</h2>
                            <button
                                onClick={() => setShowDiaryForm(!showDiaryForm)}
                                className="bg-white/5 border border-white/10 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-all"
                            >
                                <Plus className={`w-3.5 h-3.5 transition-transform ${showDiaryForm ? 'rotate-45' : ''}`} /> {showDiaryForm ? 'Cerrar' : 'Añadir'}
                            </button>
                        </div>

                        <AnimatePresence>
                            {showDiaryForm && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <form onSubmit={handleAddLog} className="fighter-card mb-6">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 block">Disciplina</label>
                                        <select
                                            value={discipline} onChange={(e) => setDiscipline(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-4 outline-none mb-4 appearance-none focus:ring-1 focus:ring-[var(--color-fighter-red)]"
                                        >
                                            <option value="Jiu-Jitsu / Grappling">Jiu-Jitsu / Grappling</option>
                                            <option value="Boxeo / Striking">Boxeo / Striking</option>
                                            <option value="Sparring (MMA)">Sparring (MMA)</option>
                                            <option value="Fuerza y Acondicionamiento">Fuerza y Acondicionamiento</option>
                                        </select>

                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 block">Notas Técnicas</label>
                                        <textarea
                                            required
                                            value={notes} onChange={(e) => setNotes(e.target.value)}
                                            placeholder="¿Qué aprendiste hoy? Ej: Pase de media guardia..."
                                            className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-4 outline-none h-32 resize-none mb-4 focus:ring-1 focus:ring-[var(--color-fighter-red)]"
                                        ></textarea>

                                        <button type="submit" className="fighter-btn-primary w-full">
                                            Registrar Clase
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-4">
                            {logs.length === 0 ? (
                                <div className="fighter-card bg-transparent border-dashed border-white/10 text-center py-12">
                                    <Dumbbell className="w-10 h-10 text-gray-700 mx-auto mb-4" />
                                    <p className="text-gray-500 text-sm font-bold italic">Aún no has registrado tus guerras diarias.</p>
                                </div>
                            ) : (
                                logs.map((log: any, idx) => (
                                    <motion.div
                                        key={log.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="fighter-card relative overflow-hidden group border-l-4 border-l-[var(--color-fighter-red)]"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="px-2 py-1 bg-[var(--color-fighter-red)]/10 text-[var(--color-fighter-red)] text-[9px] font-black uppercase tracking-widest rounded-md">
                                                {log.discipline}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(log.date).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-300 leading-relaxed font-medium italic">"{log.notes}"</p>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}

                {/* --- CALCULATOR TAB --- */}
                {activeTab === 'calculator' && (
                    <motion.div
                        key="calculator"
                        initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                        className="space-y-6"
                    >
                        <div className="fighter-card border-blue-500/20 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                <Droplets className="w-20 h-20 text-blue-500" />
                            </div>

                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20">
                                    <Droplets className="w-5 h-5 text-blue-400" />
                                </div>
                                <h2 className="text-lg font-black text-white italic uppercase tracking-tighter">Plan de Hidratación</h2>
                            </div>

                            <form onSubmit={handleCalculateCut} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 block">Peso (kg)</label>
                                        <input type="number" step="any" required value={currentWeight} onChange={(e) => setCurrentWeight(e.target.value)} className="w-full bg-white/5 border border-white/10 text-white text-lg font-black rounded-xl px-4 py-4 outline-none text-center focus:ring-1 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 block">Meta (kg)</label>
                                        <input type="number" step="any" required value={targetKgs} onChange={(e) => setTargetKgs(e.target.value)} className="w-full bg-white/5 border border-white/10 text-white text-lg font-black rounded-xl px-4 py-4 outline-none text-center focus:ring-1 focus:ring-blue-500" />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 block">Días Faltantes</label>
                                    <input type="number" required value={daysLeft} onChange={(e) => setDaysLeft(e.target.value)} className="w-full bg-white/5 border border-white/10 text-orange-400 text-lg font-black rounded-xl px-4 py-4 outline-none text-center focus:ring-1 focus:ring-orange-500" />
                                </div>

                                <button type="submit" className="fighter-btn-primary w-full bg-white text-black hover:bg-gray-200 shadow-xl mt-2">
                                    Calcular Estrategia
                                </button>
                            </form>
                        </div>

                        <AnimatePresence>
                            {plan && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className="fighter-card !bg-transparent glass-panel border-white/10 shadow-2xl"
                                >
                                    <div className="flex justify-between items-center mb-6 pb-6 border-b border-white/5">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Diferencial</p>
                                            <p className="text-4xl font-black text-white">{plan.difference} <span className="text-xs font-normal text-gray-500 uppercase">kg</span></p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Carga Máx Agua</p>
                                            <p className="text-2xl font-black text-blue-400 leading-none">{plan.waterLoadRec}L</p>
                                            <span className="text-[8px] font-black text-blue-500 uppercase">Diarios</span>
                                        </div>
                                    </div>

                                    <div className={`p-5 rounded-2xl border-2 ${plan.dangerLevel === 'high'
                                        ? 'bg-red-500/10 border-red-500/30'
                                        : plan.dangerLevel === 'medium'
                                            ? 'bg-orange-500/10 border-orange-500/30'
                                            : 'bg-emerald-500/10 border-emerald-500/30'
                                        }`}>
                                        <div className="flex items-center gap-2 mb-3">
                                            {plan.dangerLevel === 'high' ? <AlertTriangle className="w-5 h-5 text-red-500" /> : <Info className="w-5 h-5 text-blue-400" />}
                                            <h3 className={`font-black uppercase tracking-tighter text-sm ${plan.dangerLevel === 'high' ? 'text-red-400' : 'text-gray-200'
                                                }`}>
                                                Protocolo {plan.dangerLevel === 'high' ? 'Crítico' : 'Recomendado'}
                                            </h3>
                                        </div>
                                        <p className="text-xs leading-relaxed text-gray-300 font-medium italic">
                                            "{plan.protocol}"
                                        </p>
                                    </div>

                                    {/* Division Insight */}
                                    <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                                        <div>
                                            <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">División IBJJF/UFC</p>
                                            <p className="text-lg font-black text-white italic uppercase tracking-tighter">Peso {db.getWeightClass(Number(currentWeight)).name}</p>
                                        </div>
                                        <Trophy className="w-5 h-5 text-orange-500/50" />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
