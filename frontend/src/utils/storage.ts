export const db = {
    // ---- AUTH & USER ----
    getUser: () => {
        if (typeof window === 'undefined') return null;
        const data = localStorage.getItem('fighterUser');
        return data ? JSON.parse(data) : null;
    },
    saveUser: (user: any) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('fighterUser', JSON.stringify(user));
            // Simulate token for compatibility
            localStorage.setItem('fighterToken', 'local-token-' + Date.now());
        }
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
            return newMeal;
        }
        return null;
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
        return mockFoods.filter(f => f.name.toLowerCase().includes(lowerQ));
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

    addWeightLog: (weight: number) => {
        if (typeof window !== 'undefined') {
            const history = JSON.parse(localStorage.getItem('weightHistory') || '[]');
            const log = { id: Date.now(), weight, date: new Date().toISOString() };
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
    }
};
