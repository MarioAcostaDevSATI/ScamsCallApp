-- Crear base de datos
CREATE DATABASE scamscall;

-- Conectar a la base de datos
\c scamscall;

-- Extensión para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    auth_provider VARCHAR(50) NOT NULL, -- 'local', 'google', 'apple'
    provider_id VARCHAR(255), -- ID del proveedor OAuth
    full_name VARCHAR(255),
    phone_number VARCHAR(20),
    personal_data_consent BOOLEAN DEFAULT FALSE,
    consent_date TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de reportes
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4(),
    user_id INTEGER REFERENCES users(id),
    phone_number VARCHAR(20) NOT NULL,
    description TEXT NOT NULL,
    evidence_url VARCHAR(500),
    report_type VARCHAR(50) NOT NULL CHECK (report_type IN ('estafa', 'extorsion', 'phishing', 'otros')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'action_taken', 'closed')),
    priority INTEGER DEFAULT 1 CHECK (priority BETWEEN 1 AND 3),
    location VARCHAR(100),
    coordinates POINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de números reportados (para inteligencia)
CREATE TABLE reported_numbers (
    id SERIAL PRIMARY KEY,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    report_count INTEGER DEFAULT 1,
    first_reported TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_reported TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confidence_score DECIMAL(3,2) DEFAULT 0.5,
    is_block_recommended BOOLEAN DEFAULT FALSE
);

-- Tabla de agentes autorizados
CREATE TABLE agents (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    institution VARCHAR(100) NOT NULL,
    institutional_email VARCHAR(255) UNIQUE NOT NULL,
    badge_number VARCHAR(50),
    access_level INTEGER DEFAULT 1 CHECK (access_level BETWEEN 1 AND 3),
    is_active BOOLEAN DEFAULT TRUE,
    assigned_zone VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de conversaciones con chatbot
CREATE TABLE chatbot_conversations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    session_id VARCHAR(255) NOT NULL,
    message_text TEXT NOT NULL,
    bot_response TEXT,
    intent_detected VARCHAR(100),
    confidence_score DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de alertas para agentes
CREATE TABLE agent_alerts (
    id SERIAL PRIMARY KEY,
    agent_id INTEGER REFERENCES agents(id),
    report_id INTEGER REFERENCES reports(id),
    alert_type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    priority INTEGER DEFAULT 1,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejor performance
CREATE INDEX idx_reports_phone_number ON reports(phone_number);
CREATE INDEX idx_reports_created_at ON reports(created_at);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reported_numbers_score ON reported_numbers(confidence_score);
CREATE INDEX idx_chatbot_sessions ON chatbot_conversations(session_id);
CREATE INDEX idx_agents_institution ON agents(institution);

-- Función para actualizar timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Vista para dashboard
CREATE VIEW report_stats AS
SELECT 
    DATE(created_at) as report_date,
    report_type,
    COUNT(*) as report_count,
    COUNT(DISTINCT phone_number) as unique_numbers
FROM reports 
GROUP BY DATE(created_at), report_type;

-- Insertar datos de prueba
INSERT INTO users (email, auth_provider, full_name, personal_data_consent) VALUES
('ciudadano@ejemplo.com', 'local', 'Juan Pérez', true),
('agente@policia.gov.co', 'local', 'Agente Policía', true);

INSERT INTO agents (user_id, institution, institutional_email, access_level) VALUES
(2, 'Policía Nacional', 'agente@policia.gov.co', 3);
