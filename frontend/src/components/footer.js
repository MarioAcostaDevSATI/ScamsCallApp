import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Shield className="h-6 w-6 text-blue-400" />
              <span className="text-lg font-bold">ScamsCall Colombia</span>
            </Link>
            <p className="text-gray-300 mb-4">
              Plataforma colaborativa para reportar estafas telefónicas y proteger a la comunidad colombiana.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-300">
              <div className="flex items-center space-x-1">
                <Phone className="h-4 w-4" />
                <span>Línea de emergencia: 123</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className="h-4 w-4" />
                <span>contacto@scamscall.gov.co</span>
              </div>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/reportar" className="text-gray-300 hover:text-white">
                  Reportar Estafa
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-white">
                  Dashboard
                </Link>
              </li>
              <li>
                <a href="#!" className="text-gray-300 hover:text-white">
                  Preguntas Frecuentes
                </a>
              </li>
            </ul>
          </div>

          {/* Información legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#!" className="text-gray-300 hover:text-white">
                  Términos de Uso
                </a>
              </li>
              <li>
                <a href="#!" className="text-gray-300 hover:text-white">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="#!" className="text-gray-300 hover:text-white">
                  Ley 1581 de 2012
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-300">
          <p>&copy; 2024 ScamsCall Colombia. Todos los derechos reservados.</p>
          <p className="mt-1">Proyecto desarrollado para el Gobierno de Colombia.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
