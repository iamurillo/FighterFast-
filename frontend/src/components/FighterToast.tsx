"use client";
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Trophy, Shield, Info } from 'lucide-react';

interface FighterToastProps {
    message: string;
    type?: 'xp' | 'level' | 'success' | 'info';
    isVisible: boolean;
    onClose: () => void;
    xpAmount?: number;
}

export const FighterToast = ({ message, type = 'success', isVisible, onClose, xpAmount }: FighterToastProps) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    const getIcon = () => {
        switch (type) {
            case 'xp': return <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />;
            case 'level': return <Trophy className="w-5 h-5 text-yellow-500" />;
            case 'success': return <Shield className="w-5 h-5 text-emerald-500" />;
            default: return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                    className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm"
                >
                    <div className="glass-panel border-white/10 p-4 shadow-2xl overflow-hidden relative group">
                        {/* Animated background glow */}
                        <div className={`absolute -inset-1 opacity-20 blur-lg group-hover:opacity-40 transition-opacity ${type === 'xp' ? 'bg-amber-500' : type === 'level' ? 'bg-yellow-500' : 'bg-emerald-500'
                            }`} />

                        <div className="flex items-center gap-4 relative z-10">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${type === 'xp' ? 'bg-amber-500/20' : type === 'level' ? 'bg-yellow-500/20' : 'bg-emerald-500/20'
                                }`}>
                                {getIcon()}
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                                    {type === 'xp' ? 'Warrior Reward' : type === 'level' ? 'New Rank Unlocked' : 'Success'}
                                </p>
                                <p className="text-sm font-black text-white italic uppercase tracking-tight">
                                    {message}
                                </p>
                            </div>
                            {xpAmount && (
                                <div className="text-right">
                                    <p className="text-xl font-black text-amber-500 italic tracking-tighter">+{xpAmount}</p>
                                    <p className="text-[8px] font-black text-amber-500/50 uppercase">XP</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
