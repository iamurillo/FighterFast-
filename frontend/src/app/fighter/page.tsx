"use client";
import React, { useState } from 'react';
import { Flame, Droplet, ShieldAlert, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FighterModePage() {
    const [isActive, setIsActive] = useState(false);

    return (
        <div className="p-6">

            {/* Header */}
            <div className="flex items-center gap-3 mb-8 pt-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/50 flex justify-center items-center">
                    <Flame className="w-7 h-7 text-orange-500" />
                </div>
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-white mb-0">Modo Peleador</h1>
                    <p className="text-xs font-bold text-orange-500 uppercase tracking-widest">Protocolo Avanzado</p>
                </div>
            </div>

            {/* Main Status Toggle */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-6 rounded-2xl border transition-all duration-500 mb-6 flex flex-col items-center justify-center text-center ${isActive
                    ? 'bg-orange-500/10 border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.15)]'
                    : 'bg-[var(--color-fighter-surface)] border-[var(--color-fighter-surface-hover)]'
                    }`}>
                <Flame className={`w-12 h-12 mb-3 transition-colors duration-500 ${isActive ? 'text-orange-500' : 'text-gray-600'}`} />
                <h2 className="text-xl font-bold mb-2">{isActive ? 'Protocolo Activado' : 'Protocolo Inactivo'}</h2>
                <p className="text-sm text-gray-400 mb-6">
                    {isActive
                        ? 'Estás en un déficit agresivo con alta retención de proteína. Ayuno de 16h lun-sab, y 20h el domingo.'
                        : 'Activa este protocolo sólo si estás preparándote para un pesaje o buscas pérdida de grasa acelerada extrema.'}
                </p>

                <button
                    onClick={() => setIsActive(!isActive)}
                    className={`px-8 py-3 rounded-xl font-bold tracking-widest text-sm transition-all duration-300 ${isActive
                        ? 'bg-transparent border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white'
                        : 'bg-orange-500 text-white hover:bg-orange-600 shadow-[0_0_20px_rgba(249,115,22,0.3)]'
                        }`}
                >
                    {isActive ? 'DESACTIVAR' : 'ACTIVAR MODO PELEADOR'}
                </button>
            </motion.div>

            {isActive && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-4"
                >

                    {/* Calendar Widget */}
                    <div className="bg-[var(--color-fighter-surface)] p-4 rounded-xl border border-[var(--color-fighter-surface-hover)]">
                        <div className="flex items-center gap-2 mb-4">
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Semana Actual</h3>
                        </div>

                        <div className="flex justify-between">
                            {['L', 'M', 'X', 'J', 'V', 'S'].map(day => (
                                <div key={day} className="flex flex-col items-center">
                                    <span className="text-xs text-gray-500 font-bold mb-1">{day}</span>
                                    <div className="w-8 h-8 rounded-full bg-[var(--color-fighter-green)]/20 border border-[var(--color-fighter-green)] flex items-center justify-center">
                                        <span className="text-[10px] font-bold text-[var(--color-fighter-green)]">16h</span>
                                    </div>
                                </div>
                            ))}
                            <div className="flex flex-col items-center">
                                <span className="text-xs text-orange-500 font-bold mb-1">D</span>
                                <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-[0_0_10px_rgba(249,115,22,0.5)]">
                                    <span className="text-[10px] font-bold">20h</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hydration Alert */}
                    <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/30 flex items-start gap-4">
                        <Droplet className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                        <div>
                            <h3 className="text-sm font-bold text-blue-400 mb-1">Alerta de Hidratación</h3>
                            <p className="text-xs text-blue-200">En este protocolo tu cuerpo pierde agua rápidamente. Añade 1/2 cucharadita de sal marina al agua de la mañana para mantener electrolitos.</p>
                        </div>
                    </div>

                    {/* Warning */}
                    <div className="bg-red-900/20 p-4 rounded-xl border border-red-500/30 flex items-start gap-4">
                        <ShieldAlert className="w-6 h-6 text-[var(--color-fighter-red)] shrink-0 mt-1" />
                        <div>
                            <h3 className="text-sm font-bold text-[var(--color-fighter-red)] mb-1">Advertencia Médica</h3>
                            <p className="text-xs text-red-200">No sostengas este protocolo por más de 6-8 semanas continuas para evitar fatiga adrenal.</p>
                        </div>
                    </div>

                </motion.div>
            )}

        </div>
    );
}
