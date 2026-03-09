CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Usuarios y Perfil
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    age INT,
    gender VARCHAR(10),
    height DECIMAL(5,2),
    current_weight DECIMAL(5,2),
    target_weight DECIMAL(5,2),
    activity_level VARCHAR(50), 
    training_type VARCHAR(50),
    training_days INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Historial de Ayunos
CREATE TABLE IF NOT EXISTS fasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    target_hours INT NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    is_fighter_mode BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alimentos (Base de Datos General)
CREATE TABLE IF NOT EXISTS foods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    calories_per_portion INT NOT NULL,
    protein DECIMAL(6,2),
    carbs DECIMAL(6,2),
    fats DECIMAL(6,2),
    default_portion VARCHAR(50)
);

-- Registro de Comidas del Usuario
CREATE TABLE IF NOT EXISTS meals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    meal_type VARCHAR(50),
    name VARCHAR(100),
    calories INT NOT NULL,
    protein DECIMAL(6,2),
    carbs DECIMAL(6,2),
    fats DECIMAL(6,2),
    portion VARCHAR(50),
    consumed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seguimiento de Peso y Medidas
CREATE TABLE IF NOT EXISTS weights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    weight DECIMAL(5,2) NOT NULL,
    body_fat_percentage DECIMAL(5,2),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Registro de Entrenamientos
CREATE TABLE IF NOT EXISTS workouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    duration_minutes INT NOT NULL,
    calories_burned INT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
