export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://tu-backend.railway.app'
  : 'http://localhost:5000';

export const IS_DEMO_MODE = process.env.NODE_ENV === 'production';
