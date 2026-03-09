"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Zap, Star, ShieldCheck } from 'lucide-react';

interface LevelUpModalProps {
    level: number;
    isVisible: boolean;
    onClose: () => void;
}

export const LevelUpModal = ({ level, isVisible, onClose }: LevelUpModalProps) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md"
                >
                    <motion.div
                        initial={{ scale: 0.5, y: 100, rotate: -10 }}
                        animate={{ scale: 1, y: 0, rotate: 0 }}
                        exit={{ scale: 0.5, y: 100, opacity: 0 }}
                        className="relative w-full max-w-sm overflow-hidden"
                    >
                        {/* Background Fireworks simulation with animated icons */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            {[...Array(6)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0, x: 0, y: 0 }}
                                    animate={{
                                        scale: [0, 1, 0],
                                        x: (i % 2 === 0 ? 1 : -1) * (Math.random() * 150),
                                        y: (i < 3 ? 1 : -1) * (Math.random() * 150)
                                    }}
                                    transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                                    className="absolute"
                                >
                                    <Star className="text-yellow-500 w-8 h-8 opacity-20" />
                                </motion.div>
                            ))}
                        </div>

                        <div className="fighter-card relative z-10 border-amber-500/30 bg-gradient-to-b from-amber-500/10 to-transparent p-8 text-center flex flex-col items-center">
                            <motion.div
                                animate={{
                                    rotate: [0, -10, 10, -10, 0],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{ repeat: Infinity, duration: 3 }}
                                className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.5)] mb-8"
                            >
                                <Trophy className="w-12 h-12 text-white" />
                            </motion.div>

                            <p className="text-[12px] font-black text-amber-500 uppercase tracking-[0.4em] mb-2 leading-none">Power Up</p>
                            <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-4">Nivel {level}</h2>

                            <div className="w-full h-px bg-white/10 mb-6" />

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3 text-left">
                                    <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center border border-orange-500/20">
                                        <Zap className="w-4 h-4 text-orange-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-white uppercase tracking-tighter italic">Nuevas Técnicas Desbloqueadas</p>
                                        <p className="text-[8px] text-gray-500 font-bold uppercase">Tu arsenal de combate está creciendo.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-left">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20">
                                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-white uppercase tracking-tighter italic">Resistencia Mental +10</p>
                                        <p className="text-[8px] text-gray-500 font-bold uppercase">La disciplina forja el espíritu.</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="w-full bg-white text-black font-black py-4 rounded-2xl uppercase tracking-[0.2em] text-xs hover:bg-amber-500 hover:text-white transition-all active:scale-95"
                            >
                                Continuar Guerra
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
