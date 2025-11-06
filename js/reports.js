// reports.js - Funcionalidades de reportes

const reportsManager = {
    // Inicializar event listeners de reportes
    init: function() {
        this.setupReportForm();
    },

    // Configurar formulario de reporte
    setupReportForm: function() {
        const form = document.getElementById('reportForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleReportSubmit();
            });
        }

        // Configurar validación en tiempo real para el número de teléfono
        const phoneInput = document.getElementById('reportPhone');
        if (phoneInput) {
            phoneInput.addEventListener('input', this.validatePhoneInput);
        }
    },

    // Validar entrada de teléfono
    validatePhoneInput: function(e) {
        const phone = e.target.value;
        const errorElement = document.getElementById('phoneError');

        // Si el campo está vacío, quitar error
        if (!phone.trim()) {
            errorElement.classList.remove('show');
            return;
        }

        // Si el usuario escribe "desconocido", "privado", etc., es válido
        if (phone.toLowerCase().includes('desconocido') || 
            phone.toLowerCase().includes('privado') ||
            phone.toLowerCase().includes('oculto')) {
            errorElement.classList.remove('show');
            return;
        }

        // Validar formato de teléfono
        if (utils.isValidColombianPhone(phone)) {
            errorElement.classList.remove('show');
        } else {
            errorElement.classList.add('show');
        }
    },

    // Manejar envío de reporte
    handleReportSubmit: function() {
        const phone = document.getElementById('reportPhone').value;
        const scamType = document.getElementById('scamType').value;
        const description = document.getElementById('description').value;
        const callDate = document.getElementById('callDate').value;
        const location = document.getElementById('location').value;
        const anonymous = document.getElementById('anonymous').checked;

        // Validar campos obligatorios
        if (!phone.trim() || !scamType || !description.trim()) {
            utils.showNotification('Por favor completa todos los campos obligatorios.', 'error');
            app.announceToScreenReader('Error: Por favor completa todos los campos obligatorios.');
            return;
        }

        // Validar número de teléfono (si no es "desconocido", etc.)
        if (!phone.toLowerCase().includes('desconocido') && 
            !phone.toLowerCase().includes('privado') &&
            !phone.toLowerCase().includes('oculto') &&
            !utils.isValidColombianPhone(phone)) {
            utils.showNotification('Por favor ingresa un número de teléfono válido o escribe "Desconocido".', 'error');
            app.announceToScreenReader('Error: Número de teléfono inválido.');
            return;
        }

        // Crear nuevo reporte
        const newReport = {
            id: utils.generateId(),
            phone: phone,
            scamType: scamType,
            description: description,
            callDate: callDate || new Date().toISOString(),
            location: location,
            anonymous: anonymous,
            status: 'pending',
            citizen: anonymous ? 'Anónimo' : app.currentUser.name,
            citizenEmail: anonymous ? 'anonymous@scamscall.co' : app.currentUser.email,
            createdAt: new Date().toISOString(),
            assignedTo: null
        };

        // Guardar reporte
        const existingReports = utils.getFromStorage('scamReports') || [];
        existingReports.push(newReport);
        utils.saveToStorage('scamReports', existingReports);

        // Mostrar mensaje de éxito
        utils.showNotification('Reporte enviado exitosamente. ¡Gracias por contribuir a la seguridad colectiva!', 'success');
        app.announceToScreenReader('Reporte enviado exitosamente. Gracias por contribuir a la seguridad colectiva.');

        // Resetear formulario
        document.getElementById('reportForm').reset();

        // Redirigir al dashboard después de un breve delay
        setTimeout(() => {
            app.showView('citizenDashboardView');
        }, 2000);
    }
};
