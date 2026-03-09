"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Search, CheckCircle2, Utensils, Flame, Info, TrendingUp, Bookmark, Calendar } from 'lucide-react';
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
    const [recipes, setRecipes] = useState<any[]>([]);
    const [showRecipeForm, setShowRecipeForm] = useState(false);
    const [recipeName, setRecipeName] = useState('');
    const [recipeDescription, setRecipeDescription] = useState('');
    const [editingRecipeId, setEditingRecipeId] = useState<number | null>(null);
    const [selectedRecipeDetail, setSelectedRecipeDetail] = useState<any | null>(null);
    const [weeklyPlan, setWeeklyPlan] = useState<any>({});
    const [showWeeklyPlanner, setShowWeeklyPlanner] = useState(false);
    const [selectedDay, setSelectedDay] = useState('L');

    const QUICK_TEMPLATES = [
        { name: "Pechuga con Arroz", cal: 550, p: 45, c: 60, f: 8, type: 'lunch' },
        { name: "Batido Proteína", cal: 220, p: 30, c: 5, f: 3, type: 'snack' },
        { name: "Avena y Fruta", cal: 400, p: 12, c: 65, f: 6, type: 'breakfast' },
        { name: "Salmón y Espárragos", cal: 600, p: 40, c: 10, f: 35, type: 'dinner' }
    ];

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
        setRecipes(db.getRecipes());
        setWeeklyPlan(db.getWeeklyPlan());
        setLoading(false);
    };

    const handleAddRecipe = (e: React.FormEvent) => {
        e.preventDefault();
        const recipeData = {
            name: recipeName,
            calories: Number(calories),
            protein: Number(protein) || 0,
            carbs: Number(carbs) || 0,
            fats: Number(fats) || 0,
            description: recipeDescription
        };

        if (editingRecipeId) {
            db.updateRecipe(editingRecipeId, recipeData);
            alert('Receta actualizada correctamente.');
        } else {
            db.addRecipe(recipeData);
            alert('Receta guardada en el vault.');
        }

        setRecipeName(''); setRecipeDescription(''); setCalories(''); setProtein(''); setCarbs(''); setFats('');
        setShowRecipeForm(false); setEditingRecipeId(null);
        setRecipes(db.getRecipes());
    };

    const deleteRecipe = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (confirm('¿Eliminar esta receta permanentemente?')) {
            db.deleteRecipe(id);
            setRecipes(db.getRecipes());
        }
    };

    const startEditRecipe = (e: React.MouseEvent, recipe: any) => {
        e.stopPropagation();
        setEditingRecipeId(recipe.id);
        setRecipeName(recipe.name);
        setRecipeDescription(recipe.description || '');
        setCalories(recipe.calories.toString());
        setProtein(recipe.protein.toString());
        setCarbs(recipe.carbs.toString());
        setFats(recipe.fats.toString());
        setShowRecipeForm(true);
    };

    const useRecipe = (recipe: any) => {
        db.addMeal({
            name: recipe.name,
            calories: recipe.calories,
            protein: recipe.protein,
            carbs: recipe.carbs,
            fats: recipe.fats,
            meal_type: 'lunch' // Default
        });
        fetchDailyMeals();
        alert(`Receta "${recipe.name}" añadida.`);
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
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowWeeklyPlanner(!showWeeklyPlanner)}
                        className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-500 flex justify-center items-center transition-all active:scale-90"
                        title="Plan Semanal"
                    >
                        <Calendar className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => setShowRecipeForm(!showRecipeForm)}
                        className="w-12 h-12 rounded-2xl bg-amber-600/20 border border-amber-500/30 text-amber-500 flex justify-center items-center transition-all active:scale-90"
                        title="Nueva Receta"
                    >
                        <Bookmark className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="w-12 h-12 rounded-2xl bg-[var(--color-fighter-red)] text-white flex justify-center items-center shadow-[0_0_20px_rgba(225,29,72,0.3)] transition-all active:scale-90"
                    >
                        <Plus className={`w-7 h-7 transition-transform duration-300 ${showAddForm ? 'rotate-45' : 'rotate-0'}`} />
                    </button>
                </div>
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

            {/* Weekly Planner Section */}
            <AnimatePresence>
                {showWeeklyPlanner && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="mb-10 overflow-hidden"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Calendar className="w-5 h-5 text-blue-500" />
                            <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Plan Semanal</h2>
                        </div>
                        <div className="grid grid-cols-7 gap-1 mb-6">
                            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day) => (
                                <button
                                    key={day}
                                    onClick={() => setSelectedDay(day)}
                                    className={`fighter-card !p-2 border-white/5 text-center transition-all ${selectedDay === day ? 'bg-blue-600 border-blue-400' : 'bg-white/5 hover:border-blue-500/30'}`}
                                >
                                    <span className={`text-[10px] font-black ${selectedDay === day ? 'text-white' : 'text-gray-500'}`}>{day}</span>
                                    <div className="w-full h-1 bg-white/10 mt-1 rounded-full overflow-hidden">
                                        {weeklyPlan[day] && <div className="h-full bg-blue-400" style={{ width: '100%' }} />}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Selected Day Plan */}
                        <div className="fighter-card border-blue-500/20 bg-blue-500/5 p-4 min-h-[100px]">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xs font-black text-white uppercase tracking-widest">Plan para {selectedDay}</h3>
                                {weeklyPlan[selectedDay] ? (
                                    <button onClick={() => {
                                        const newPlan = { ...weeklyPlan };
                                        delete newPlan[selectedDay];
                                        db.updateWeeklyPlan(selectedDay, null);
                                        setWeeklyPlan(newPlan);
                                    }} className="text-[9px] font-black text-red-400 uppercase">Limpiar</button>
                                ) : null}
                            </div>

                            {weeklyPlan[selectedDay] ? (
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                                        <span className="text-[10px] font-bold text-gray-300 uppercase">{weeklyPlan[selectedDay].name}</span>
                                        <span className="text-[10px] font-black text-blue-400">{weeklyPlan[selectedDay].calories} kcal</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-4 border border-dashed border-white/10 rounded-xl">
                                    <p className="text-[9px] font-bold text-gray-700 uppercase mb-3">No hay nada planeado</p>
                                    <div className="flex gap-2">
                                        {QUICK_TEMPLATES.slice(0, 2).map(t => (
                                            <button
                                                key={t.name}
                                                onClick={() => {
                                                    db.updateWeeklyPlan(selectedDay, t);
                                                    setWeeklyPlan(db.getWeeklyPlan());
                                                }}
                                                className="px-3 py-1.5 bg-blue-600/20 border border-blue-500/30 rounded-lg text-[8px] font-black text-blue-400 uppercase"
                                            >
                                                + {t.name.split(' ')[0]}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Recipe Form - Integrated Description */}
            <AnimatePresence>
                {showRecipeForm && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                        className="fighter-card mb-10 border-amber-500/20 bg-amber-500/5 relative z-20"
                    >
                        <h3 className="text-xl font-black text-amber-500 italic uppercase tracking-tighter mb-6">
                            {editingRecipeId ? 'Editar Receta Elite' : 'Crear Receta Elite'}
                        </h3>
                        <form onSubmit={handleAddRecipe} className="space-y-4">
                            <input
                                required placeholder="Nombre (ej. Batido Post-Rool)"
                                value={recipeName} onChange={(e) => setRecipeName(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-sm"
                            />
                            <textarea
                                placeholder="Descripción y Preparación..."
                                value={recipeDescription} onChange={(e) => setRecipeDescription(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-sm min-h-[100px] resize-none"
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input placeholder="Kcal" type="number" value={calories} onChange={(e) => setCalories(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-sm" />
                                <div className="grid grid-cols-3 gap-2">
                                    <input placeholder="P" type="number" value={protein} onChange={(e) => setProtein(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-2 py-4 text-red-400 text-center text-[10px]" />
                                    <input placeholder="C" type="number" value={carbs} onChange={(e) => setCarbs(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-2 py-4 text-blue-400 text-center text-[10px]" />
                                    <input placeholder="F" type="number" value={fats} onChange={(e) => setFats(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-2 py-4 text-emerald-400 text-center text-[10px]" />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button type="submit" className="flex-1 bg-amber-600 text-white font-black py-4 rounded-xl uppercase tracking-widest text-xs">
                                    {editingRecipeId ? 'Actualizar' : 'Guardar'}
                                </button>
                                {editingRecipeId && (
                                    <button
                                        type="button"
                                        onClick={() => { setShowRecipeForm(false); setEditingRecipeId(null); setRecipeName(''); setRecipeDescription(''); }}
                                        className="px-6 bg-white/5 text-gray-400 font-bold rounded-xl text-[10px] uppercase"
                                    >
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Recipe Details Modal */}
            <AnimatePresence>
                {selectedRecipeDetail && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="fighter-card max-w-sm w-full border-amber-500/30 bg-[#0A0A0A] overflow-hidden"
                        >
                            <div className="p-8">
                                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">{selectedRecipeDetail.name}</h3>
                                <div className="flex gap-4 mb-6 pb-6 border-b border-white/5">
                                    <div><p className="text-[8px] font-black text-gray-500 uppercase">Calorías</p><p className="text-lg font-black text-white">{selectedRecipeDetail.calories}</p></div>
                                    <div><p className="text-[8px] font-black text-gray-500 uppercase">Proteína</p><p className="text-lg font-black text-red-400">{selectedRecipeDetail.protein}g</p></div>
                                    <div><p className="text-[8px] font-black text-gray-500 uppercase">Carbos</p><p className="text-lg font-black text-blue-400">{selectedRecipeDetail.carbs}g</p></div>
                                </div>
                                <div className="mb-8">
                                    <p className="text-[10px] font-black text-amber-500/50 uppercase tracking-widest mb-3">Preparación Elite</p>
                                    <p className="text-gray-400 text-xs leading-relaxed italic">{selectedRecipeDetail.description || 'Sin descripción disponible para esta receta.'}</p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => { useRecipe(selectedRecipeDetail); setSelectedRecipeDetail(null); }}
                                        className="flex-1 bg-amber-600 text-white font-black py-4 rounded-xl uppercase tracking-widest text-xs"
                                    >
                                        Añadir al Día
                                    </button>
                                    <button
                                        onClick={() => setSelectedRecipeDetail(null)}
                                        className="px-6 bg-white/5 text-gray-400 font-bold rounded-xl text-[10px] uppercase"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Recipe Vault Section */}
            {recipes.length > 0 && (
                <div className="mb-10">
                    <h2 className="text-[10px] font-black text-amber-500/50 uppercase tracking-widest mb-4">Recipe Vault</h2>
                    <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                        {recipes.map((r) => (
                            <div
                                key={r.id}
                                className="fighter-card min-w-[160px] bg-amber-500/5 border-amber-500/10 hover:border-amber-500/40 p-4 transition-all text-left group relative"
                            >
                                <div onClick={() => setSelectedRecipeDetail(r)} className="cursor-pointer">
                                    <p className="text-xs font-black text-white uppercase tracking-tight mb-2 group-hover:text-amber-400">{r.name}</p>
                                    <div className="flex flex-col gap-1 opacity-50">
                                        <span className="text-[9px] font-bold text-gray-400">{r.calories} kcal</span>
                                        <div className="flex gap-2">
                                            <span className="text-[8px] text-red-400">P:{r.protein}</span>
                                            <span className="text-[8px] text-blue-400">C:{r.carbs}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={(e) => startEditRecipe(e, r)} className="p-1.5 bg-white/5 rounded-md hover:text-white text-gray-500 transition-colors">
                                        <Info className="w-3 h-3" />
                                    </button>
                                    <button onClick={(e) => deleteRecipe(e, r.id)} className="p-1.5 bg-red-900/10 rounded-md hover:text-red-500 text-red-900 transition-colors">
                                        <Plus className="w-3 h-3 rotate-45" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* QUICK TEMPLATES */}
            <div className="mb-10">
                <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Plantillas Rápidas</h2>
                <div className="grid grid-cols-2 gap-3">
                    {QUICK_TEMPLATES.map((t, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                db.addMeal({
                                    name: t.name,
                                    calories: t.cal,
                                    protein: t.p,
                                    carbs: t.c,
                                    fats: t.f,
                                    meal_type: t.type
                                });
                                fetchDailyMeals();
                                alert(`${t.name} añadido.`);
                            }}
                            className="fighter-card bg-white/5 border-white/5 hover:border-[var(--color-fighter-red)]/30 text-left p-3 flex flex-col gap-1 transition-all active:scale-95 group"
                        >
                            <span className="text-[11px] font-black text-white uppercase tracking-tight group-hover:text-[var(--color-fighter-red)]">{t.name}</span>
                            <div className="flex justify-between items-center opacity-50">
                                <span className="text-[9px] font-bold text-gray-500">{t.cal} kcal</span>
                                <Plus className="w-3 h-3 text-[var(--color-fighter-red)]" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>

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
