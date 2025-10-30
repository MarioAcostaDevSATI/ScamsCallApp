import { API_BASE_URL, IS_DEMO_MODE } from '../config';
import { demoReports, submitDemoReport } from './demoService';

export const reportService = {
  async submitReport(reportData) {
    if (IS_DEMO_MODE) {
      return submitDemoReport(reportData);
    }
    
    const response = await fetch(`${API_BASE_URL}/api/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportData)
    });
    
    return response.json();
  }
};
