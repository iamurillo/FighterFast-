const db = require('../config/db');

// Función para sembrar algunos alimentos comunes
const seedFoods = async (req, res) => {
    try {
        const existing = await db.query('SELECT count(*) FROM foods');
        if (parseInt(existing.rows[0].count) > 0) {
            return res.status(200).json({ message: 'La tabla de alimentos ya tiene datos.' });
        }

        const initialFoods = [
            { name: 'Pechuga de Pollo', cals: 165, p: 31, c: 0, f: 3.6, portion: '100g' },
            { name: 'Arroz Blanco Cocido', cals: 130, p: 2.7, c: 28, f: 0.3, portion: '100g' },
            { name: 'Huevo Entero', cals: 72, p: 6, c: 0.4, f: 5, portion: '1 pieza (50g)' },
            { name: 'Claras de Huevo', cals: 17, p: 3.6, c: 0.2, f: 0.1, portion: '1 pieza (33g)' },
            { name: 'Avena en Hojuelas', cals: 389, p: 16.9, c: 66.3, f: 6.9, portion: '100g' },
            { name: 'Aguacate', cals: 160, p: 2, c: 8.5, f: 14.7, portion: '100g' },
            { name: 'Atún en Agua (Lata)', cals: 116, p: 26, c: 0, f: 1, portion: '1 lata (130g)' },
            { name: 'Carne Magra de Res', cals: 250, p: 26, c: 0, f: 15, portion: '100g' },
            { name: 'Papa Cocida', cals: 87, p: 1.9, c: 20.1, f: 0.1, portion: '100g' },
            { name: 'Tortilla de Maíz', cals: 52, p: 1.4, c: 10.7, f: 0.5, portion: '1 pieza (25g)' },
            { name: 'Manzana', cals: 52, p: 0.3, c: 14, f: 0.2, portion: '100g' },
            { name: 'Plátano', cals: 89, p: 1.1, c: 22.8, f: 0.3, portion: '100g' },
            { name: 'Frijoles Cocidos', cals: 347, p: 21, c: 63, f: 1.2, portion: '100g crudos' },
            { name: 'Aceite de Oliva', cals: 119, p: 0, c: 0, f: 13.5, portion: '1 cucharada (15ml)' },
            { name: 'Whey Protein Isolate', cals: 110, p: 25, c: 1, f: 0.5, portion: '1 scoop (30g)' }
        ];

        for (const food of initialFoods) {
            await db.query(
                `INSERT INTO foods (name, calories_per_portion, protein, carbs, fats, default_portion) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
                [food.name, food.cals, food.p, food.c, food.f, food.portion]
            );
        }

        res.status(201).json({ message: 'Alimentos base insertados correctamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error poblando la base de datos de alimentos' });
    }
};

const searchFoods = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.length < 2) {
            return res.status(200).json([]);
        }

        const searchQuery = `%${q}%`;
        const results = await db.query(
            `SELECT * FROM foods WHERE name ILIKE $1 LIMIT 10`,
            [searchQuery]
        );

        res.status(200).json(results.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error buscando alimentos' });
    }
};

module.exports = {
    seedFoods,
    searchFoods
};
