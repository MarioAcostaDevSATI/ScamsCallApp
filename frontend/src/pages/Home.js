import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, BarChart3, Users, Phone, Mail } from 'lucide-react';

const Home = () => {
  const stats = [
    { label: 'Reportes Mensuales', value: '1,200+' },
    { label: 'Números Reportados', value: '850+' },
    { label: 'Ciudades Activas', value: '25+' },
    { label: 'Estafas Prevenidas', value: '300+' },
  ];

  const features = [
    {
      icon: <AlertTriangle className="h-8 w-8" />,
      title: 'Reporte Rápido',
      description: 'Reporta estafas telefónicas en menos de 2 minutos con nuestro formulario simplificado.'
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: 'Estadísticas en Tiempo Real',
      description: 'Accede a datos actualizados sobre estafas reportadas en tu ciudad y a nivel nacional.'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Comunidad Protegida',
      description: 'Tu reporte ayuda a proteger a miles de colombianos alertando sobre números fraudulentos.'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Protección de Datos',
      description: 'Tu información personal está protegida bajo la Ley 1581 de 2012. Tu privacidad es importante.'
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
          Protegiendo a los
          <span className="text-blue-600"> Colombianos</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Plataforma colaborativa para reportar estafas telefónicas. 
          Juntos podemos combatir el fraude y crear una comunidad más segura.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/reportar"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            Reportar una Estafa
          </Link>
          <Link
            to="/dashboard"
            className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
          >
            Ver Estadísticas
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-12">¿Cómo Funciona?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Emergency Section */}
      <section className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-red-900 mb-4">¿Estás en Peligro Inmediato?</h2>
        <p className="text-red-800 mb-6">
          Si estás siendo víctima de extorsión o te sientes amenazado, contacta inmediatamente a las autoridades.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="tel:123"
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Phone className="h-5 w-5" />
            <span>Llamar al 123 (Policía)</span>
          </a>
          <a
            href="#!"
            className="border border-red-600 text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-100 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Mail className="h-5 w-5" />
            <span>Contactar al GAULA</span>
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
