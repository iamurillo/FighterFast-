"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Timer, Utensils, Flame, User as UserIcon, Dumbbell, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BottomNav() {
    const pathname = usePathname();

    // No mostrar en login, registro o landing
    if (['/login', '/register', '/'].includes(pathname)) return null;

    const navItems = [
        { name: 'Ayuno', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Dieta', path: '/nutrition', icon: Utensils },
        { name: 'Fighter', path: '/fighter', icon: Flame },
        { name: 'Recursos', path: '/tools', icon: Dumbbell },
        { name: 'Perfil', path: '/profile', icon: UserIcon },
    ];

    return (
        <div className="fixed bottom-6 left-0 w-full px-6 z-50 pointer-events-none">
            <nav className="max-w-md mx-auto bg-black/40 backdrop-blur-2xl border border-white/10 h-16 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-around px-2 pointer-events-auto relative overflow-hidden">
                {/* Subtle shine effect inside the nav */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />

                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.path}
                            className="relative flex flex-col items-center justify-center w-full h-full group"
                        >
                            <div className="relative flex flex-col items-center transition-all duration-300">
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-active-bg"
                                        className={`absolute -inset-2 rounded-xl blur-md opacity-20 ${item.name === 'Fighter' ? 'bg-orange-500' : 'bg-[var(--color-fighter-red)]'
                                            }`}
                                    />
                                )}

                                <Icon className={`w-5 h-5 mb-1 transition-all duration-300 ${isActive
                                    ? (item.name === 'Fighter' ? 'text-orange-500 scale-110' : 'text-[var(--color-fighter-red)] scale-110')
                                    : 'text-gray-500 group-hover:text-gray-300'
                                    }`} />

                                <span className={`text-[8px] font-black uppercase tracking-[0.1em] transition-all duration-300 ${isActive ? 'text-white opacity-100' : 'text-gray-500 opacity-60'
                                    }`}>
                                    {item.name}
                                </span>

                                {isActive && (
                                    <motion.div
                                        layoutId="nav-dot"
                                        className={`absolute -bottom-1.5 w-1 h-1 rounded-full ${item.name === 'Fighter' ? 'bg-orange-500' : 'bg-[var(--color-fighter-red)]'
                                            } shadow-[0_0_5px_currentColor]`}
                                    />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
