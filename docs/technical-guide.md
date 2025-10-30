
# Guía Técnica - ScamsCallAPP

## Descripción General
ScamsCallAPP es una plataforma colaborativa para reportar estafas telefónicas en Colombia, desarrollada con tecnologías modernas y enfoque en seguridad.

## Arquitectura del Sistema

### Componentes Principales
1. **Frontend Web**: React.js con TailwindCSS
2. **Backend API**: Node.js con Express.js
3. **Base de Datos**: PostgreSQL
4. **Aplicación Móvil**: React Native con Expo
5. **Chatbot**: Sistema básico (futuro: Dialogflow CX)

### Stack Tecnológico
- **Frontend**: React 18, React Router, Axios, TailwindCSS
- **Backend**: Node.js, Express, PostgreSQL, JWT, bcrypt
- **Mobile**: React Native, Expo, React Navigation
- **DevOps**: Git, GitHub, XAMPP (desarrollo local)

## Configuración del Entorno de Desarrollo

### Prerrequisitos
- Node.js 16+
- PostgreSQL 12+
- XAMPP (opcional)
- Git

### Instalación Backend
```bash
cd backend
npm install
cp .env.example .env
# Configurar variables en .env
npm run dev
