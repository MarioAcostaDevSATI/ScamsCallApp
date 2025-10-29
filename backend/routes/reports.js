const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(auth);

// Crear reporte con upload de archivos
router.post(
  '/',
  upload.single('evidence'),
  reportController.validateReport,
  reportController.createReport
);

// Obtener reportes por número telefónico
router.get('/phone/:phone', reportController.getReportsByPhone);

// Estadísticas (solo para agentes)
router.get('/stats', reportController.getStats);

module.exports = router;