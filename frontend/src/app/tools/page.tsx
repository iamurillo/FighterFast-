"use client";
import React, { useState, useEffect } from 'react';
import { Dumbbell, Scale, Plus, Calendar, Droplets, ChevronRight, CheckCircle2, AlertTriangle, Info, BookOpen, Trophy, Timer, Play, Pause, RotateCcw, Volume2, VolumeX, Maximize, Star, Bookmark, Smartphone, SmartphoneCharging } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/utils/storage';

export default function ToolsPage() {
    const [activeTab, setActiveTab] = useState<'diary' | 'techniques' | 'timer' | 'calculator'>('diary');
    const [user, setUser] = useState<any>(null);

    // --- DIARY STATE ---
    const [logs, setLogs] = useState<any[]>([]);
    const [showDiaryForm, setShowDiaryForm] = useState(false);
    const [discipline, setDiscipline] = useState('Jiu-Jitsu / Grappling');
    const [notes, setNotes] = useState('');

    // --- TECHNIQUES STATE (VAULT) ---
    const [techniques, setTechniques] = useState<any[]>([]);
    const [showTechForm, setShowTechForm] = useState(false);
    const [techName, setTechName] = useState('');
    const [techDesc, setTechDesc] = useState('');
    const [techRating, setTechRating] = useState(3);
    const [techDiscipline, setTechDiscipline] = useState('Guardia Cerrada');

    // --- CALCULATOR STATE ---
    const [currentWeight, setCurrentWeight] = useState('');
    const [targetKgs, setTargetKgs] = useState('');
    const [daysLeft, setDaysLeft] = useState('7');
    const [plan, setPlan] = useState<any>(null);

    // --- TIMER STATE ---
    const [roundTime, setRoundTime] = useState(300); // 5 min default
    const [restTime, setRestTime] = useState(60);   // 1 min rest
    const [totalRounds, setTotalRounds] = useState(5);
    const [currentRound, setCurrentRound] = useState(1);
    const [timeLeft, setTimeLeft] = useState(300);
    const [timerActive, setTimerActive] = useState(false);
    const [isResting, setIsResting] = useState(false);
    const [prepTime, setPrepTime] = useState(10);
    const [isPrepping, setIsPrepping] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isEMOM, setIsEMOM] = useState(false);
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [isVibrationEnabled, setIsVibrationEnabled] = useState(true);

    // AUDIO REFS
    const bellRef = React.useRef<HTMLAudioElement>(null);
    const warningRef = React.useRef<HTMLAudioElement>(null);

    const playSound = (type: 'bell' | 'warning' | 'prep') => {
        if (isMuted) return;
        try {
            if (type === 'bell' && bellRef.current) {
                bellRef.current.currentTime = 0;
                bellRef.current.play().catch(() => { });
            } else if (warningRef.current) {
                warningRef.current.currentTime = 0;
                warningRef.current.play().catch(() => { });
            }
        } catch (e) { }
    };

    const triggerVibrate = (pattern: number | number[]) => {
        if (!isVibrationEnabled || typeof window === 'undefined' || !navigator.vibrate) return;
        try {
            navigator.vibrate(pattern);
        } catch (e) { }
    };

    // Load Timer Config
    useEffect(() => {
        const config = db.getTimerConfig();
        if (config) {
            setRoundTime(config.roundTime || 300);
            setRestTime(config.restTime || 60);
            setTotalRounds(config.totalRounds || 5);
            setTimeLeft(config.roundTime || 300);
        }
    }, []);

    // Save Timer Config
    useEffect(() => {
        db.setTimerConfig({ roundTime, restTime, totalRounds });
    }, [roundTime, restTime, totalRounds]);


    useEffect(() => {
        let interval: any;
        if (timerActive && timeLeft > 0) {
            interval = setInterval(() => {
                const nextTime = timeLeft - 1;

                // EMOM Logic: Bell every 60 seconds, no resting.
                if (isEMOM && !isPrepping && nextTime > 0 && nextTime % 60 === 0) {
                    playSound('bell');
                    triggerVibrate(500);
                }

                if (nextTime === 10 && !isResting && !isPrepping && !isEMOM) {
                    playSound('warning');
                    triggerVibrate([100, 100, 100]);
                }
                if (nextTime === 3 && isPrepping) {
                    playSound('prep');
                    triggerVibrate(50);
                }
                setTimeLeft(nextTime);
            }, 1000);
        } else if (timerActive && timeLeft === 0) {
            if (isPrepping) {
                setIsPrepping(false);
                setTimeLeft(roundTime);
                playSound('bell');
                triggerVibrate(800);
            } else if (!isResting) {
                if (currentRound < totalRounds) {
                    setIsResting(true);
                    setTimeLeft(restTime);
                    playSound('bell');
                    triggerVibrate([400, 200, 400]);
                } else {
                    setTimerActive(false);
                    playSound('bell');
                    playSound('bell');
                    triggerVibrate([800, 200, 800, 200, 800]);
                }
            } else {
                setIsResting(false);
                setIsPrepping(true);
                setTimeLeft(10);
                setCurrentRound((prev) => prev + 1);
                playSound('prep');
                triggerVibrate(150);
            }
        }
        return () => clearInterval(interval);
    }, [timerActive, timeLeft, isResting, currentRound, totalRounds, roundTime, restTime]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleStartTimer = () => {
        if (!timerActive) {
            // Unlock audio for mobile browsers
            if (bellRef.current && warningRef.current) {
                bellRef.current.play().catch(() => { });
                bellRef.current.pause();
                warningRef.current.play().catch(() => { });
                warningRef.current.pause();
            }

            if (timeLeft === roundTime && !isPrepping && !isResting) {
                setIsPrepping(true);
                setTimeLeft(10);
                playSound('warning'); // Sound indicating prep start
            }
            setTimerActive(true);
        } else {
            setTimerActive(false);
        }
    };

    const handleResetTimer = () => {
        setTimerActive(false);
        setIsResting(false);
        setIsPrepping(false);
        setCurrentRound(1);
        setTimeLeft(roundTime);
    };

    const setTimerMode = (type: 'BJJ' | 'MMA' | 'BOX' | 'EMOM') => {
        setTimerActive(false);
        setIsResting(false);
        setIsPrepping(false);
        setCurrentRound(1);
        setIsEMOM(false);
        if (type === 'BJJ') { setRoundTime(300); setTimeLeft(300); setRestTime(60); setTotalRounds(5); }
        if (type === 'MMA') { setRoundTime(300); setTimeLeft(300); setRestTime(60); setTotalRounds(3); }
        if (type === 'BOX') { setRoundTime(180); setTimeLeft(180); setRestTime(60); setTotalRounds(12); }
        if (type === 'EMOM') { setIsEMOM(true); setRoundTime(600); setTimeLeft(600); setRestTime(0); setTotalRounds(1); } // 10 min continous
    };

    useEffect(() => {
        const storedUser = db.getUser();
        if (storedUser) {
            setUser(storedUser);
            setCurrentWeight(storedUser.current_weight?.toString() || '');
            setTargetKgs(storedUser.target_weight?.toString() || '');
        }
        setLogs(db.getTrainingLogs().reverse()); // Mostrar recientes primero
        setTechniques(db.getTechniques().reverse());
    }, []);

    const handleAddLog = (e: React.FormEvent) => {
        e.preventDefault();
        const today = new Date().toISOString().split('T')[0];
        db.addTrainingDiaryLog(today, discipline, notes);
        setLogs(db.getTrainingLogs().reverse());
        setNotes('');
        setShowDiaryForm(false);
    };

    const handleAddTechnique = (e: React.FormEvent) => {
        e.preventDefault();
        db.addTechnique(techName, techDesc, techDiscipline, techRating);
        setTechniques(db.getTechniques().reverse());
        setTechName('');
        setTechDesc('');
        setTechRating(3);
        setShowTechForm(false);
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
            className="p-6 pb-24 max-w-md mx-auto relative"
        >
            <audio ref={bellRef} src="https://actions.google.com/sounds/v1/sports/boxing_bell_mixed.ogg" preload="auto" />
            <audio ref={warningRef} src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg" preload="auto" />

            {/* Header */}
            <div className="flex justify-between items-center mb-8 pt-4">
                <div>
                    <span className="text-[var(--color-fighter-red)] text-[10px] font-black uppercase tracking-[0.2em] mb-1">Fight Prep</span>
                    <h1 className="text-3xl font-black text-white leading-none">Herramientas</h1>
                </div>
            </div>

            {/* Tab Selector - Scrollable Flex */}
            <div className="flex bg-white/5 backdrop-blur-md rounded-2xl p-1.5 mb-8 border border-white/5 overflow-x-auto no-scrollbar gap-1">
                <button
                    onClick={() => setActiveTab('diary')}
                    className={`min-w-[80px] flex-1 py-3 px-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1.5 flex-col ${activeTab === 'diary'
                        ? 'bg-[var(--color-fighter-red)] text-white shadow-[0_0_15px_rgba(225,29,72,0.3)]'
                        : 'text-gray-500 hover:text-gray-300'
                        }`}
                >
                    <BookOpen className="w-4 h-4" /> Entreno
                </button>
                <button
                    onClick={() => setActiveTab('techniques')}
                    className={`min-w-[80px] flex-1 py-3 px-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1.5 flex-col ${activeTab === 'techniques'
                        ? 'bg-[var(--color-fighter-red)] text-white shadow-[0_0_15px_rgba(225,29,72,0.3)]'
                        : 'text-gray-500 hover:text-gray-300'
                        }`}
                >
                    <Bookmark className="w-4 h-4" /> Técnicas
                </button>
                <button
                    onClick={() => setActiveTab('timer')}
                    className={`min-w-[80px] flex-1 py-3 px-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1.5 flex-col ${activeTab === 'timer'
                        ? 'bg-[var(--color-fighter-red)] text-white shadow-[0_0_15px_rgba(225,29,72,0.3)]'
                        : 'text-gray-500 hover:text-gray-300'
                        }`}
                >
                    <Timer className="w-4 h-4" /> Rounds
                </button>
                <button
                    onClick={() => setActiveTab('calculator')}
                    className={`min-w-[80px] flex-1 py-3 px-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1.5 flex-col ${activeTab === 'calculator'
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

                {/* --- TECHNIQUES TAB --- */}
                {activeTab === 'techniques' && (
                    <motion.div
                        key="techniques"
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                        className="space-y-6"
                    >
                        <div className="flex justify-between items-center">
                            <h2 className="text-sm font-black text-gray-500 uppercase tracking-widest shadow-white">Biblioteca BJJ</h2>
                            <button
                                onClick={() => setShowTechForm(!showTechForm)}
                                className="bg-white/5 border border-white/10 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-all"
                            >
                                <Plus className={`w-3.5 h-3.5 transition-transform ${showTechForm ? 'rotate-45' : ''}`} /> {showTechForm ? 'Cerrar' : 'Añadir'}
                            </button>
                        </div>

                        <AnimatePresence>
                            {showTechForm && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <form onSubmit={handleAddTechnique} className="fighter-card mb-6 border-[var(--color-fighter-red)]/20">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 block">Nombre de la Técnica</label>
                                        <input
                                            required placeholder="Ej: Triángulo desde Guardia Cerrada"
                                            value={techName} onChange={(e) => setTechName(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 text-white text-sm font-bold rounded-xl px-4 py-4 outline-none mb-4 focus:ring-1 focus:ring-[var(--color-fighter-red)]"
                                        />

                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 block">Categoría / Posición</label>
                                        <select
                                            value={techDiscipline} onChange={(e) => setTechDiscipline(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-4 outline-none mb-4 appearance-none focus:ring-1 focus:ring-[var(--color-fighter-red)]"
                                        >
                                            <option value="Guardia Cerrada">Guardia Cerrada</option>
                                            <option value="Media Guardia">Media Guardia</option>
                                            <option value="Montada">Montada</option>
                                            <option value="Control Lateral / 100k">Control Lateral / 100k</option>
                                            <option value="Espalda">Espalda</option>
                                            <option value="Derribos / Pie">Derribos / Pie</option>
                                        </select>

                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 block">Dominio (1 al 5)</label>
                                        <div className="flex gap-2 mb-6">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star} type="button"
                                                    onClick={() => setTechRating(star)}
                                                    className={`p-2 rounded-lg transition-all ${techRating >= star ? 'bg-yellow-500/20 text-yellow-500' : 'bg-white/5 text-gray-600'}`}
                                                >
                                                    <Star className={`w-6 h-6 ${techRating >= star ? 'fill-current' : ''}`} />
                                                </button>
                                            ))}
                                        </div>

                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 block">Detalles / Pasos</label>
                                        <textarea
                                            required placeholder="1. Agarre de manga y cuello..."
                                            value={techDesc} onChange={(e) => setTechDesc(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-4 outline-none h-24 resize-none mb-4 focus:ring-1 focus:ring-[var(--color-fighter-red)]"
                                        ></textarea>

                                        <button type="submit" className="fighter-btn-primary w-full shadow-[0_0_15px_rgba(225,29,72,0.3)]">
                                            Guardar Técnica
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-4">
                            {techniques.length === 0 ? (
                                <div className="fighter-card bg-transparent border-dashed border-white/10 text-center py-12">
                                    <Bookmark className="w-10 h-10 text-gray-700 mx-auto mb-4" />
                                    <p className="text-gray-500 text-sm font-bold italic">Tu biblioteca de técnicas está vacía.</p>
                                    <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-2">Añade tu arsenal BJJ para estudiarlo</p>
                                </div>
                            ) : (
                                techniques.map((tech: any, idx) => (
                                    <motion.div
                                        key={tech.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="fighter-card relative overflow-hidden group border-l-4 border-l-[var(--color-fighter-red)]"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex-1">
                                                <div className="px-2 py-1 inline-block bg-[var(--color-fighter-red)]/10 text-[var(--color-fighter-red)] text-[9px] font-black uppercase tracking-widest rounded-md mb-2">
                                                    {tech.discipline}
                                                </div>
                                                <h3 className="font-black text-white italic text-base uppercase leading-tight tracking-tight">{tech.name}</h3>
                                            </div>
                                            <div className="flex items-center gap-0.5 ml-2 bg-black/30 rounded-lg p-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star key={star} className={`w-3 h-3 ${tech.rating >= star ? 'text-yellow-500 fill-current' : 'text-gray-700'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-400 leading-relaxed font-medium">"{tech.description}"</p>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}

                {/* --- TIMER TAB --- */}
                {activeTab === 'timer' && (
                    <motion.div
                        key="timer"
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-6"
                    >
                        {/* Round Counter */}
                        <div className="flex justify-around items-center mb-6">
                            {[1, 2, 3].map((m) => (
                                <div key={m} className={`flex flex-col items-center opacity-30 ${currentRound === m ? 'opacity-100' : ''}`}>
                                    <div className={`w-1 h-1 rounded-full mb-1 ${currentRound === m ? 'bg-[var(--color-fighter-red)]' : 'bg-gray-500'}`} />
                                    <span className="text-[10px] font-black text-gray-400">R{m}</span>
                                </div>
                            ))}
                            <span className="text-sm font-black text-white italic">ROUND {currentRound}/{totalRounds}</span>
                            {[4, 5, 6].map((m) => (
                                <div key={m} className={`flex flex-col items-center opacity-30 ${currentRound === m ? 'opacity-100' : ''}`}>
                                    <div className={`w-1 h-1 rounded-full mb-1 ${currentRound === m ? 'bg-[var(--color-fighter-red)]' : 'bg-gray-500'}`} />
                                    <span className="text-[10px] font-black text-gray-400">R{m}</span>
                                </div>
                            ))}
                        </div>

                        {/* Main Display */}
                        <div className={`fighter-card py-16 text-center border-t-8 transition-colors duration-500 relative ${isResting ? 'border-t-blue-500 bg-blue-500/5' : isPrepping ? 'border-t-yellow-500 bg-yellow-500/5' : isEMOM ? 'border-t-purple-500 bg-purple-500/5' : 'border-t-[var(--color-fighter-red)] bg-white/5'} ${isFocusMode ? 'fixed inset-0 z-50 flex flex-col justify-center rounded-none m-0 border-t-0 border-b-8 bg-black' : ''}`}>
                            <div className="absolute top-4 right-4 flex gap-3">
                                <button onClick={() => setIsFocusMode(!isFocusMode)} className="text-gray-600 hover:text-white transition-colors">
                                    <Maximize className="w-5 h-5" />
                                </button>
                                <button onClick={() => setIsVibrationEnabled(!isVibrationEnabled)} className={`${isVibrationEnabled ? 'text-yellow-500' : 'text-gray-600'} hover:text-white transition-colors`}>
                                    <SmartphoneCharging className="w-5 h-5" />
                                </button>
                                <button onClick={() => setIsMuted(!isMuted)} className="text-gray-600 hover:text-white transition-colors">
                                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                </button>
                            </div>

                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-4">
                                {isResting ? 'Descanso' : isPrepping ? 'Prepárate...' : isEMOM ? 'EMOM MODE' : 'Fight!'}
                            </p>
                            <h2 className={`${isFocusMode ? 'text-[9rem]' : 'text-8xl'} font-black italic tracking-tighter tabular-nums ${isResting ? 'text-blue-400' : isPrepping ? 'text-yellow-400' : isEMOM ? 'text-purple-400' : 'text-white'}`}>
                                {formatTime(timeLeft)}
                            </h2>
                            {timeLeft <= 10 && !isResting && !isPrepping && timerActive && (
                                <motion.div
                                    animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1 }}
                                    className={`text-[10px] sm:text-lg font-black mt-4 uppercase tracking-widest ${isEMOM ? 'text-purple-400' : 'text-[var(--color-fighter-red)]'}`}
                                >
                                    ¡Últimos Segundos!
                                </motion.div>
                            )}

                            {isFocusMode && (
                                <button onClick={() => setIsFocusMode(false)} className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest text-gray-500 border border-white/10 rounded-xl px-6 py-3">
                                    Salir Focus
                                </button>
                            )}
                        </div>

                        {/* Quick Modes */}
                        <div className="grid grid-cols-4 gap-2">
                            {['BJJ', 'MMA', 'BOX', 'EMOM'].map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => setTimerMode(mode as any)}
                                    className={`bg-white/5 border text-[10px] font-black py-4 rounded-xl hover:bg-white/10 transition-all uppercase tracking-widest ${mode === 'EMOM' && isEMOM ? 'border-purple-500/50 text-purple-400' : 'border-white/10 text-gray-400 hover:text-white'}`}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>

                        {/* Custom Settings Panel */}
                        <div className="fighter-card !bg-transparent border-white/5 grid grid-cols-3 gap-4">
                            <div>
                                <label className="text-[8px] font-black text-gray-600 uppercase mb-1 block">Round (min)</label>
                                <input
                                    type="number" value={roundTime / 60}
                                    onChange={(e) => {
                                        const val = Number(e.target.value) * 60;
                                        setRoundTime(val);
                                        if (!timerActive) setTimeLeft(val);
                                    }}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 text-center text-sm font-black text-white outline-none focus:ring-1 focus:ring-[var(--color-fighter-red)]"
                                />
                            </div>
                            <div>
                                <label className="text-[8px] font-black text-gray-600 uppercase mb-1 block">Rest (sec)</label>
                                <input
                                    type="number" value={restTime}
                                    onChange={(e) => setRestTime(Number(e.target.value))}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 text-center text-sm font-black text-white outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-[8px] font-black text-gray-600 uppercase mb-1 block">Rounds</label>
                                <input
                                    type="number" value={totalRounds}
                                    onChange={(e) => setTotalRounds(Number(e.target.value))}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 text-center text-sm font-black text-white outline-none focus:ring-1 focus:ring-purple-500"
                                />
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex gap-4">
                            <button
                                onClick={handleResetTimer}
                                className="flex-1 bg-white/5 border border-white/10 py-5 rounded-2xl flex items-center justify-center text-gray-400 hover:text-white transition-all"
                            >
                                <RotateCcw className="w-6 h-6" />
                            </button>
                            <button
                                onClick={handleStartTimer}
                                className={`flex-[3] py-5 rounded-2xl flex items-center justify-center shadow-2xl transition-all ${timerActive ? 'bg-white text-black' : 'bg-[var(--color-fighter-red)] text-white shadow-[0_0_30px_rgba(225,29,72,0.4)]'}`}
                            >
                                {timerActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                            </button>
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
