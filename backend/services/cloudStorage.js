// Servicio para manejar almacenamiento en la nube
// Por ahora usamos almacenamiento local, pero se puede migrar a GCP/AWS

const path = require('path');
const fs = require('fs');

/**
 * Subir archivo a almacenamiento local (para MVP)
 * En producción, reemplazar con Google Cloud Storage o AWS S3
 */
const uploadToLocalStorage = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }

    try {
      // En MVP, simplemente retornamos la ruta local
      const fileUrl = `/uploads/${file.filename}`;
      resolve(fileUrl);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Eliminar archivo del almacenamiento local
 */
const deleteFromLocalStorage = (filePath) => {
  return new Promise((resolve, reject) => {
    if (!filePath) {
      resolve(true);
      return;
    }

    const fullPath = path.join(__dirname, '../', filePath);
    
    fs.unlink(fullPath, (error) => {
      if (error) {
        console.error('Error eliminando archivo:', error);
        reject(error);
      } else {
        resolve(true);
      }
    });
  });
};

// Para futura integración con Google Cloud Storage
const uploadToGCS = async (file) => {
  // Implementación para Google Cloud Storage
  // Requiere configuración de credenciales GCP
  throw new Error('GCS integration not implemented yet');
};

// Para futura integración con AWS S3
const uploadToS3 = async (file) => {
  // Implementación para AWS S3
  // Requiere configuración de credenciales AWS
  throw new Error('S3 integration not implemented yet');
};

module.exports = {
  uploadToCloudStorage: uploadToLocalStorage, // Usamos local por ahora
  deleteFromCloudStorage: deleteFromLocalStorage,
  uploadToGCS,
  uploadToS3
};
