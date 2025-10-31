// Configuración para Demo Express
export const CONFIG = {
  // En producción (GitHub Pages) usamos modo demo
  IS_DEMO_MODE: process.env.NODE_ENV === 'production',
  
  // URL de la API - en demo no la usamos realmente
  API_BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://demo-scamscall-api.fake'  // No existe, usamos datos fake
    : 'http://localhost:5000',
    
  // Nombre de la app
  APP_NAME: 'ScamsCall Colombia - DEMO'
};

console.log('🔧 Modo Demo Activado:', CONFIG.IS_DEMO_MODE);
