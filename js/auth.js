// auth.js - Manejo de autenticación de usuarios

const auth = {
    // Inicializar event listeners de formularios de autenticación
    init: function() {
        this.setupCitizenLogin();
        this.setupCitizenRegister();
        this.setupAgentLogin();
    },

    // Configurar login de ciudadano
    setupCitizenLogin: function() {
        const form = document.getElementById('citizenLoginForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCitizenLogin();
            });
        }
    },

    // Configurar registro de ciudadano
    setupCitizenRegister: function() {
        const form = document.getElementById('citizenRegisterForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCitizenRegister();
            });
        }
    },

    // Configurar login de agente
    setupAgentLogin: function() {
        const form = document.getElementById('agentLoginForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAgentLogin();
            });
        }
    },

    // Manejar login de ciudadano
    handleCitizenLogin: function() {
        const email = document.getElementById('citizenEmail').value;
        const password = document.getElementById('citizenPassword').value;

        // Simulación de autenticación - en una app real, esto sería una llamada a una API
        const users = utils.getFromStorage('scamUsers') || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            app.currentUser = user;
            utils.saveToStorage('currentUser', user);
            app.updateNavigation();
            app.showView('citizenDashboardView');
            utils.showNotification('¡Bienvenido de nuevo!', 'success');
            app.announceToScreenReader(`Bienvenido ${user.name}. Has ingresado al panel de control ciudadano.`);
        } else {
            // Crear usuario demo si no existe (para propósitos de demostración)
            const newUser = {
                id: utils.generateId(),
                name: 'Usuario Demo',
                email: email,
                password: password, // En una app real, esto debería estar encriptado
                role: 'citizen',
                createdAt: new Date().toISOString()
            };
            users.push(newUser);
            utils.saveToStorage('scamUsers', users);
            
            app.currentUser = newUser;
            utils.saveToStorage('currentUser', newUser);
            app.updateNavigation();
            app.showView('citizenDashboardView');
            utils.showNotification('¡Cuenta creada y sesión iniciada!', 'success');
            app.announceToScreenReader('Cuenta de demostración creada. Has ingresado al panel de control ciudadano.');
        }
    },

    // Manejar registro de ciudadano
    handleCitizenRegister: function() {
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;

        // Validar que las contraseñas coincidan (si hubiera confirmación)
        // En este caso, no tenemos confirmación, pero podríamos agregarla

        const users = utils.getFromStorage('scamUsers') || [];
        
        // Verificar si el usuario ya existe
        if (users.find(u => u.email === email)) {
            utils.showNotification('Este correo electrónico ya está registrado.', 'error');
            app.announceToScreenReader('Error: Este correo electrónico ya está registrado.');
            return;
        }

        // Crear nuevo usuario
        const newUser = {
            id: utils.generateId(),
            name: name,
            email: email,
            password: password, // En una app real, esto debería estar encriptado
            role: 'citizen',
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        utils.saveToStorage('scamUsers', users);
        
        app.currentUser = newUser;
        utils.saveToStorage('currentUser', newUser);
        app.updateNavigation();
        app.showView('citizenDashboardView');
        utils.showNotification('¡Cuenta creada exitosamente!', 'success');
        app.announceToScreenReader(`Cuenta creada para ${name}. Has ingresado al panel de control ciudadano.`);
    },

    // Manejar login de agente
    handleAgentLogin: function() {
        const institution = document.getElementById('agentInstitution').value;
        const email = document.getElementById('agentEmail').value;
        const password = document.getElementById('agentPassword').value;

        // Simulación de autenticación de agente
        // En una app real, esto verificaría con un backend y credenciales oficiales

        // Validar que el correo tenga dominio institucional (simulación)
        const institutionalDomains = ['policia.gov.co', 'fiscalia.gov.co', 'ejercito.mil.co', 'gaula.gov.co'];
        const emailDomain = email.split('@')[1];
        
        if (!institutionalDomains.includes(emailDomain)) {
            utils.showNotification('Debes usar un correo institucional válido.', 'error');
            app.announceToScreenReader('Error: Debes usar un correo institucional válido.');
            return;
        }

        // Crear usuario agente (en una app real, esto vendría de una base de datos)
        const agentUser = {
            id: utils.generateId(),
            name: 'Agente ' + institution,
            email: email,
            role: 'agent',
            institution: institution,
            createdAt: new Date().toISOString()
        };

        app.currentUser = agentUser;
        utils.saveToStorage('currentUser', agentUser);
        app.updateNavigation();
        app.showView('agentDashboardView');
        utils.showNotification('¡Acceso de agente concedido!', 'success');
        app.announceToScreenReader(`Has ingresado como agente de ${institution}. Panel de control de agente.`);
    }
};
