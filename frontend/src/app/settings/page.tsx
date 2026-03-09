"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, ChevronLeft, Bell, Shield, Palette, Database, Ruler, Target, Save, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { db } from '@/utils/storage';

export default function SettingsPage() {
    const router = useRouter();
    const [settings, setSettings] = useState({
        units: 'metric',
        manualMacros: false,
        theme: 'combat',
        waterReminders: true
    });
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const currentSettings = db.getSettings();
        setSettings(currentSettings);
        setUser(db.getUser());
    }, []);

    const handleSave = () => {
        db.saveSettings(settings);
        alert('Configuración guardada correctamente.');
        router.back();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="p-6 pb-24 max-w-md mx-auto"
        >
            {/* Header */}
            <div className="flex items-center gap-4 mb-10 pt-4">
                <button onClick={() => router.back()} className="p-2 bg-white/5 rounded-xl border border-white/10 active:scale-90 transition-all">
                    <ChevronLeft className="w-5 h-5 text-gray-400" />
                </button>
                <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter">Configuración Elite</h1>
            </div>

            <div className="space-y-8">
                {/* UNIDADES SECTION */}
                <section>
                    <div className="flex items-center gap-2 mb-4 opacity-50">
                        <Ruler className="w-4 h-4 text-white" />
                        <h2 className="text-[10px] font-black uppercase tracking-widest text-white">Preferecias de Unidad</h2>
                    </div>
                    <div className="fighter-card grid grid-cols-2 gap-2 p-1 bg-white/5 border-white/10">
                        <button
                            onClick={() => setSettings({ ...settings, units: 'metric' })}
                            className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${settings.units === 'metric' ? 'bg-[var(--color-fighter-red)] text-white' : 'text-gray-500 hover:text-white'}`}
                        >
                            Métrica (kg/cm)
                        </button>
                        <button
                            onClick={() => setSettings({ ...settings, units: 'imperial' })}
                            className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${settings.units === 'imperial' ? 'bg-[var(--color-fighter-red)] text-white' : 'text-gray-500 hover:text-white'}`}
                        >
                            Imperial (lb/ft)
                        </button>
                    </div>
                </section>

                {/* MACRO CONTROL */}
                <section>
                    <div className="flex items-center gap-2 mb-4 opacity-50">
                        <Target className="w-4 h-4 text-white" />
                        <h2 className="text-[10px] font-black uppercase tracking-widest text-white">Objetivos de Nutrición</h2>
                    </div>
                    <div className="fighter-card border-white/10 bg-white/5 p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-gray-300">Ajuste de Macros Manual</span>
                            <div
                                onClick={() => setSettings({ ...settings, manualMacros: !settings.manualMacros })}
                                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${settings.manualMacros ? 'bg-emerald-500' : 'bg-white/10'}`}
                            >
                                <motion.div
                                    animate={{ x: settings.manualMacros ? 24 : 2 }}
                                    className="w-5 h-5 bg-white rounded-full absolute top-0.5"
                                />
                            </div>
                        </div>
                        <p className="text-[9px] text-gray-500 font-medium">Si se activa, el algoritmo ignorará el cálculo automático basado en tu peso y usará tus propios valores.</p>
                    </div>
                </section>

                {/* THEME SELECTOR */}
                <section>
                    <div className="flex items-center gap-2 mb-4 opacity-50">
                        <Palette className="w-4 h-4 text-white" />
                        <h2 className="text-[10px] font-black uppercase tracking-widest text-white">Tema Visual</h2>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {['combat', 'stealth', 'champion'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setSettings({ ...settings, theme: t })}
                                className={`fighter-card border-white/5 py-4 flex flex-col items-center gap-2 transition-all ${settings.theme === t ? 'border-red-500/50 bg-red-500/5' : 'bg-white/5'}`}
                            >
                                <div className={`w-4 h-4 rounded-full ${t === 'combat' ? 'bg-red-500' : t === 'stealth' ? 'bg-gray-400' : 'bg-amber-400'}`} />
                                <span className="text-[9px] font-black uppercase tracking-tighter text-white">{t}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* NOTIFICATIONS */}
                <section>
                    <div className="flex items-center gap-2 mb-4 opacity-50">
                        <Bell className="w-4 h-4 text-white" />
                        <h2 className="text-[10px] font-black uppercase tracking-widest text-white">Notificaciones</h2>
                    </div>
                    <div className="fighter-card border-white/10 bg-white/5 p-4 flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-300">Recordatorios de Agua</span>
                        <div
                            onClick={() => setSettings({ ...settings, waterReminders: !settings.waterReminders })}
                            className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${settings.waterReminders ? 'bg-blue-500' : 'bg-white/10'}`}
                        >
                            <motion.div
                                animate={{ x: settings.waterReminders ? 24 : 2 }}
                                className="w-5 h-5 bg-white rounded-full absolute top-0.5"
                            />
                        </div>
                    </div>
                </section>

                {/* SAVE BUTTON */}
                <button
                    onClick={handleSave}
                    className="w-full bg-[var(--color-fighter-red)] text-white font-black py-4 rounded-2xl shadow-xl shadow-red-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
                >
                    <Save className="w-5 h-5" />
                    Guardar Cambios
                </button>

                <div className="text-center pt-8">
                    <p className="text-[8px] font-black text-gray-700 uppercase tracking-widest">FighterFast v0.8.0 - Elite Build</p>
                </div>
            </div>
        </motion.div>
    );
}
