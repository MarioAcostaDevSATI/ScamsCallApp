const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// @route   GET /api/agents/dashboard
// @desc    Obtener dashboard para agentes
// @access  Private (solo agentes)
router.get('/dashboard', async (req, res) => {
  try {
    // Estadísticas para el dashboard
    const statsQuery = `
      SELECT 
        COUNT(*) as total_reports,
        COUNT(DISTINCT phone_number) as unique_numbers,
        COUNT(CASE WHEN DATE(created_at) = CURRENT_DATE THEN 1 END) as reports_today,
        report_type,
        COUNT(*) as count_by_type
      FROM reports 
      GROUP BY report_type
    `;

    const recentReportsQuery = `
      SELECT r.*, u.email as user_email 
      FROM reports r 
      LEFT JOIN users u ON r.user_id = u.id 
      ORDER BY r.created_at DESC 
      LIMIT 10
    `;

    const [statsResult, recentResult] = await Promise.all([
      query(statsQuery),
      query(recentReportsQuery)
    ]);

    const stats = statsResult.rows;
    const recentReports = recentResult.rows;

    // Calcular totales
    const totalReports = stats.reduce((sum, item) => sum + parseInt(item.total_reports), 0);
    const totalUniqueNumbers = stats.reduce((sum, item) => sum + parseInt(item.unique_numbers), 0);

    res.json({
      success: true,
      data: {
        summary: {
          total_reports: totalReports,
          unique_numbers: totalUniqueNumbers,
          reports_today: stats[0]?.reports_today || 0
        },
        by_type: stats,
        recent_reports: recentReports
      }
    });

  } catch (error) {
    console.error('❌ Error en agents dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo datos del dashboard',
      error: error.message
    });
  }
});

// @route   GET /api/agents/numbers/most-reported
// @desc    Obtener números más reportados
// @access  Private (solo agentes)
router.get('/numbers/most-reported', async (req, res) => {
  try {
    const queryText = `
      SELECT phone_number, report_count, first_reported, last_reported, confidence_score
      FROM reported_numbers 
      ORDER BY report_count DESC, confidence_score DESC 
      LIMIT 20
    `;

    const result = await query(queryText);
    
    res.json({
      success: true,
      data: {
        numbers: result.rows
      }
    });

  } catch (error) {
    console.error('❌ Error obteniendo números reportados:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo números reportados',
      error: error.message
    });
  }
});

module.exports = router;
