const { query } = require('../config/database');

class Report {
  // Crear un nuevo reporte
  static async create(reportData) {
    const {
      user_id,
      phone_number,
      description,
      evidence_url,
      report_type = 'estafa',
      location,
      coordinates
    } = reportData;

    const sql = `
      INSERT INTO reports (
        user_id, phone_number, description, evidence_url, 
        report_type, location, coordinates, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
      RETURNING *
    `;

    const values = [
      user_id,
      phone_number,
      description,
      evidence_url,
      report_type,
      location,
      coordinates
    ];

    try {
      const result = await query(sql, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creando reporte: ${error.message}`);
    }
  }

  // Buscar reportes por número telefónico
  static async findByPhoneNumber(phoneNumber) {
    const sql = `
      SELECT * FROM reports 
      WHERE phone_number = $1 
      ORDER BY created_at DESC
    `;
    
    const result = await query(sql, [phoneNumber]);
    return result.rows;
  }

  // Obtener estadísticas
  static async getStats(timeframe = '7days') {
    let dateFilter = '';
    
    switch (timeframe) {
      case 'today':
        dateFilter = "WHERE DATE(created_at) = CURRENT_DATE";
        break;
      case '7days':
        dateFilter = "WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'";
        break;
      case '30days':
        dateFilter = "WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'";
        break;
      default:
        dateFilter = '';
    }

    const sql = `
      SELECT 
        COUNT(*) as total_reports,
        COUNT(DISTINCT phone_number) as unique_numbers,
        report_type,
        DATE(created_at) as report_date,
        COUNT(CASE WHEN DATE(created_at) = CURRENT_DATE THEN 1 END) as reports_today
      FROM reports 
      ${dateFilter}
      GROUP BY report_type, DATE(created_at)
      ORDER BY report_date DESC
    `;
    
    const result = await query(sql);
    return result.rows;
  }

  // Obtener reportes recientes
  static async getRecent(limit = 10) {
    const sql = `
      SELECT r.*, u.email as reporter_email 
      FROM reports r 
      LEFT JOIN users u ON r.user_id = u.id 
      ORDER BY r.created_at DESC 
      LIMIT $1
    `;
    
    const result = await query(sql, [limit]);
    return result.rows;
  }

  // Actualizar estado de un reporte
  static async updateStatus(reportId, status) {
    const sql = `
      UPDATE reports 
      SET status = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2 
      RETURNING *
    `;
    
    const result = await query(sql, [status, reportId]);
    return result.rows[0];
  }
}

module.exports = Report;
