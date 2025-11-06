// utils.js - Funciones utilitarias reutilizables

const utils = {
    // Formatear números telefónicos colombianos
    formatPhoneNumber: function(phone) {
        if (!phone) return '';
        
        const cleanPhone = phone.replace(/\D/g, '');
        
        if (cleanPhone.startsWith('57') && cleanPhone.length === 12) {
            return `+${cleanPhone}`;
        } else if (cleanPhone.length === 10) {
            return `+57${cleanPhone}`;
        } else if (cleanPhone.length === 12 && !cleanPhone.startsWith('57')) {
            return `+57${cleanPhone.slice(2)}`;
        }
        
        return phone;
    },

    // Validar número telefónico colombiano
    isValidColombianPhone: function(phone) {
        if (!phone) return false;
        
        // Aceptar "Desconocido", "Privado", etc.
        if (typeof phone === 'string' && 
            (phone.toLowerCase().includes('desconocido') || 
             phone.toLowerCase().includes('privado') ||
             phone.toLowerCase().includes('oculto'))) {
            return true;
        }
        
        const cleanPhone = phone.replace(/\D/g, '');
        
        // Validar formatos comunes en Colombia
        return /^(57)?[1-9][0-9]{8}$/.test(cleanPhone) || 
               /^[1-9][0-9]{9}$/.test(cleanPhone);
    },

    // Mostrar notificaciones accesibles
    showNotification: function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `visual-alert ${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'assertive');
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            ${message}
        `;
        
        // Posicionar la notificación
        notification.style.position = 'fixed';
        notification.style.top = '100px';
        notification.style.right = '20px';
        notification.style.zIndex = '1000';
        notification.style.maxWidth = '400px';
        
        document.body.appendChild(notification);
        
        // Remover después de 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    },

    getNotificationIcon: function(type) {
        const icons = {
            'info': 'info-circle',
            'success': 'check-circle',
            'warning': 'exclamation-triangle',
            'error': 'times-circle'
        };
        return icons[type] || 'info-circle';
    },

    // Cargar componentes HTML
    loadComponent: async function(componentId, filePath) {
        try {
            const response = await fetch(filePath);
            const html = await response.text();
            document.getElementById(componentId).innerHTML = html;
        } catch (error) {
            console.error('Error cargando componente:', error);
        }
    },

    // Guardar en localStorage con manejo de errores
    saveToStorage: function(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error guardando en localStorage:', error);
            return false;
        }
    },

    // Leer de localStorage con manejo de errores
    getFromStorage: function(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error leyendo de localStorage:', error);
            return null;
        }
    },

    // Generar ID único
    generateId: function() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Formatear fecha
    formatDate: function(dateString) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('es-CO', options);
    }
};
