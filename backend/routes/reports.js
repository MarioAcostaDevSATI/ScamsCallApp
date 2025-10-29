const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { upload, handleUploadErrors } = require('../middleware/upload');
const { optionalAuth } = require('../middleware/auth');

// @route   POST /api/reports
// @desc    Crear nuevo reporte
// @access  Public (con autenticación opcional)
router.post(
  '/',
  upload.single('evidence'),
  handleUploadErrors,
  reportController.validateReport,
  reportController.createReport
);

// @route   GET /api/reports/phone/:phone
// @desc    Obtener reportes por número telefónico
// @access  Public
router.get('/phone/:phone', reportController.getReportsByPhone);

// @route   GET /api/reports/stats
// @desc    Obtener estadísticas de reportes
// @access  Public
router.get('/stats', reportController.getStats);

// @route   GET /api/reports/test
// @desc    Ruta de prueba para reportes
// @access  Public
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Módulo de reportes funcionando correctamente',
    endpoints: {
      'POST /api/reports': 'Crear nuevo reporte',
      'GET /api/reports/phone/:phone': 'Buscar reportes por número',
      'GET /api/reports/stats': 'Obtener estadísticas'
    }
  });
});

module.exports = router;
