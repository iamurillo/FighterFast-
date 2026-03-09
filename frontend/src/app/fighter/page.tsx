"use client";
import React, { useState } from 'react';
import { Flame, Droplet, ShieldAlert, Calendar, Zap, AlertTriangle, Info, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FighterModePage() {
    const [isActive, setIsActive] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="p-6 pb-24 max-w-md mx-auto relative"
        >
            {/* Background elements */}
            <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] transition-all duration-1000 ${isActive ? 'bg-orange-500/20' : 'bg-orange-500/5'}`} />

            {/* Header Premium */}
            <div className="flex items-center gap-4 mb-10 pt-4 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 flex justify-center items-center shadow-2xl">
                    <Flame className={`w-8 h-8 ${isActive ? 'text-orange-500 fill-orange-500' : 'text-orange-500/50'} transition-all duration-700`} />
                </div>
                <div>
                    <span className="text-orange-500 text-[9px] font-black uppercase tracking-[0.3em] mb-1 block">Advanced Protocol</span>
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">Modo <span className="text-orange-500">Peleador</span></h1>
                </div>
            </div>

            {/* Main Status Hero Card */}
            <motion.div
                layout
                className={`fighter-card relative overflow-hidden transition-all duration-700 flex flex-col items-center text-center py-10 px-8 ${isActive
                        ? '!bg-orange-500/5 border-orange-500/40 shadow-[0_0_40px_rgba(249,115,22,0.2)]'
                        : 'border-white/5'
                    }`}
            >
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Zap className="w-24 h-24 text-white" />
                </div>

                <AnimatePresence mode="wait">
                    {isActive ? (
                        <motion.div
                            key="active"
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="flex flex-col items-center"
                        >
                            <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(249,115,22,0.6)]">
                                <Trophy className="w-8 h-8 text-black fill-black" />
                            </div>
                            <h2 className="text-2xl font-black text-white italic uppercase mb-2">Protocolo Activado</h2>
                            <p className="text-xs text-orange-200/80 leading-relaxed font-bold italic max-w-[240px]">
                                ESTÁS EN UN DÉFICIT AGRESIVO. ALTA RETENCIÓN DE PROTEÍNA. AYUNO ESTRATÉGICO SECCIÓN 16:8 Y 20:4.
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="inactive"
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="flex flex-col items-center"
                        >
                            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                                <Flame className="w-8 h-8 text-gray-700" />
                            </div>
                            <h2 className="text-2xl font-black text-gray-500 italic uppercase mb-2">Protocolo Inactivo</h2>
                            <p className="text-xs text-gray-600 leading-relaxed font-black uppercase tracking-tighter mb-4 max-w-[200px]">
                                ACTIVA BAJO TU PROPIO RIESGO PARA PÉRDIDA DE GRASA ACELERADA EXTREMA.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={() => setIsActive(!isActive)}
                    className={`mt-8 px-10 py-4 rounded-2xl font-black tracking-[0.2em] text-xs transition-all duration-500 shadow-xl ${isActive
                            ? 'bg-transparent border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white'
                            : 'bg-orange-500 text-white hover:bg-orange-600 shadow-[0_10px_30px_rgba(249,115,22,0.3)]'
                        }`}
                >
                    {isActive ? 'FINALIZAR PROTOCOLO' : 'ACTIVAR MODO PELEADOR'}
                </button>
            </motion.div>

            <AnimatePresence>
                {isActive && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="space-y-6 mt-6"
                    >
                        {/* Weekly Micro-Cycles Widget */}
                        <div className="fighter-card !bg-transparent glass-panel border-white/10">
                            <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Semana de Transformación</h3>
                            </div>

                            <div className="grid grid-cols-7 gap-1 sm:gap-2">
                                {['L', 'M', 'X', 'J', 'V', 'S'].map(day => (
                                    <div key={day} className="flex flex-col items-center">
                                        <span className="text-[9px] text-gray-600 font-black mb-2">{day}</span>
                                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center group flex-col">
                                            <span className="text-[9px] font-black text-emerald-500 leading-none">16</span>
                                            <span className="text-[6px] font-black text-emerald-500/50 uppercase leading-none mt-0.5">HRS</span>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex flex-col items-center">
                                    <span className="text-[9px] text-orange-500 font-black mb-2">D</span>
                                    <div className="w-9 h-9 rounded-xl bg-orange-500 text-black flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.6)] flex-col">
                                        <span className="text-[9px] font-black leading-none">20</span>
                                        <span className="text-[6px] font-black uppercase leading-none mt-0.5">HRS</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                                <Info className="w-4 h-4 text-gray-500 shrink-0" />
                                <p className="text-[9px] text-gray-500 font-bold leading-relaxed uppercase tracking-tight">
                                    Los domingos el ayuno es de 20h para maximizar la autofagia antes de iniciar la semana.
                                </p>
                            </div>
                        </div>

                        {/* Hydro-Shock Warning Card */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="p-5 rounded-2xl bg-blue-500/10 border-2 border-blue-500/20 flex items-start gap-4 shadow-xl"
                        >
                            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
                                <Droplet className="w-6 h-6 text-blue-400 fill-blue-400 animate-pulse" />
                            </div>
                            <div>
                                <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-1.5 leading-none">Carga de Electrolitos</h3>
                                <p className="text-[10px] text-blue-200/70 font-bold italic leading-relaxed">
                                    ESTE PROTOCOLO AGOTA TUS RESERVAS. AÑADE SAL DE MAR Y MAGNESIO A TU PRIMERA COMIDA DIARIA.
                                </p>
                            </div>
                        </motion.div>

                        {/* Medical Guard Alert */}
                        <div className="p-5 rounded-2xl bg-red-500/10 border-2 border-red-500/20 flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0">
                                <ShieldAlert className="w-6 h-6 text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-xs font-black text-red-400 uppercase tracking-widest mb-1.5 leading-none">Protocolo de Salida</h3>
                                <p className="text-[10px] text-red-200/70 font-bold italic leading-relaxed">
                                    MÁXIMO 8 SEMANAS. SI SIENTES FATIGA CRÓNICA O MAREOS, REGRESA AL PROTOCOLO DE MANTENIMIENTO.
                                </p>
                            </div>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {!isActive && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="mt-12 text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                            <AlertTriangle className="w-3 h-3 text-gray-600" />
                            <span className="text-[8px] font-black text-gray-600 uppercase tracking-[0.2em]">Sólo para atletas experimentados</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
