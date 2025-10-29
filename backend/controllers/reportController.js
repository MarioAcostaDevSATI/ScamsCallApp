const Report = require('../models/Report');
const { body, validationResult } = require('express-validator');
const { uploadToCloudStorage } = require('../services/cloudStorage');

// Validaciones
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

// Crear reporte
exports.createReport = async (req, res) => {
  try {
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

    // Obtener user_id del token (implementar después de auth)
    const user_id = req.user?.id || 1; // Temporal para pruebas

    let evidence_url = null;
    if (req.file) {
      evidence_url = await uploadToCloudStorage(req.file);
    }

    const reportData = {
      user_id,
      phone_number,
      description,
      evidence_url,
      report_type,
      location,
      coordinates: coordinates ? JSON.parse(coordinates) : null
    };

    const newReport = await Report.create(reportData);

    // Actualizar números reportados
    await updateReportedNumbers(phone_number);

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
    
    const reports = await Report.findByPhoneNumber(phone);
    
    res.json({
      success: true,
      data: {
        phone_number: phone,
        total_reports: reports.length,
        reports: reports
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error obteniendo reportes',
      error: error.message
    });
  }
};

// Estadísticas
exports.getStats = async (req, res) => {
  try {
    const stats = await Report.getStats();
    
    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error obteniendo estadísticas',
      error: error.message
    });
  }
};

// Función auxiliar para actualizar números reportados
async function updateReportedNumbers(phoneNumber) {
  const sql = `
    INSERT INTO reported_numbers (phone_number, report_count) 
    VALUES ($1, 1)
    ON CONFLICT (phone_number) 
    DO UPDATE SET 
      report_count = reported_numbers.report_count + 1,
      last_reported = CURRENT_TIMESTAMP
  `;
  
  await query(sql, [phoneNumber]);
}