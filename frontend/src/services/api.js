import { CONFIG } from '../config';
import { demoService } from './demoService';

// Servicio unificado que usa demo en producción y real en desarrollo
export const apiService = {
  // Enviar reporte
  async submitReport(reportData) {
    if (CONFIG.IS_DEMO_MODE) {
      return demoService.submitReport(reportData);
    }
    
    // Código real para desarrollo (opcional)
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/api/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData)
      });
      return response.json();
    } catch (error) {
      return {
        success: false,
        message: 'Error de conexión. Usando modo demo...',
        data: await demoService.submitReport(reportData)
      };
    }
  },

  // Obtener estadísticas
  async getStats() {
    if (CONFIG.IS_DEMO_MODE) {
      return demoService.getStats();
    }
    
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/api/reports/stats`);
      return response.json();
    } catch (error) {
      return demoService.getStats();
    }
  },

  // Buscar por teléfono
  async searchByPhone(phone) {
    if (CONFIG.IS_DEMO_MODE) {
      return demoService.searchByPhone(phone);
    }
    
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/api/reports/phone/${phone}`);
      return response.json();
    } catch (error) {
      return demoService.searchByPhone(phone);
    }
  }
};