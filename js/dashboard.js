// dashboard.js - Funcionalidades de los dashboards

const dashboard = {
    // Actualizar dashboard del ciudadano
    updateCitizenDashboard: function() {
        if (!app.currentUser) return;

        const reports = utils.getFromStorage('scamReports') || [];
        const userReports = reports.filter(report => report.citizenEmail === app.currentUser.email);
        const pendingReports = userReports.filter(report => report.status === 'pending');
        const resolvedReports = userReports.filter(report => report.status === 'resolved');

        // Actualizar estadísticas
        document.getElementById('totalReports').textContent = userReports.length;
        document.getElementById('pendingReports').textContent = pendingReports.length;
        document.getElementById('resolvedReports').textContent = resolvedReports.length;

        // Actualizar lista de reportes
        this.updateCitizenReportsList(userReports);
    },

    // Actualizar lista de reportes del ciudadano
    updateCitizenReportsList: function(userReports) {
        const reportsList = document.getElementById('citizenReportsList');
        if (!reportsList) return;

        if (userReports.length === 0) {
            reportsList.innerHTML = `
                <div class="card">
                    <p style="text-align: center; color: var(--text-light);">
                        Aún no has realizado reportes.<br>
                        <button class="btn" onclick="app.showView('reportView')" style="margin-top: 1rem;">
                            <i class="fas fa-plus"></i> Haz tu primer reporte
                        </button>
                    </p>
                </div>
            `;
            return;
        }

        reportsList.innerHTML = userReports.slice(0, 5).map(report => `
            <div class="report-item">
                <div class="report-header">
                    <div>
                        <h4>Reporte #${report.id.slice(-6)}</h4>
                        <p>Número: ${report.phone}</p>
                    </div>
                    <span class="report-status status-${report.status}">
                        ${this.getStatusText(report.status)}
                    </span>
                </div>
                <p><strong>Tipo:</strong> ${this.getScamTypeText(report.scamType)}</p>
                <p>${report.description.substring(0, 100)}${report.description.length > 100 ? '...' : ''}</p>
                <p style="color: var(--text-light); font-size: 0.9rem; margin-top: 0.5rem;">
                    Reportado el ${utils.formatDate(report.createdAt)}
                </p>
            </div>
        `).join('');
    },

    // Actualizar dashboard del agente
    updateAgentDashboard: function() {
        const reports = utils.getFromStorage('scamReports') || [];
        const today = new Date().toDateString();
        const newReports = reports.filter(report => new Date(report.createdAt).toDateString() === today);
        const urgentReports = reports.filter(report => report.scamType === 'threat' && report.status === 'pending');
        const resolvedReports = reports.filter(report => report.status === 'resolved');

        // Actualizar estadísticas
        document.getElementById('agentTotalReports').textContent = reports.length;
        document.getElementById('agentNewReports').textContent = newReports.length;
        document.getElementById('agentUrgentReports').textContent = urgentReports.length;
        document.getElementById('agentResolved').textContent = resolvedReports.length;

        // Actualizar lista de reportes
        this.updateAgentReportsList(reports);
    },

    // Actualizar lista de reportes del agente
    updateAgentReportsList: function(reports) {
        const reportsList = document.getElementById('agentReportsList');
        if (!reportsList) return;

        if (reports.length === 0) {
            reportsList.innerHTML = `
                <div class="card">
                    <p style="text-align: center; color: var(--text-light);">
                        No hay reportes pendientes.
                    </p>
                </div>
            `;
            return;
        }

        reportsList.innerHTML = reports.slice(0, 10).map(report => `
            <div class="report-item">
                <div class="report-header">
                    <div>
                        <h4>Reporte #${report.id.slice(-6)}</h4>
                        <p>Número: ${report.phone} | ${report.anonymous ? 'Anónimo' : report.citizen}</p>
                    </div>
                    <span class="report-status status-${report.status}">
                        ${this.getStatusText(report.status)}
                    </span>
                </div>
                <p><strong>Tipo:</strong> ${this.getScamTypeText(report.scamType)}</p>
                <p>${report.description.substring(0, 150)}${report.description.length > 150 ? '...' : ''}</p>
                <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                    <button class="btn" style="padding: 0.5rem 1rem; font-size: 0.9rem;" onclick="dashboard.viewReportDetails('${report.id}')">
                        <i class="fas fa-eye"></i> Ver Detalles
                    </button>
                    <button class="btn-outline" style="padding: 0.5rem 1rem; font-size: 0.9rem;" onclick="dashboard.assignToMe('${report.id}')">
                        <i class="fas fa-edit"></i> Asignar
                    </button>
                </div>
            </div>
        `).join('');
    },

    // Ver detalles de un reporte
    viewReportDetails: function(reportId) {
        const reports = utils.getFromStorage('scamReports') || [];
        const report = reports.find(r => r.id === reportId);
        
        if (report) {
            // En una aplicación real, podrías mostrar un modal con más detalles
            alert(`Detalles del Reporte #${report.id.slice(-6)}\n\nNúmero: ${report.phone}\nTipo: ${this.getScamTypeText(report.scamType)}\nDescripción: ${report.description}\nFecha: ${utils.formatDate(report.createdAt)}`);
        }
    },

    // Asignar reporte a sí mismo
    assignToMe: function(reportId) {
        const reports = utils.getFromStorage('scamReports') || [];
        const reportIndex = reports.findIndex(r => r.id === reportId);
        
        if (reportIndex !== -1) {
            reports[reportIndex].status = 'investigating';
            reports[reportIndex].assignedTo = app.currentUser.name;
            utils.saveToStorage('scamReports', reports);
            this.updateAgentDashboard();
            utils.showNotification('Reporte asignado correctamente.', 'success');
            app.announceToScreenReader('Reporte asignado para investigación.');
        }
    },

    // Obtener texto del tipo de estafa
    getScamTypeText: function(type) {
        const types = {
            'financial': 'Estafa financiera',
            'threat': 'Amenazas o extorsión',
            'identity': 'Suplantación de identidad',
            'service': 'Fraude de servicios',
            'prize': 'Estafa de premios',
            'tech': 'Soporte técnico falso',
            'romance': 'Estafa romántica',
            'other': 'Otro tipo'
        };
        return types[type] || 'Desconocido';
    },

    // Obtener texto del estado
    getStatusText: function(status) {
        const statuses = {
            'pending': 'Pendiente',
            'investigating': 'En Investigación',
            'resolved': 'Resuelto'
        };
        return statuses[status] || 'Desconocido';
    }
};
