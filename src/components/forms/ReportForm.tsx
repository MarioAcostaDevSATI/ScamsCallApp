import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const reportSchema = z.object({
  phoneNumber: z.string().min(10, 'Número debe tener al menos 10 dígitos'),
  reportType: z.enum(['extorsion', 'phishing', 'fraude', 'acoso', 'otros']),
  description: z.string().min(10, 'Descripción debe tener al menos 10 caracteres'),
  evidence: z.string().optional(),
  location: z.string().optional(),
});

type ReportFormData = z.infer<typeof reportSchema>;

export const ReportForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
  });

  const onSubmit = async (data: ReportFormData) => {
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        alert('Reporte enviado exitosamente');
        // Reset form
      } else {
        alert('Error al enviar el reporte');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Número Telefónico Reportado
        </label>
        <input
          {...register('phoneNumber')}
          type="tel"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          placeholder="+57 XXX XXX XXXX"
        />
        {errors.phoneNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tipo de Estafa
        </label>
        <select
          {...register('reportType')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">Seleccione un tipo</option>
          <option value="extorsion">Extorsión</option>
          <option value="phishing">Phishing</option>
          <option value="fraude">Fraude</option>
          <option value="acoso">Acoso</option>
          <option value="otros">Otros</option>
        </select>
        {errors.reportType && (
          <p className="mt-1 text-sm text-red-600">{errors.reportType.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Descripción Detallada
        </label>
        <textarea
          {...register('description')}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          placeholder="Describa lo que sucedió, hora, lo que le pidieron, etc."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        Reportar Estafa
      </button>
    </form>
  );
};
