import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Shield, Upload, AlertTriangle, CheckCircle } from 'lucide-react';
import axios from 'axios';

const ReportForm = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen debe ser menor a 5MB');
        return;
      }
      setImage(file);
    }
  };

  const onSubmit = async (data) => {
  setIsSubmitting(true);
  setSubmitResult(null);

  try {
    const response = await apiService.submitReport({
      phone_number: data.phone_number,
      description: data.description,
      report_type: data.report_type,
      location: data.location,
      // En demo no enviamos la imagen realmente
    });

    if (response.success) {
      setSubmitResult({
        type: 'success',
        message: response.message || '¡Reporte enviado exitosamente!',
        trackingCode: response.data.tracking_code
      });
      
      reset();
      setImage(null);
    } else {
      setSubmitResult({
        type: 'error',
        message: response.message || 'Error al enviar el reporte.'
      });
    }
  } catch (error) {
    console.error('Error:', error);
    setSubmitResult({
      type: 'error',
      message: 'Error inesperado. Por favor intente nuevamente.'
    });
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <Shield className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">
            Reportar Estafa Telefónica
          </h1>
        </div>

        {submitResult && (
          <div className={`p-4 rounded-md mb-6 ${
            submitResult.type === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center">
              {submitResult.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
              )}
              <span className={submitResult.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                {submitResult.message}
                {submitResult.trackingCode && (
                  <div className="font-mono text-sm mt-1">
                    Código de seguimiento: {submitResult.trackingCode}
                  </div>
                )}
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Número telefónico */}
          <div>
            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
              Número telefónico del estafador *
            </label>
            <input
              type="tel"
              id="phone_number"
              {...register('phone_number', {
                required: 'Este campo es requerido',
                pattern: {
                  value: /^(\+57|57)?[1-9]\d{9}$/,
                  message: 'Ingrese un número telefónico colombiano válido'
                }
              })}
              placeholder="+57 312 345 6789"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.phone_number && (
              <p className="mt-1 text-sm text-red-600">{errors.phone_number.message}</p>
            )}
          </div>

          {/* Tipo de reporte */}
          <div>
            <label htmlFor="report_type" className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de estafa *
            </label>
            <select
              id="report_type"
              {...register('report_type', { required: 'Seleccione un tipo de estafa' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccione una opción</option>
              <option value="estafa">Estafa financiera</option>
              <option value="extorsion">Extorsión</option>
              <option value="phishing">Phishing/Suplantación</option>
              <option value="otros">Otros</option>
            </select>
            {errors.report_type && (
              <p className="mt-1 text-sm text-red-600">{errors.report_type.message}</p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción de lo ocurrido *
            </label>
            <textarea
              id="description"
              rows={4}
              {...register('description', {
                required: 'Este campo es requerido',
                minLength: {
                  value: 10,
                  message: 'La descripción debe tener al menos 10 caracteres'
                },
                maxLength: {
                  value: 1000,
                  message: 'La descripción no puede exceder 1000 caracteres'
                }
              })}
              placeholder="Describa en detalle lo que ocurrió, qué le solicitaron, cómo se comunicaron con usted..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Ubicación */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Ciudad/Municipio
            </label>
            <input
              type="text"
              id="location"
              {...register('location')}
              placeholder="Ej: Bogotá, Medellín, Cali..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Adjuntar imagen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Captura de pantalla (opcional)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="evidence" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                    <span>Subir archivo</span>
                    <input
                      id="evidence"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">o arrastrar y soltar</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF hasta 5MB
                </p>
              </div>
            </div>
            {image && (
              <p className="mt-2 text-sm text-green-600">
                ✓ Archivo seleccionado: {image.name}
              </p>
            )}
          </div>

          {/* Botón de envío */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Enviando reporte...' : 'Enviar Reporte'}
            </button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            Al enviar este reporte, acepta nuestros términos de uso y política de privacidad.
            Su información personal está protegida bajo la Ley 1581 de 2012.
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportForm;
