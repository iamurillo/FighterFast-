"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('fighterToken');
    const timer = setTimeout(() => {
      if (token) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }, 1500); // Dar tiempo a la animación de carga premium

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-fighter-background)] text-white overflow-hidden relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[var(--color-fighter-red)]/10 rounded-full blur-[100px]" />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-[var(--color-fighter-surface)] to-black rounded-[2rem] flex items-center justify-center shadow-2xl mb-8 border border-white/10 relative group">
          <div className="absolute inset-0 bg-[var(--color-fighter-red)]/20 blur-xl animate-pulse rounded-full" />
          <Zap className="w-12 h-12 text-[var(--color-fighter-red)] fill-[var(--color-fighter-red)] relative z-10" />
        </div>

        <h1 className="text-4xl font-black tracking-tighter italic mb-2 uppercase">
          FIGHTER<span className="text-[var(--color-fighter-red)]">FAST</span>
        </h1>
        <div className="flex items-center gap-3">
          <div className="h-[2px] w-8 bg-gradient-to-r from-transparent to-[var(--color-fighter-red)] rounded-full" />
          <p className="text-[10px] font-black tracking-[0.4em] uppercase text-gray-400">Loading Performance...</p>
          <div className="h-[2px] w-8 bg-gradient-to-l from-transparent to-[var(--color-fighter-red)] rounded-full" />
        </div>
      </motion.div>

      {/* Bottom version tag */}
      <div className="absolute bottom-10 text-[9px] font-black text-gray-800 tracking-[0.5em] uppercase pointer-events-none">
        Elite System v1.0
      </div>
    </div>
  );
}
