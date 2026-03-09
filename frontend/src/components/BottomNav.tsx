"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Timer, Utensils, Flame, User as UserIcon } from 'lucide-react';

export default function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Ayuno', path: '/dashboard', icon: Timer },
        { name: 'Dieta', path: '/nutrition', icon: Utensils },
        { name: 'Peleador', path: '/fighter', icon: Flame },
        { name: 'Perfil', path: '/profile', icon: UserIcon },
    ];

    return (
        <nav className="fixed bottom-0 w-full bg-[var(--color-fighter-surface)] border-t border-[var(--color-fighter-surface-hover)] pb-secure z-50">
            <div className="flex justify-around items-center h-16 max-w-md mx-auto px-6">
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.path}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? 'text-[var(--color-fighter-red)]' : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            <Icon className={`w-6 h-6 ${isActive && item.name === 'Peleador' ? 'text-orange-500 fill-orange-500/20' : ''}`} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
