import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mensaje de bienvenida inicial
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 1,
          text: '¡Hola! Soy tu asistente virtual de ScamsCall. Puedo ayudarte a reportar estafas telefónicas, informarte sobre tipos de estafas y orientarte sobre qué hacer si fuiste víctima. ¿En qué puedo ayudarte?',
          isBot: true,
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, messages.length]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simular respuesta del chatbot (en demo)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const responses = {
        'hola': '¡Hola! Soy tu asistente virtual para reportar estafas telefónicas. ¿En qué puedo ayudarte?',
        'reportar': 'Para reportar una estafa, puedes usar nuestro formulario en la sección "Reportar Estafa". ¿Necesitas ayuda con el proceso?',
        'estafa': 'Las estafas telefónicas son un delito. Puedes reportar números sospechosos en nuestra plataforma para proteger a otros ciudadanos.',
        'extorsión': 'Si estás siendo víctima de extorsión, contacta inmediatamente a la Policía Nacional al 123 o al GAULA.',
        'phishing': 'El phishing es cuando te contactan para obtener información personal. Nunca compartas contraseñas o datos bancarios por teléfono.',
        'ayuda': 'Puedo ayudarte a: 1) Reportar una estafa 2) Informarte sobre tipos de estafas 3) Orientarte sobre qué hacer si fuiste víctima',
        'gracias': '¡De nada! Estoy aquí para ayudarte. ¿Hay algo más en lo que pueda asistirte?'
      };

      const lowerMessage = inputMessage.toLowerCase();
      let response = 'Entiendo que necesitas ayuda con estafas telefónicas. Puedo orientarte sobre cómo reportar o informarte sobre prevención. ¿En qué específicamente necesitas ayuda?';

      // Buscar respuesta predefinida
      for (const [key, value] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
          response = value;
          break;
        }
      }

      const botMessage = {
        id: messages.length + 2,
        text: response,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error al enviar mensaje al chatbot:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Botón flotante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
          style={{ width: '60px', height: '60px' }}
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Ventana del chatbot */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl flex flex-col"
             style={{ width: '350px', height: '500px' }}>
          
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <span className="font-semibold">Asistente Virtual</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.isBot
                        ? 'bg-white border border-gray-200 text-gray-800'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      {message.isBot ? (
                        <Bot className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString('es-CO', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4" />
                      <span className="text-xs opacity-70">Escribiendo...</span>
                    </div>
                    <div className="flex space-x-1 mt-1">
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                style={{ width: '40px', height: '40px' }}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;