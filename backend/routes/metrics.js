const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const User = require('../models/User');

// Métricas públicas accesibles para todos
router.get('/public', async (req, res) => {
  try {
    const totalReports = await Report.countDocuments();
    const totalUsers = await User.countDocuments({ isActive: true });
    const reportsByType = await Report.aggregate([
      { $group: { _id: '$reportType', count: { $sum: 1 } } }
    ]);
    
    const recentActivity = await Report.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('reportType createdAt status');
      
    res.json({
      totalReports,
      totalUsers,
      reportsByType,
      recentActivity,
      lastUpdated: new Date()
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo métricas' });
  }
});

// Métricas para agentes (requiere autenticación)
router.get('/agent', authenticateToken, async (req, res) => {
  try {
    // Verificar que el usuario es agente
    if (req.user.role !== 'agent' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso no autorizado' });
    }
    
    const reportsByStatus = await Report.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    const dailyReports = await Report.aggregate([
      { 
        $group: { 
          _id: { 
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } 
          }, 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { _id: -1 } },
      { $limit: 30 }
    ]);
    
    res.json({
      reportsByStatus,
      dailyReports,
      agentId: req.user.userId
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo métricas de agente' });
  }
});

module.exports = router;
