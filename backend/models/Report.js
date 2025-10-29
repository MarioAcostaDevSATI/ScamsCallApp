const { query } = require('../config/database');

class Report {
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
        report_type, location, coordinates
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      user_id,
      phone_number,
      description,
      evidence_url,
      report_type,
      location,
      coordinates ? `(${coordinates.lat},${coordinates.lng})` : null
    ];

    try {
      const result = await query(sql, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creando reporte: ${error.message}`);
    }
  }

  static async findByPhoneNumber(phoneNumber) {
    const sql = `
      SELECT * FROM reports 
      WHERE phone_number = $1 
      ORDER BY created_at DESC
    `;
    
    const result = await query(sql, [phoneNumber]);
    return result.rows;
  }

  static async getStats() {
    const sql = `
      SELECT 
        COUNT(*) as total_reports,
        COUNT(DISTINCT phone_number) as unique_numbers,
        report_type,
        DATE(created_at) as report_date
      FROM reports 
      GROUP BY report_type, DATE(created_at)
      ORDER BY report_date DESC
    `;
    
    const result = await query(sql);
    return result.rows;
  }
}

module.exports = Report;