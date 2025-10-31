// Servicio de demostración - Simula el backend
class DemoService {
  constructor() {
    this.demoReports = this.loadDemoData();
  }

  loadDemoData() {
    return [
      {
        id: 1,
        phone_number: '+573001234567',
        description: 'Llamada ofreciendo tarjeta de crédito con información falsa - EJEMPLO DEMO',
        report_type: 'estafa',
        location: 'Bogotá',
        status: 'pending',
        created_at: new Date().toISOString(),
        tracking_code: 'SC-000001'
      },
      {
        id: 2, 
        phone_number: '+573009876543',
        description: 'Persona que se hace pasar por funcionario de la DIAN - EJEMPLO DEMO',
        report_type: 'extorsion',
        location: 'Medellín',
        status: 'reviewed',
        created_at: new Date(Date.now() - 86400000).toISOString(), // Ayer
        tracking_code: 'SC-000002'
      },
      {
        id: 3,
        phone_number: '+573005551234',
        description: 'Mensaje de texto con enlace fraudulento - EJEMPLO DEMO',
        report_type: 'phishing', 
        location: 'Cali',
        status: 'action_taken',
        created_at: new Date(Date.now() - 172800000).toISOString(), // Hace 2 días
        tracking_code: 'SC-000003'
      }
    ];
  }

  // Simular envío de reporte
  async submitReport(reportData) {
    console.log('📨 Enviando reporte DEMO:', reportData);
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newReport = {
      id: this.demoReports.length + 1,
      ...reportData,
      status: 'pending',
      created_at: new Date().toISOString(),
      tracking_code: `SC-${String(this.demoReports.length + 1).padStart(6, '0')}`
    };
    
    this.demoReports.unshift(newReport);
    
    return {
      success: true,
      message: '¡Reporte enviado exitosamente! (Modo Demo)',
      data: {
        report_id: newReport.id,
        tracking_code: newReport.tracking_code
      }
    };
  }

  // Simular obtención de estadísticas
  async getStats() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const stats = {
      total_reports: this.demoReports.length,
      unique_numbers: new Set(this.demoReports.map(r => r.phone_number)).size,
      by_type: this.demoReports.reduce((acc, report) => {
        acc[report.report_type] = (acc[report.report_type] || 0) + 1;
        return acc;
      }, {}),
      recent_reports: this.demoReports.slice(0, 5)
    };
    
    return {
      success: true,
      data: stats
    };
  }

  // Simular búsqueda por número
  async searchByPhone(phone) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const results = this.demoReports.filter(report => 
      report.phone_number.includes(phone)
    );
    
    return {
      success: true,
      data: {
        phone_number: phone,
        total_reports: results.length,
        reports: results
      }
    };
  }
}

export const demoService = new DemoService();