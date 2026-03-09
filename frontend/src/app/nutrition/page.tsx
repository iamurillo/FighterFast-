"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Search, CheckCircle2 } from 'lucide-react';

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

    const [searchResults, setSearchResults] = useState<any[]>([]);

    useEffect(() => {
        fetchDailyMeals();
    }, []);

    const handleSearchFood = async (query: string) => {
        setMealName(query);
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }
        try {
            const token = localStorage.getItem('fighterToken');
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const res = await fetch(`${API_URL}/api/foods/search?q=${query}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setSearchResults(await res.json());
            }
        } catch (err) { console.error(err); }
    };

    const selectFood = (food: any) => {
        setMealName(food.name);
        setCalories(food.calories_per_portion.toString());
        setProtein(food.protein.toString());
        setCarbs(food.carbs.toString());
        setFats(food.fats.toString());
        setSearchResults([]);
    };

    const fetchDailyMeals = async () => {
        try {
            const token = localStorage.getItem('fighterToken');
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const res = await fetch(`${API_URL}/api/nutrition/daily-meals`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setDailyData(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMeal = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('fighterToken');
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const res = await fetch(`${API_URL}/api/nutrition/meal`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: mealName,
                    calories: Number(calories),
                    protein: Number(protein) || 0,
                    carbs: Number(carbs) || 0,
                    fats: Number(fats) || 0,
                    meal_type: mealType
                })
            });

            if (res.ok) {
                setShowAddForm(false);
                setMealName(''); setCalories(''); setProtein(''); setCarbs(''); setFats('');
                fetchDailyMeals();
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-6 pt-4">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-white mb-0">Nutrición</h1>
                    <p className="text-sm font-medium text-gray-400">Hoy</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="w-10 h-10 rounded-full bg-[var(--color-fighter-red)] text-white flex justify-center items-center shadow-[0_0_15px_rgba(225,29,72,0.4)] transition-transform active:scale-95"
                >
                    <Plus className="w-6 h-6" />
                </button>
            </div>

            {/* Add Meal Form Modal / Inline */}
            {showAddForm && (
                <div className="bg-[var(--color-fighter-surface)] p-5 rounded-2xl border border-[var(--color-fighter-surface-hover)] mb-6 animate-in fade-in slide-in-from-top-4 relative">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-white">Registrar Comida</h3>
                        <button onClick={async () => {
                            const token = localStorage.getItem('fighterToken');
                            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                            await fetch(`${API_URL}/api/foods/seed`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
                            alert('Base de datos inicial de alimentos cargada');
                        }} className="text-[10px] bg-[var(--color-fighter-surface-hover)] px-2 py-1 rounded text-gray-400">
                            + Cargar Base DB
                        </button>
                    </div>

                    <form onSubmit={handleAddMeal} className="space-y-3 relative">
                        <div className="relative">
                            <input
                                required type="text" placeholder="Buscar alimento... (Ej. Pechuga de Pollo 200g)"
                                value={mealName} onChange={(e) => handleSearchFood(e.target.value)}
                                className="w-full bg-black/50 text-white text-sm rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-1 focus:ring-[var(--color-fighter-red)]"
                            />
                            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        </div>

                        {searchResults.length > 0 && (
                            <div className="absolute z-20 w-full bg-gray-900 border border-gray-700 rounded-lg mt-1 max-h-40 overflow-y-auto">
                                {searchResults.map((f: any) => (
                                    <div key={f.id} onClick={() => selectFood(f)} className="p-3 border-b border-gray-800 hover:bg-gray-800 cursor-pointer flex justify-between items-center text-sm">
                                        <span className="font-bold text-white">{f.name} <span className="text-gray-500 font-normal ml-1">({f.default_portion})</span></span>
                                        <span className="text-gray-400">{f.calories_per_portion} kcal</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            <input
                                required type="number" placeholder="Calorías totales"
                                value={calories} onChange={(e) => setCalories(e.target.value)}
                                className="w-full bg-black/50 text-white text-sm rounded-lg px-4 py-3 outline-none focus:ring-1 focus:ring-[var(--color-fighter-red)]"
                            />
                            <select
                                value={mealType} onChange={(e) => setMealType(e.target.value)}
                                className="w-full bg-black/50 text-white text-sm rounded-lg px-4 py-3 outline-none"
                            >
                                <option value="breakfast">Desayuno</option>
                                <option value="lunch">Comida / Almuerzo</option>
                                <option value="dinner">Cena</option>
                                <option value="snack">Snack</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <input type="number" placeholder="Prot (g)" value={protein} onChange={(e) => setProtein(e.target.value)} className="w-full bg-black/50 text-blue-400 text-sm rounded-lg px-3 py-3 outline-none text-center" />
                            <input type="number" placeholder="Carb (g)" value={carbs} onChange={(e) => setCarbs(e.target.value)} className="w-full bg-black/50 text-green-400 text-sm rounded-lg px-3 py-3 outline-none text-center" />
                            <input type="number" placeholder="Grasa (g)" value={fats} onChange={(e) => setFats(e.target.value)} className="w-full bg-black/50 text-yellow-400 text-sm rounded-lg px-3 py-3 outline-none text-center" />
                        </div>

                        <button type="submit" className="w-full bg-[var(--color-fighter-red)] text-white font-bold rounded-lg py-3 mt-2">
                            GUARDAR COMIDA
                        </button>
                    </form>
                </div>
            )}

            {/* Summary Cards */}
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">Resumen Consumido</h2>

            {!loading && (
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="col-span-2 bg-[var(--color-fighter-surface)] p-4 rounded-xl border border-[var(--color-fighter-surface-hover)]">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Calorías Totales</p>
                        <p className="text-3xl font-black text-white">{dailyData.summary.calories} <span className="text-sm font-medium text-gray-500">kcal</span></p>
                    </div>
                    <div className="bg-[var(--color-fighter-surface)] p-4 rounded-xl border border-[var(--color-fighter-surface-hover)] border-l-2 border-l-blue-500">
                        <p className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">Proteína</p>
                        <p className="text-xl font-black text-white">{dailyData.summary.protein}g</p>
                    </div>
                    <div className="bg-[var(--color-fighter-surface)] p-4 rounded-xl border border-[var(--color-fighter-surface-hover)] border-l-2 border-l-green-500">
                        <p className="text-xs text-green-400 font-bold uppercase tracking-wider mb-1">Carbos</p>
                        <p className="text-xl font-black text-white">{dailyData.summary.carbs}g</p>
                    </div>
                </div>
            )}

            {/* History */}
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">Historial de Hoy</h2>
            <div className="space-y-3">
                {!loading && dailyData.meals.length === 0 ? (
                    <div className="text-center py-10 bg-[var(--color-fighter-surface)] rounded-xl border border-[var(--color-fighter-surface-hover)]">
                        <p className="text-gray-500 text-sm">Aún no has registrado comidas hoy</p>
                    </div>
                ) : (
                    dailyData.meals.map((meal: any) => (
                        <div key={meal.id} className="bg-[var(--color-fighter-surface)] p-4 rounded-xl border border-[var(--color-fighter-surface-hover)] flex justify-between items-center">
                            <div>
                                <p className="font-bold text-white leading-tight mb-1">{meal.name}</p>
                                <div className="flex gap-3 text-xs font-medium">
                                    <span className="text-blue-400">P:{meal.protein}</span>
                                    <span className="text-green-400">C:{meal.carbs}</span>
                                    <span className="text-yellow-400">G:{meal.fats}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-black text-white">{meal.calories}</p>
                                <p className="text-[10px] uppercase text-gray-500 font-bold">kcal</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

        </div>
    );
}
