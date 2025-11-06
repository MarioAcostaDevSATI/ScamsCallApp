// app.js - Lógica principal de la aplicación

const app = {
    currentUser: null,
    currentView: 'onboardingView',
    accessibility: {
        highContrast: false,
        fontSize: 'normal',
        screenReader: false
    },

    // Inicializar la aplicación
    init: function() {
        this.loadComponents();
        this.setupEventListeners();
        this.loadUserData();
        this.showView('onboardingView');
        this.announceToScreenReader('Aplicación Scams Call cargada correctamente');
    },

    // Cargar componentes
    loadComponents: function() {
        utils.loadComponent('header-container', 'components/header.html');
        utils.loadComponent('footer-container', 'components/footer.html');
    },

    // Configurar event listeners
    setupEventListeners: function() {
        // Los event listeners específicos se configuran en sus respectivos módulos
    },

    // Cargar datos del usuario
    loadUserData: function() {
        this.currentUser = utils.getFromStorage('currentUser');
        const savedAccessibility = utils.getFromStorage('accessibilitySettings');
        
        if (savedAccessibility) {
            this.accessibility = { ...this.accessibility, ...savedAccessibility };
            this.applyAccessibilitySettings();
        }
    },

    // Mostrar vista específica
    showView: function(viewId) {
        // Ocultar todas las vistas
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        
        // Mostrar la vista solicitada
        const targetView = document.getElementById(viewId);
        if (targetView) {
            targetView.classList.add('active');
            this.currentView = viewId;
            
            // Actualizar navegación
            this.updateNavigation();
            
            // Anunciar cambio de vista para lectores de pantalla
            this.announceViewChange(viewId);
            
            // Actualizar dashboards si es necesario
            if (viewId === 'citizenDashboardView') {
                dashboard.updateCitizenDashboard();
            } else if (viewId === 'agentDashboardView') {
                dashboard.updateAgentDashboard();
            }
        }
    },

    // Anunciar cambio de vista para accesibilidad
    announceViewChange: function(viewId) {
        const viewNames = {
            'onboardingView': 'Pantalla de bienvenida',
            'citizenLoginView': 'Inicio de sesión para ciudadanos',
            'agentLoginView': 'Inicio de sesión para agentes',
            'citizenDashboardView': 'Panel de control ciudadano',
            'agentDashboardView': 'Panel de control de agente',
            'reportView': 'Formulario de reporte'
        };
        
        this.announceToScreenReader(`Nueva vista: ${viewNames[viewId] || viewId}`);
    },

    // Actualizar navegación según el usuario
    updateNavigation: function() {
        const navContent = document.getElementById('nav-content');
        if (!navContent) return;

        let navHTML = '';
        
        if (this.currentUser) {
            if (this.currentUser.role === 'citizen') {
                navHTML = `
                    <span style="color: var(--text-secondary); margin-right: 1rem;">
                        Hola, ${this.currentUser.name}
                    </span>
                    <button class="btn-outline" onclick="app.showView('reportView')">
                        <i class="fas fa-plus"></i> Nuevo Reporte
                    </button>
                    <button class="btn-outline" onclick="app.logout()" style="margin-left: 0.5rem;">
                        <i class="fas fa-sign-out-alt"></i> Salir
                    </button>
                `;
            } else if (this.currentUser.role === 'agent') {
                navHTML = `
                    <span style="color: var(--text-secondary); margin-right: 1rem;">
                        Agente: ${this.currentUser.institution}
                    </span>
                    <button class="btn-outline" onclick="app.logout()">
                        <i class="fas fa-sign-out-alt"></i> Salir
                    </button>
                `;
            }
        } else {
            navHTML = `
                <button class="btn-outline" onclick="app.showView('citizenLoginView')">
                    <i class="fas fa-user"></i> Ciudadano
                </button>
                <button class="btn-outline" onclick="app.showView('agentLoginView')" style="margin-left: 0.5rem;">
                    <i class="fas fa-shield-alt"></i> Agente
                </button>
            `;
        }
        
        navContent.innerHTML = navHTML;
    },

    // Funciones de accesibilidad
    toggleHighContrast: function() {
        this.accessibility.highContrast = !this.accessibility.highContrast;
        document.body.classList.toggle('high-contrast', this.accessibility.highContrast);
        utils.saveToStorage('accessibilitySettings', this.accessibility);
        
        const message = this.accessibility.highContrast ? 
            'Modo alto contraste activado' : 'Modo alto contraste desactivado';
        utils.showNotification(message, 'info');
        this.announceToScreenReader(message);
    },

    toggleFontSize: function() {
        const sizes = ['normal', 'large', 'extra-large'];
        const currentIndex = sizes.indexOf(this.accessibility.fontSize);
        const nextIndex = (currentIndex + 1) % sizes.length;
        
        this.accessibility.fontSize = sizes[nextIndex];
        
        // Remover clases anteriores
        document.body.classList.remove('large-font', 'extra-large-font');
        
        // Aplicar nueva clase
        if (this.accessibility.fontSize !== 'normal') {
            document.body.classList.add(this.accessibility.fontSize + '-font');
        }
        
        utils.saveToStorage('accessibilitySettings', this.accessibility);
        
        const messages = {
            'normal': 'Tamaño de texto normal',
            'large': 'Tamaño de texto grande',
            'extra-large': 'Tamaño de texto extra grande'
        };
        
        utils.showNotification(`Texto: ${messages[this.accessibility.fontSize]}`, 'info');
        this.announceToScreenReader(messages[this.accessibility.fontSize]);
    },

    enableScreenReaderMode: function() {
        this.accessibility.screenReader = !this.accessibility.screenReader;
        document.body.classList.toggle('visually-impaired-friendly', this.accessibility.screenReader);
        utils.saveToStorage('accessibilitySettings', this.accessibility);
        
        const message = this.accessibility.screenReader ? 
            'Modo de accesibilidad para lectores de pantalla activado' :
            'Modo de accesibilidad para lectores de pantalla desactivado';
        
        utils.showNotification(message, 'info');
        this.announceToScreenReader(message);
    },

    applyAccessibilitySettings: function() {
        if (this.accessibility.highContrast) {
            document.body.classList.add('high-contrast');
        }
        
        if (this.accessibility.fontSize !== 'normal') {
            document.body.classList.add(this.accessibility.fontSize + '-font');
        }
        
        if (this.accessibility.screenReader) {
            document.body.classList.add('visually-impaired-friendly');
        }
    },

    // Anunciar para lectores de pantalla
    announceToScreenReader: function(message) {
        const announcer = document.getElementById('screen-reader-announce');
        if (announcer) {
            announcer.textContent = message;
            
            // Limpiar después de un tiempo para anuncios futuros
            setTimeout(() => {
                announcer.textContent = '';
            }, 1000);
        }
    },

    // Cerrar sesión
    logout: function() {
        this.currentUser = null;
        utils.saveToStorage('currentUser', null);
        this.updateNavigation();
        this.showView('onboardingView');
        utils.showNotification('Sesión cerrada correctamente', 'info');
        this.announceToScreenReader('Sesión cerrada. Volviendo a la pantalla de inicio.');
    },

    // Funciones de ayuda
    showPrivacyPolicy: function() {
        alert('Política de Privacidad: Tus datos están protegidos según la Ley 1581 de 2012 de protección de datos en Colombia.');
    },

    showTerms: function() {
        alert('Términos de Servicio: Al usar esta plataforma aceptas reportar información veraz y respetar las normas de la comunidad.');
    },

    showAccessibilityInfo: function() {
        alert('Scams Call está comprometido con la accesibilidad. Hemos implementado características para usuarios con discapacidades visuales y auditivas.');
    }
};
