'use client'

import { useState } from 'react'

interface ReportFormData {
  phone_number: string
  scam_type: string
  description: string
  location: string
  call_date: string
  amount_lost?: string
  anonymous: boolean
}

interface ReportFormProps {
  onSubmit: (data: ReportFormData) => void
}

export default function ReportForm({ onSubmit }: ReportFormProps) {
  const [formData, setFormData] = useState<ReportFormData>({
    phone_number: '',
    scam_type: '',
    description: '',
    location: '',
    call_date: new Date().toISOString().split('T')[0],
    amount_lost: '',
    anonymous: false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const scamTypes = [
    { value: 'financial', label: '💰 Estafa financiera' },
    { value: 'threat', label: '⚠️ Amenazas o extorsión' },
    { value: 'identity_theft', label: '🆔 Suplantación de identidad' },
    { value: 'service_fraud', label: '📞 Fraude de servicios' },
    { value: 'prize_scam', label: '🎁 Estafa de premios' },
    { value: 'tech_support', label: '💻 Soporte técnico falso' },
    { value: 'other', label: '❓ Otro tipo' }
  ]

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validar número telefónico (formato colombiano básico)
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'El número telefónico es requerido'
    } else if (!/^[0-9+]{10,15}$/.test(formData.phone_number.replace(/\s/g, ''))) {
      newErrors.phone_number = 'Ingresa un número válido (ej: 3001234567)'
    }

    // Validar tipo de estafa
    if (!formData.scam_type) {
      newErrors.scam_type = 'Selecciona el tipo de estafa'
    }

    // Validar descripción
    if (formData.description.length > 1000) {
      newErrors.description = 'La descripción no puede exceder 1000 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleChange = (field: keyof ReportFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Reportar Estafa Telefónica</h2>
        <p className="text-gray-600 mt-2">Completa la información para ayudar a la comunidad</p>
      </div>

      {/* Número Telefónico */}
      <div>
        <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
          Número que te llamó *
        </label>
        <input
          type="text"
          id="phone_number"
          value={formData.phone_number}
          onChange={(e) => handleChange('phone_number', e.target.value)}
          placeholder="Ej: 3001234567"
          className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.phone_number ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.phone_number && (
          <p className="mt-1 text-sm text-red-600">{errors.phone_number}</p>
        )}
      </div>

      {/* Tipo de Estafa */}
      <div>
        <label htmlFor="scam_type" className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de estafa *
        </label>
        <select
          id="scam_type"
          value={formData.scam_type}
          onChange={(e) => handleChange('scam_type', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.scam_type ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Selecciona el tipo de estafa</option>
          {scamTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        {errors.scam_type && (
          <p className="mt-1 text-sm text-red-600">{errors.scam_type}</p>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          ¿Qué sucedió? (Opcional)
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Describe lo que te dijeron, cómo fue la estafa, detalles importantes..."
          rows={4}
          className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        <div className="flex justify-between mt-1">
          <span className="text-sm text-gray-500">
            {formData.description.length}/1000 caracteres
          </span>
          {errors.description && (
            <span className="text-sm text-red-600">{errors.description}</span>
          )}
        </div>
      </div>

      {/* Ubicación */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
          ¿Dónde ocurrió? (Opcional)
        </label>
        <input
          type="text"
          id="location"
          value={formData.location}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="Ciudad o municipio"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Fecha de la llamada */}
      <div>
        <label htmlFor="call_date" className="block text-sm font-medium text-gray-700 mb-2">
          Fecha de la llamada
        </label>
        <input
          type="date"
          id="call_date"
          value={formData.call_date}
          onChange={(e) => handleChange('call_date', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Reporte Anónimo */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="anonymous"
          checked={formData.anonymous}
          onChange={(e) => handleChange('anonymous', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-700">
          Enviar reporte de forma anónima
        </label>
      </div>

      {/* Botón de Envío */}
      <div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
        >
          🚨 Enviar Reporte
        </button>
      </div>

      {/* Información Legal */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800 text-center">
          Al enviar este reporte, aceptas nuestra Política de Privacidad y confirmas que la información es veraz según la Ley 1581 de 2012 de protección de datos en Colombia.
        </p>
      </div>
    </form>
  )
}
