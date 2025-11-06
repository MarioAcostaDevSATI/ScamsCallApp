'use client'

import { useState } from 'react'
import ReportForm from '../src/components/forms/ReportForm'

export default function Home() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (formData: any) => {
    console.log('Datos del formulario:', formData)
    // Aquí iría la lógica para enviar a tu API
    setIsSubmitted(true)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">
            🚨 Scams Call App
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Reporta estafas telefónicas y protege a tu comunidad
          </p>
          <p className="text-gray-500">
            Tu reporte ayuda a identificar y prevenir estafas en Colombia
          </p>
        </header>

        {/* Alertas */}
        {isSubmitted && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            ✅ Reporte enviado exitosamente. ¡Gracias por contribuir a la seguridad colectiva!
          </div>
        )}

        {/* Componente de Reporte */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <ReportForm onSubmit={handleSubmit} />
        </div>

        {/* Información adicional */}
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="text-3xl mb-2">📞</div>
            <h3 className="font-semibold mb-2">Reporta Llamadas</h3>
            <p className="text-sm text-gray-600">Números sospechosos y estafas telefónicas</p>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg">
            <div className="text-3xl mb-2">🛡️</div>
            <h3 className="font-semibold mb-2">Protege a Otros</h3>
            <p className="text-sm text-gray-600">Tu reporte alerta a la comunidad</p>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-semibold mb-2">Datos en Tiempo Real</h3>
            <p className="text-sm text-gray-600">Análisis de patrones de estafas</p>
          </div>
        </div>
      </div>
    </main>
  )
}
