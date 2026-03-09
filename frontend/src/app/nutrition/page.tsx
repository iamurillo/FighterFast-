"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Search, CheckCircle2, Utensils, Flame, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/utils/storage';

export default function NutritionPage() {
    const [dailyData, setDailyData] = useState<any>({ meals: [], summary: { calories: 0, protein: 0, carbs: 0, fats: 0 } });
    const [showAddForm, setShowAddForm] = useState(false);
    const [loading, setLoading] = useState(true);

    // Form State
    const [mealName, setMealName] = useState('');
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [carbs, setCarbs] = useState('');
    const [fats, setFats] = useState('');
    const [mealType, setMealType] = useState('lunch');
    const [saveAsCustom, setSaveAsCustom] = useState(false);

    const [searchResults, setSearchResults] = useState<any[]>([]);

    useEffect(() => {
        fetchDailyMeals();
    }, []);

    const handleSearchFood = (query: string) => {
        setMealName(query);
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }
        const results = db.searchFoods(query);
        setSearchResults(results);
    };

    const selectFood = (food: any) => {
        setMealName(food.name);
        setCalories(food.calories_per_portion.toString());
        setProtein(food.protein.toString());
        setCarbs(food.carbs.toString());
        setFats(food.fats.toString());
        setSearchResults([]);
    };

    const fetchDailyMeals = () => {
        const data = db.getDailyMeals();
        setDailyData(data);
        setLoading(false);
    };

    const handleAddMeal = (e: React.FormEvent) => {
        e.preventDefault();
        const newMeal = {
            name: mealName,
            calories: Number(calories),
            protein: Number(protein) || 0,
            carbs: Number(carbs) || 0,
            fats: Number(fats) || 0,
            meal_type: mealType
        };
        db.addMeal(newMeal);

        if (saveAsCustom) {
            db.addCustomFood({
                name: mealName,
                calories_per_portion: Number(calories),
                protein: Number(protein) || 0,
                carbs: Number(carbs) || 0,
                fats: Number(fats) || 0,
                default_portion: '1 porción'
            });
        }

        setShowAddForm(false);
        setMealName(''); setCalories(''); setProtein(''); setCarbs(''); setFats(''); setSaveAsCustom(false);
        fetchDailyMeals();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="p-6 pb-24 max-w-md mx-auto"
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-10 pt-4">
                <div>
                    <span className="text-[var(--color-fighter-red)] text-[10px] font-black uppercase tracking-[0.2em] mb-1">Fuel Your Fight</span>
                    <h1 className="text-3xl font-black text-white leading-none">Nutrición</h1>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="w-12 h-12 rounded-2xl bg-[var(--color-fighter-red)] text-white flex justify-center items-center shadow-[0_0_20px_rgba(225,29,72,0.3)] transition-all active:scale-90"
                >
                    <Plus className={`w-7 h-7 transition-transform duration-300 ${showAddForm ? 'rotate-45' : 'rotate-0'}`} />
                </button>
            </div>

            {/* Add Meal Form - Modern Modal-like */}
            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="fighter-card mb-10 overflow-visible relative z-30"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Registrar Comida</h3>
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                <Utensils className="w-4 h-4 text-gray-500" />
                            </div>
                        </div>

                        <form onSubmit={handleAddMeal} className="space-y-4">
                            <div className="relative">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 block">Nombre del Alimento</label>
                                <div className="relative">
                                    <input
                                        required type="text" placeholder="Ej. Pollo, Batido, Avena..."
                                        value={mealName} onChange={(e) => handleSearchFood(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl pl-10 pr-4 py-4 outline-none focus:ring-1 focus:ring-[var(--color-fighter-red)] transition-all"
                                    />
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                </div>

                                {/* Search Results Glass Popup */}
                                <AnimatePresence>
                                    {searchResults.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="absolute z-40 w-full glass-panel rounded-2xl mt-2 max-h-56 overflow-y-auto shadow-2xl border-white/10"
                                        >
                                            {searchResults.map((f: any) => (
                                                <div
                                                    key={f.id}
                                                    onClick={() => selectFood(f)}
                                                    className="p-4 border-b border-white/5 hover:bg-white/10 cursor-pointer flex justify-between items-center transition-colors"
                                                >
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-white text-sm">{f.name}</span>
                                                        <span className="text-[10px] text-gray-500 uppercase font-black">{f.default_portion}</span>
                                                    </div>
                                                    <span className="text-[var(--color-fighter-red)] font-black text-sm">{f.calories_per_portion} <span className="text-[10px] uppercase opacity-50">kcal</span></span>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 block">Calorías</label>
                                    <input
                                        required type="number" placeholder="0"
                                        value={calories} onChange={(e) => setCalories(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-4 outline-none focus:ring-1 focus:ring-[var(--color-fighter-red)]"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 block">Tipo</label>
                                    <select
                                        value={mealType} onChange={(e) => setMealType(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-4 outline-none focus:ring-1 focus:ring-[var(--color-fighter-red)] appearance-none"
                                    >
                                        <option value="breakfast">Desayuno</option>
                                        <option value="lunch">Almuerzo</option>
                                        <option value="dinner">Cena</option>
                                        <option value="snack">Snack</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block text-center">Macros de la Porción (g)</label>
                                <div className="grid grid-cols-3 gap-3">
                                    <input type="number" placeholder="Prot" value={protein} onChange={(e) => setProtein(e.target.value)} className="bg-white/5 border border-white/10 text-red-400 text-sm font-black rounded-xl px-2 py-3 outline-none text-center focus:border-red-500/50" />
                                    <input type="number" placeholder="Carb" value={carbs} onChange={(e) => setCarbs(e.target.value)} className="bg-white/5 border border-white/10 text-blue-400 text-sm font-black rounded-xl px-2 py-3 outline-none text-center focus:border-blue-500/50" />
                                    <input type="number" placeholder="Fat" value={fats} onChange={(e) => setFats(e.target.value)} className="bg-white/5 border border-white/10 text-emerald-400 text-sm font-black rounded-xl px-2 py-3 outline-none text-center focus:border-emerald-500/50" />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
                                <input
                                    type="checkbox" id="saveCustom"
                                    checked={saveAsCustom} onChange={(e) => setSaveAsCustom(e.target.checked)}
                                    className="w-5 h-5 rounded-lg accent-[var(--color-fighter-red)] cursor-pointer"
                                />
                                <label htmlFor="saveCustom" className="text-xs font-bold text-gray-400 cursor-pointer">Guardar en mis alimentos guardados</label>
                            </div>

                            <button type="submit" className="fighter-btn-primary w-full mt-4">
                                Guardar Comida
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Daily Totals - Glass Header */}
            <div className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                    <Flame className="w-5 h-5 text-[var(--color-fighter-red)]" />
                    <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Resumen del Día</h2>
                </div>

                <div className="fighter-card relative overflow-hidden group border-white/10">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <TrendingUp className="w-16 h-16 text-white" />
                    </div>
                    <div className="flex flex-col mb-4">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Calorías</span>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-black text-white">{dailyData.summary.calories}</span>
                            <span className="text-sm font-black text-[var(--color-fighter-red)] mb-1.5 uppercase">KCAL</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-red-400 uppercase tracking-tighter mb-1">Proteína</span>
                            <span className="text-lg font-black text-white">{dailyData.summary.protein}g</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-tighter mb-1">Carbos</span>
                            <span className="text-lg font-black text-white">{dailyData.summary.carbs}g</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-tighter mb-1">Grasas</span>
                            <span className="text-lg font-black text-white">{dailyData.summary.fats}g</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline of Meals */}
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-sm font-black text-gray-500 uppercase tracking-widest">Línea de Tiempo</h2>
                    <span className="text-[10px] font-bold text-gray-600 uppercase">{dailyData.meals.length} comidas</span>
                </div>

                {loading ? (
                    <div className="flex justify-center p-12">
                        <div className="w-8 h-8 border-2 border-[var(--color-fighter-red)] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : dailyData.meals.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="fighter-card text-center py-12 border-dashed border-white/10 bg-transparent"
                    >
                        <Info className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm font-bold italic tracking-tight">Sin registros para hoy. ¡Aliméntate bien!</p>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {dailyData.meals.map((meal: any, idx: number) => (
                            <motion.div
                                key={meal.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="fighter-card group relative hover:border-white/10"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-[var(--color-fighter-red)] uppercase text-[10px]">
                                            {meal.meal_type.substring(0, 3)}
                                        </div>
                                        <div>
                                            <p className="font-black text-white leading-tight uppercase tracking-tight">{meal.name}</p>
                                            <div className="flex gap-3 mt-1.5">
                                                <span className="text-[9px] font-black text-red-400 uppercase">P: {meal.protein}g</span>
                                                <span className="text-[9px] font-black text-blue-400 uppercase">C: {meal.carbs}g</span>
                                                <span className="text-[9px] font-black text-emerald-400 uppercase">G: {meal.fats}g</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-black text-white leading-none tracking-tighter">{meal.calories}</p>
                                        <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mt-1">KCAL</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
