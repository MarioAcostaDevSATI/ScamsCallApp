const express = require('express');
const router = express.Router();

// @route   POST /api/chatbot/message
// @desc    Procesar mensaje del chatbot
// @access  Public
router.post('/message', async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    // Respuestas predefinidas para el MVP
    const responses = {
      'hola': '¡Hola! Soy tu asistente virtual para reportar estafas telefónicas. ¿En qué puedo ayudarte?',
      'reportar': 'Para reportar una estafa, puedes usar nuestro formulario en la sección "Reportar Estafa". ¿Necesitas ayuda con el proceso?',
      'estafa': 'Las estafas telefónicas son un delito. Puedes reportar números sospechosos en nuestra plataforma para proteger a otros ciudadanos.',
      'extorsión': 'Si estás siendo víctima de extorsión, contacta inmediatamente a la Policía Nacional al 123 o al GAULA.',
      'phishing': 'El phishing es cuando te contactan para obtener información personal. Nunca compartas contraseñas o datos bancarios por teléfono.',
      'ayuda': 'Puedo ayudarte a: 1) Reportar una estafa 2) Informarte sobre tipos de estafas 3) Orientarte sobre qué hacer si fuiste víctima'
    };

    const lowerMessage = message.toLowerCase();
    let response = 'Entiendo que necesitas ayuda con estafas telefónicas. Puedo orientarte sobre cómo reportar o informarte sobre prevención. ¿En qué specifically necesitas ayuda?';

    // Buscar respuesta predefinida
    for (const [key, value] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        response = value;
        break;
      }
    }

    res.json({
      success: true,
      data: {
        message: response,
        sessionId: sessionId || 'default-session',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Error en chatbot:', error);
    res.status(500).json({
      success: false,
      message: 'Error procesando mensaje del chatbot',
      error: error.message
    });
  }
});

// @route   GET /api/chatbot/intents
// @desc    Obtener intenciones disponibles del chatbot
// @access  Public
router.get('/intents', (req, res) => {
  res.json({
    success: true,
    data: {
      intents: [
        'reportar_estafa',
        'consultar_numero',
        'informacion_estafas',
        'ayuda_emergencia',
        'prevencion'
      ],
      description: 'Intenciones soportadas por el chatbot de ScamsCall'
    }
  });
});

module.exports = router;