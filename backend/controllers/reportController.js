const { query } = require('../config/database');
const { body, validationResult } = require('express-validator');

// Validaciones para el reporte
exports.validateReport = [
  body('phone_number')
    .isMobilePhone('es-CO')
    .withMessage('Número de teléfono colombiano inválido'),
  body('description')
    .isLength({ min: 10, max: 1000 })
    .withMessage('La descripción debe tener entre 10 y 1000 caracteres'),
  body('report_type')
    .isIn(['estafa', 'extorsion', 'phishing', 'otros'])
    .withMessage('Tipo de reporte inválido')
];

// Crear un nuevo reporte
exports.createReport = async (req, res) => {
  try {
    console.log('Recibiendo reporte:', req.body);
    
    // Validar errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      phone_number,
      description,
      report_type,
      location,
      coordinates
    } = req.body;

    // Para MVP, usar usuario temporal (en producción usar JWT)
    const user_id = 1;

    let evidence_url = null;
    if (req.file) {
      evidence_url = `/uploads/${req.file.filename}`;
    }

    // Insertar en la base de datos
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
      coordinates
    ];

    const result = await query(sql, values);
    const newReport = result.rows[0];

    // Actualizar números reportados
    await updateReportedNumbers(phone_number);

    console.log('Reporte creado exitosamente:', newReport.id);

    res.status(201).json({
      success: true,
      message: 'Reporte creado exitosamente',
      data: {
        report_id: newReport.id,
        tracking_code: `SC-${newReport.id.toString().padStart(6, '0')}`
      }
    });

  } catch (error) {
    console.error('Error en createReport:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener reportes por número telefónico
exports.getReportsByPhone = async (req, res) => {
  try {
    const { phone } = req.params;
    
    const sql = `
      SELECT * FROM reports 
      WHERE phone_number = $1 
      ORDER BY created_at DESC
    `;
    
    const result = await query(sql, [phone]);
    const reports = result.rows;

    res.json({
      success: true,
      data: {
        phone_number: phone,
        total_reports: reports.length,
        reports: reports
      }
    });

  } catch (error) {
    console.error('Error en getReportsByPhone:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo reportes',
      error: error.message
    });
  }
};

// Obtener estadísticas
exports.getStats = async (req, res) => {
  try {
    const sql = `
      SELECT 
        COUNT(*) as total_reports,
        COUNT(DISTINCT phone_number) as unique_numbers,
        report_type,
        DATE(created_at) as report_date
      FROM reports 
      GROUP BY report_type, DATE(created_at)
      ORDER BY report_date DESC
      LIMIT 30
    `;
    
    const result = await query(sql);
    const stats = result.rows;

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error en getStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo estadísticas',
      error: error.message
    });
  }
};

// Función auxiliar para actualizar números reportados
async function updateReportedNumbers(phoneNumber) {
  try {
    const sql = `
      INSERT INTO reported_numbers (phone_number, report_count) 
      VALUES ($1, 1)
      ON CONFLICT (phone_number) 
      DO UPDATE SET 
        report_count = reported_numbers.report_count + 1,
        last_reported = CURRENT_TIMESTAMP
    `;
    
    await query(sql, [phoneNumber]);
  } catch (error) {
    console.error('Error actualizando números reportados:', error);
  }
}
