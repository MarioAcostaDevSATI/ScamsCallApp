import React, { useState, useEffect } from 'react';
import { BarChart, Users, Flag, Activity } from 'lucide-react';

const PublicMetrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('https://tu-backend.railway.app/api/metrics/public');
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) return <div className="text-center">Cargando métricas...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <Flag className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <p className="text-2xl font-bold">{metrics?.totalReports || 0}</p>
            <p className="text-gray-600">Reportes Totales</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <Users className="h-8 w-8 text-green-600 mr-3" />
          <div>
            <p className="text-2xl font-bold">{metrics?.totalUsers || 0}</p>
            <p className="text-gray-600">Usuarios Registrados</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <Activity className="h-8 w-8 text-orange-600 mr-3" />
          <div>
            <p className="text-2xl font-bold">
              {metrics?.reportsByType?.find(r => r._id === 'estafa')?.count || 0}
            </p>
            <p className="text-gray-600">Estafas Reportadas</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <BarChart className="h-8 w-8 text-purple-600 mr-3" />
          <div>
            <p className="text-2xl font-bold">
              {metrics?.recentActivity?.length || 0}
            </p>
            <p className="text-gray-600">Actividad Reciente</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicMetrics;
