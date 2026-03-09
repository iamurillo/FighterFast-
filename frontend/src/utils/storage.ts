export const db = {
    // ---- AUTH & USER ----
    getUser: () => {
        if (typeof window === 'undefined') return null;
        const data = localStorage.getItem('fighterUser');
        const user = data ? JSON.parse(data) : null;
        if (user && !user.xp) {
            user.xp = 0;
            user.level = 1;
        }
        return user;
    },
    saveUser: (user: any) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('fighterUser', JSON.stringify(user));
            // Simulate token for compatibility
            localStorage.setItem('fighterToken', 'local-token-' + Date.now());
        }
    },
    updateAvatar: (seed: string) => {
        if (typeof window !== 'undefined') {
            const user = db.getUser();
            if (user) {
                user.avatar_seed = seed;
                db.saveUser(user);
                return user;
            }
        }
        return null;
    },
    getFightDate: () => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('fightDate');
    },
    setFightDate: (date: string) => {
        if (typeof window === 'undefined') return;
        localStorage.setItem('fightDate', date);
    },

    // --- TIMER CONFIGURATIONS ---
    getTimerConfig: () => {
        if (typeof window === "undefined") return null;
        try {
            const item = localStorage.getItem('fighterTimerConfig');
            return item ? JSON.parse(item) : { roundTime: 300, restTime: 60, totalRounds: 5 };
        } catch {
            return { roundTime: 300, restTime: 60, totalRounds: 5 };
        }
    },
    setTimerConfig: (config: any) => {
        if (typeof window === "undefined") return;
        localStorage.setItem('fighterTimerConfig', JSON.stringify(config));
    },

    // --- GLOBAL SETTINGS & PREFERENCES ---
    getSettings: () => {
        if (typeof window === 'undefined') return { units: 'metric', manualMacros: false, theme: 'combat' };
        const data = localStorage.getItem('fighterSettings');
        return data ? JSON.parse(data) : { units: 'metric', manualMacros: false, theme: 'combat' };
    },

    // --- GAME PLAN (FASE 10) ---
    getGamePlan: () => {
        if (typeof window === 'undefined') return { striking: '', ground: '', emergency: '', lastUpdated: new Date().toISOString() };
        const item = localStorage.getItem('fighterGamePlan');
        return item ? JSON.parse(item) : {
            striking: '',
            ground: '',
            emergency: '',
            lastUpdated: new Date().toISOString()
        };
    },
    setGamePlan: (plan: any) => {
        if (typeof window === 'undefined') return;
        localStorage.setItem('fighterGamePlan', JSON.stringify({ ...plan, lastUpdated: new Date().toISOString() }));
    },
    saveSettings: (settings: any) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('fighterSettings', JSON.stringify(settings));
        }
    },

    addXP: (amount: number) => {
        if (typeof window === 'undefined') return { leveledUp: false, level: 1 };
        const user = db.getUser();
        if (user) {
            const streak = db.getTrainingStreak();
            // Multiplier: +10% XP for every 3 days of streak, max +50%
            const multiplier = 1 + Math.min(Math.floor(streak / 3) * 0.1, 0.5);
            const finalAmount = Math.round(amount * multiplier);

            const oldLevel = user.level || 1;
            user.xp = (user.xp || 0) + finalAmount;

            // Level logic: 100 XP per level
            const newLevel = Math.floor(user.xp / 100) + 1;
            user.level = newLevel;

            localStorage.setItem('fighterUser', JSON.stringify(user));

            return {
                leveledUp: newLevel > oldLevel,
                level: newLevel,
                xpGained: finalAmount,
                currentXP: user.xp
            };
        }
        return { leveledUp: false, level: 1 };
    },

    clearUser: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('fighterUser');
            localStorage.removeItem('fighterToken');
            // Opcional: limpiar toda la base de datos al cerrar sesión
            // localStorage.clear(); 
        }
    },

    // ---- FASTING ----
    getFastState: () => {
        if (typeof window === 'undefined') return { active: false };
        const data = localStorage.getItem('fastState');
        return data ? JSON.parse(data) : { active: false };
    },
    startFast: (targetHours: number) => {
        if (typeof window !== 'undefined') {
            const state = { active: true, start_time: new Date().toISOString(), target_hours: targetHours };
            localStorage.setItem('fastState', JSON.stringify(state));
            return state;
        }
        return null;
    },
    stopFast: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('fastState');
            return { active: false };
        }
        return null;
    },

    // ---- NUTRITION ----
    getDailyMeals: (dateStr?: string) => {
        if (typeof window === 'undefined') return { meals: [], summary: { calories: 0, protein: 0, carbs: 0, fats: 0 } };
        const today = dateStr || new Date().toISOString().split('T')[0];
        const allMeals = JSON.parse(localStorage.getItem('meals') || '{}');
        const dayMeals = allMeals[today] || [];

        const summary = dayMeals.reduce((acc: any, meal: any) => ({
            calories: acc.calories + (meal.calories || 0),
            protein: acc.protein + (meal.protein || 0),
            carbs: acc.carbs + (meal.carbs || 0),
            fats: acc.fats + (meal.fats || 0),
        }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

        return { meals: dayMeals, summary };
    },
    addMeal: (meal: any) => {
        if (typeof window !== 'undefined') {
            const today = new Date().toISOString().split('T')[0];
            const allMeals = JSON.parse(localStorage.getItem('meals') || '{}');
            if (!allMeals[today]) allMeals[today] = [];

            const newMeal = { ...meal, id: Date.now() };
            allMeals[today].push(newMeal);
            localStorage.setItem('meals', JSON.stringify(allMeals));

            // Add XP
            db.addXP(10);

            return newMeal;
        }
        return null;
    },
    updateMeal: (id: number, data: any) => {
        if (typeof window !== 'undefined') {
            const today = new Date().toISOString().split('T')[0];
            const allMeals = JSON.parse(localStorage.getItem('meals') || '{}');
            if (allMeals[today]) {
                allMeals[today] = allMeals[today].map((m: any) =>
                    m.id === id ? { ...m, ...data } : m
                );
                localStorage.setItem('meals', JSON.stringify(allMeals));
            }
        }
    },
    deleteMeal: (id: number) => {
        if (typeof window !== 'undefined') {
            const today = new Date().toISOString().split('T')[0];
            const allMeals = JSON.parse(localStorage.getItem('meals') || '{}');
            if (allMeals[today]) {
                allMeals[today] = allMeals[today].filter((m: any) => m.id !== id);
                localStorage.setItem('meals', JSON.stringify(allMeals));
            }
        }
    },

    // ---- RECIPES & WEEKLY PLAN ----
    getRecipes: () => {
        if (typeof window === 'undefined') return [];
        const recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
        if (recipes.length <= 3) {
            const masterRecipes = [
                { id: 101, name: "Avena Pro Sparring", calories: 450, protein: 25, carbs: 60, fats: 10, description: "Bowl de avena con proteína en polvo, plátano y un puñado de nueces. Energía de larga duración para el tatami." },
                { id: 102, name: "Ensalada Elite Atún", calories: 380, protein: 40, carbs: 15, fats: 18, description: "Atún al natural, espinacas, aguacate y huevo cocido. Macro-nutrientes limpios para recuperación muscular." },
                { id: 103, name: "Smoothie Post-Guerra", calories: 320, protein: 30, carbs: 40, fats: 5, description: "Bayas congeladas, leche de almendras y scoop de whey. Rápida absorción tras entrenamiento intenso." },
                { id: 104, name: "Poke del Luchador", calories: 650, protein: 35, carbs: 80, fats: 15, description: "Salmón, arroz de sushi, edamame, mango y alga nori. El combustible definitivo." },
                { id: 105, name: "Pasta Pre-Comp", calories: 720, protein: 28, carbs: 110, fats: 12, description: "Pasta integral con salsa pomodoro ligera y pechuga de pollo. Carga de glucógeno para el día del evento." },
                { id: 106, name: "Tortilla Power", calories: 280, protein: 35, carbs: 5, fats: 12, description: "4 claras, 1 huevo entero, espinacas y pavo picado. Desayuno de campeones bajo en carbos." }
            ];
            localStorage.setItem('recipes', JSON.stringify(masterRecipes));
            return masterRecipes;
        }
        return recipes;
    },
    addRecipe: (recipe: any) => {
        if (typeof window !== 'undefined') {
            const recipes = db.getRecipes();
            const newRecipe = { ...recipe, id: Date.now(), description: recipe.description || '' };
            recipes.push(newRecipe);
            localStorage.setItem('recipes', JSON.stringify(recipes));
            return newRecipe;
        }
        return null;
    },
    updateRecipe: (id: number, data: any) => {
        if (typeof window !== 'undefined') {
            const recipes = db.getRecipes().map((r: any) =>
                r.id === id ? { ...r, ...data } : r
            );
            localStorage.setItem('recipes', JSON.stringify(recipes));
        }
    },
    deleteRecipe: (id: number) => {
        if (typeof window !== 'undefined') {
            const recipes = db.getRecipes().filter((r: any) => r.id !== id);
            localStorage.setItem('recipes', JSON.stringify(recipes));
        }
    },
    getWeeklyPlan: () => {
        if (typeof window === 'undefined') return {};
        return JSON.parse(localStorage.getItem('weeklyPlan') || '{}');
    },
    updateWeeklyPlan: (day: string, plan: any) => {
        if (typeof window !== 'undefined') {
            const fullPlan = db.getWeeklyPlan();
            fullPlan[day] = plan;
            localStorage.setItem('weeklyPlan', JSON.stringify(fullPlan));
        }
    },

    // ---- FOOD DATABASE (Mock for search) ----
    searchFoods: (query: string) => {
        const mockFoods = [
            { id: 1, name: 'Pechuga de Pollo', calories_per_portion: 165, protein: 31, carbs: 0, fats: 3.6, default_portion: '100g' },
            { id: 2, name: 'Arroz Blanco Cocido', calories_per_portion: 130, protein: 2.7, carbs: 28, fats: 0.3, default_portion: '100g' },
            { id: 3, name: 'Huevo Entero', calories_per_portion: 72, protein: 6, carbs: 0.4, fats: 4.8, default_portion: '1 unidad grande' },
            { id: 4, name: 'Avena', calories_per_portion: 389, protein: 16.9, carbs: 66.3, fats: 6.9, default_portion: '100g' },
            { id: 5, name: 'Manzana', calories_per_portion: 52, protein: 0.3, carbs: 14, fats: 0.2, default_portion: '100g' },
            { id: 6, name: 'Plátano', calories_per_portion: 89, protein: 1.1, carbs: 22.8, fats: 0.3, default_portion: '100g' },
            { id: 7, name: 'Salmón', calories_per_portion: 208, protein: 20, carbs: 0, fats: 13, default_portion: '100g' },
            { id: 8, name: 'Almendras', calories_per_portion: 579, protein: 21, carbs: 22, fats: 50, default_portion: '100g' },
            { id: 9, name: 'Pan Integral', calories_per_portion: 247, protein: 13, carbs: 41, fats: 3.4, default_portion: '100g' },
            { id: 10, name: 'Leche Entera', calories_per_portion: 61, protein: 3.2, carbs: 4.8, fats: 3.3, default_portion: '100ml' },
            { id: 11, name: 'Frijoles Negros Cocidos', calories_per_portion: 132, protein: 8.9, carbs: 23.7, fats: 0.5, default_portion: '100g' },
            { id: 12, name: 'Tortilla de Maíz', calories_per_portion: 218, protein: 5.7, carbs: 46, fats: 2.5, default_portion: '100g' },
        ];

        if (!query) return [];
        const lowerQ = query.toLowerCase();

        // Incluir Custom Foods al buscar
        const customFoods = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('customFoods') || '[]') : [];
        const allFoods = [...customFoods, ...mockFoods];

        return allFoods.filter((f: any) => f.name.toLowerCase().includes(lowerQ));
    },

    // ---- PROGRESS & METRICS ----
    calculateMacros: (user: any) => {
        if (!user) return null;

        // Mifflin-St Jeor Equation
        let tmb = 10 * user.current_weight + 6.25 * user.height - 5 * user.age;
        tmb += (user.gender === 'M' || user.gender === 'male') ? 5 : -161;

        let multiplier = 1.2; // light
        if (user.activity_level === 'moderate') multiplier = 1.375;
        if (user.activity_level === 'active') multiplier = 1.55;
        if (user.activity_level === 'fighter') multiplier = 1.725;

        const target_calories = Math.round(tmb * multiplier);

        // Macros distribution (Roughly: 30% P, 40% C, 30% F for fighters)
        const protein_grams = Math.round((target_calories * 0.3) / 4);
        const carbs_grams = Math.round((target_calories * 0.4) / 4);
        const fat_grams = Math.round((target_calories * 0.3) / 9);

        return {
            metrics: { tmb: Math.round(tmb), target_calories },
            macros: { protein_grams, carbs_grams, fat_grams }
        };
    },

    getWeightHistory: () => {
        if (typeof window === 'undefined') return [];
        const history = JSON.parse(localStorage.getItem('weightHistory') || '[]');
        return history;
    },

    addWeightLog: (weight: number, bodyFat?: number, muscleMass?: number) => {
        if (typeof window !== 'undefined') {
            const history = JSON.parse(localStorage.getItem('weightHistory') || '[]');
            const log = {
                id: Date.now(),
                weight,
                bodyFat: bodyFat || null,
                muscleMass: muscleMass || null,
                date: new Date().toISOString()
            };
            history.push(log);
            localStorage.setItem('weightHistory', JSON.stringify(history));

            // Update user current weight
            const user = db.getUser();
            if (user) {
                user.current_weight = weight;
                db.saveUser(user);
            }
            return log;
        }
        return null;
    },

    getWorkoutHistory: () => {
        if (typeof window === 'undefined') return [];
        return JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    },

    addWorkoutLog: (type: string, duration: number, intensity: string) => {
        if (typeof window !== 'undefined') {
            const history = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
            const log = { id: Date.now(), type, duration_minutes: duration, intensity, date: new Date().toISOString() };
            history.push(log);
            localStorage.setItem('workoutHistory', JSON.stringify(history));
            return log;
        }
        return null;
    },

    // ---- FASE 2: NEW FEATURES ----

    // WATER TRACKER
    getDailyWater: (dateStr?: string) => {
        if (typeof window === 'undefined') return 0;
        const today = dateStr || new Date().toISOString().split('T')[0];
        const allWater = JSON.parse(localStorage.getItem('waterLogs') || '{}');
        return allWater[today] || 0; // return amounts in ml
    },
    addWater: (amount_ml: number) => {
        if (typeof window !== 'undefined') {
            const today = new Date().toISOString().split('T')[0];
            const allWater = JSON.parse(localStorage.getItem('waterLogs') || '{}');
            allWater[today] = (allWater[today] || 0) + amount_ml;
            localStorage.setItem('waterLogs', JSON.stringify(allWater));
            return allWater[today];
        }
        return 0;
    },
    subtractWater: (amount_ml: number) => {
        if (typeof window !== 'undefined') {
            const today = new Date().toISOString().split('T')[0];
            const allWater = JSON.parse(localStorage.getItem('waterLogs') || '{}');
            allWater[today] = Math.max(0, (allWater[today] || 0) - amount_ml);
            localStorage.setItem('waterLogs', JSON.stringify(allWater));
            return allWater[today];
        }
        return 0;
    },

    // CUSTOM FOODS
    getCustomFoods: () => {
        if (typeof window === 'undefined') return [];
        return JSON.parse(localStorage.getItem('customFoods') || '[]');
    },
    addCustomFood: (food: any) => {
        if (typeof window !== 'undefined') {
            const customFoods = JSON.parse(localStorage.getItem('customFoods') || '[]');
            const newFood = { ...food, id: 'custom_' + Date.now() };
            customFoods.push(newFood);
            localStorage.setItem('customFoods', JSON.stringify(customFoods));
            return newFood;
        }
        return null;
    },

    // TRAINING LOG (DIARY)
    getTrainingLogs: () => {
        if (typeof window === 'undefined') return [];
        return JSON.parse(localStorage.getItem('trainingDiary') || '[]');
    },
    addTrainingDiaryLog: (date: string, discipline: string, notes: string) => {
        if (typeof window !== 'undefined') {
            const logs = JSON.parse(localStorage.getItem('trainingDiary') || '[]');
            const newLog = { id: Date.now(), date, discipline, notes };
            logs.push(newLog);
            localStorage.setItem('trainingDiary', JSON.stringify(logs));
            return newLog;
        }
        return null;
    },

    // TECHNIQUE VAULT (FASE 5)
    getTechniques: () => {
        if (typeof window === 'undefined') return [];
        return JSON.parse(localStorage.getItem('techniqueVault') || '[]');
    },
    addTechnique: (name: string, description: string, discipline: string, rating: number) => {
        if (typeof window !== 'undefined') {
            const vault = JSON.parse(localStorage.getItem('techniqueVault') || '[]');
            const newTech = { id: Date.now(), name, description, discipline, rating, date: new Date().toISOString() };
            vault.push(newTech);
            localStorage.setItem('techniqueVault', JSON.stringify(vault));
            return newTech;
        }
        return null;
    },


    // ---- APEX EDITION FEATURES ----

    getWarriorQuote: () => {
        const quotes = [
            "La disciplina es el puente entre las metas y los logros.",
            "En el tatami no hay excusas, solo resultados.",
            "Un cinturón negro es un cinturón blanco que nunca se rindió.",
            "El dolor es temporal, el orgullo de la victoria es para siempre.",
            "No temas al hombre que ha practicado 10,000 patadas una vez, teme al que ha practicado una 10,000 veces.",
            "La victoria pertenece al más perseverante.",
            "Para ser un león, tienes que entrenar con leones."
        ];
        return quotes[Math.floor(Math.random() * quotes.length)];
    },

    getFighterRank: () => {
        const workouts = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
        const diary = JSON.parse(localStorage.getItem('trainingDiary') || '[]');
        const total = workouts.length + diary.length;

        if (total >= 100) return { name: "Black Belt", color: "#FFFFFF", bg: "#000000" };
        if (total >= 50) return { name: "Brown Belt", color: "#FFFFFF", bg: "#4B2C20" };
        if (total >= 25) return { name: "Purple Belt", color: "#FFFFFF", bg: "#5B21B6" };
        if (total >= 10) return { name: "Blue Belt", color: "#FFFFFF", bg: "#1E40AF" };
        return { name: "White Belt", color: "#000000", bg: "#F3F4F6" };
    },

    getTrainingStreak: () => {
        const workouts = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
        const diary = JSON.parse(localStorage.getItem('trainingDiary') || '[]');
        const allDates = [...workouts, ...diary].map(l => l.date.split('T')[0]);
        const uniqueDates = Array.from(new Set(allDates)).sort().reverse();

        let streak = 0;
        let today = new Date().toISOString().split('T')[0];
        let yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        // Si no entrenó hoy ni ayer, racha es 0
        if (!uniqueDates.includes(today) && !uniqueDates.includes(yesterday)) return 0;

        let checkDate = uniqueDates.includes(today) ? today : yesterday;
        let checkIdx = uniqueDates.indexOf(checkDate);

        for (let i = checkIdx; i < uniqueDates.length; i++) {
            const current = new Date(uniqueDates[i]);
            const next = i + 1 < uniqueDates.length ? new Date(uniqueDates[i + 1]) : null;

            streak++;
            if (next) {
                const diffTime = Math.abs(current.getTime() - next.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays > 1) break;
            }
        }
        return streak;
    },

    getWeightClass: (weight: number) => {
        const classes = [
            { name: "Paja", limit: 52.2 },
            { name: "Mosca", limit: 56.7 },
            { name: "Gallo", limit: 61.2 },
            { name: "Pluma", limit: 65.8 },
            { name: "Ligero", limit: 70.3 },
            { name: "Wélter", limit: 77.1 },
            { name: "Medio", limit: 83.9 },
            { name: "Semipesado", limit: 93.0 },
            { name: "Pesado", limit: 120.2 }
        ];
        return classes.find(c => weight <= c.limit) || { name: "Super Pesado", limit: 999 };
    },

    getTrophies: () => {
        if (typeof window === 'undefined') return [];
        const streak = db.getTrainingStreak();
        const workouts = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
        const totalWorkouts = workouts.length;
        const waterLogs = JSON.parse(localStorage.getItem('waterLogs') || '{}');
        const hydratedDays = Object.values(waterLogs).filter((w: any) => w >= 3000).length;
        const techniques = JSON.parse(localStorage.getItem('techniqueVault') || '[]');
        const weights = JSON.parse(localStorage.getItem('weightHistory') || '[]');

        return [
            { id: 'iron_will', name: 'Iron Will', desc: '5 días de racha entrenando', achieved: streak >= 5, icon: 'Zap' },
            { id: 'tatami_rat', name: 'Tatami Rat', desc: '20 sesiones de entrenamiento', achieved: totalWorkouts >= 20, icon: 'Activity' },
            { id: 'hydration_master', name: 'Hydro Master', desc: '5 días de hidratación óptima (3L+)', achieved: hydratedDays >= 5, icon: 'Droplet' },
            { id: 'tech_collector', name: 'Tech Collector', desc: '10 técnicas en tu biblioteca', achieved: techniques.length >= 10, icon: 'Bookmark' },
            { id: 'weight_pro', name: 'Weight Pro', desc: '7 registros de peso realizados', achieved: weights.length >= 7, icon: 'Scale' },
            { id: 'black_belt_mind', name: 'Black Belt Mind', desc: 'Alcanza 100 sesiones totales', achieved: totalWorkouts >= 100, icon: 'Trophy' }
        ];
    },

    // ---- DATA MANAGEMENT (BACKUP) ----
    getFullBackup: () => {
        if (typeof window === 'undefined') return "{}";
        const backup = {
            user: localStorage.getItem('fighterUser'),
            meals: localStorage.getItem('meals'),
            water: localStorage.getItem('waterLogs'),
            weight: localStorage.getItem('weightHistory'),
            workouts: localStorage.getItem('workoutHistory'),
            customFoods: localStorage.getItem('customFoods'),
            diary: localStorage.getItem('trainingDiary'),
            fastState: localStorage.getItem('fastState'),
            techniques: localStorage.getItem('techniqueVault'),
            fightDate: localStorage.getItem('fightDate'),
            settings: localStorage.getItem('fighterSettings'),
            recipes: localStorage.getItem('recipes'),
            weeklyPlan: localStorage.getItem('weeklyPlan')
        };
        return JSON.stringify(backup);
    },
    restoreBackup: (jsonStr: string) => {
        if (typeof window === 'undefined') return false;
        try {
            const data = JSON.parse(jsonStr);
            if (data.user) localStorage.setItem('fighterUser', data.user);
            if (data.meals) localStorage.setItem('meals', data.meals);
            if (data.water) localStorage.setItem('waterLogs', data.water);
            if (data.weight) localStorage.setItem('weightHistory', data.weight);
            if (data.workouts) localStorage.setItem('workoutHistory', data.workouts);
            if (data.customFoods) localStorage.setItem('customFoods', data.customFoods);
            if (data.diary) localStorage.setItem('trainingDiary', data.diary);
            if (data.fastState) localStorage.setItem('fastState', data.fastState);
            if (data.techniques) localStorage.setItem('techniqueVault', data.techniques);
            if (data.fightDate) localStorage.setItem('fightDate', data.fightDate);
            if (data.settings) localStorage.setItem('fighterSettings', data.settings);
            if (data.recipes) localStorage.setItem('recipes', data.recipes);
            if (data.weeklyPlan) localStorage.setItem('weeklyPlan', data.weeklyPlan);
            return true;
        } catch (e) {
            console.error("Error al restaurar backup:", e);
            return false;
        }
    }
};
