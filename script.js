document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('reportForm');
    const successMessage = document.getElementById('successMessage');
    const description = document.getElementById('description');
    const charCount = document.getElementById('charCount');

    // Contador de caracteres
    description.addEventListener('input', function() {
        charCount.textContent = this.value.length;
    });

    // Validación del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Limpiar errores previos
        clearErrors();
        
        // Validar campos
        let isValid = true;
        
        // Validar número telefónico
        const phone = document.getElementById('phone');
        if (!phone.value.trim()) {
            showError('phoneError', 'El número telefónico es requerido');
            isValid = false;
        } else if (!isValidColombianPhone(phone.value)) {
            showError('phoneError', 'Ingresa un número colombiano válido (ej: 3001234567)');
            isValid = false;
        }
        
        // Validar tipo de estafa
        const scamType = document.getElementById('scamType');
        if (!scamType.value) {
            showError('scamTypeError', 'Selecciona el tipo de estafa');
            isValid = false;
        }
        
        if (isValid) {
            // Simular envío del formulario
            submitForm();
        }
    });

    function isValidColombianPhone(phone) {
        const cleanPhone = phone.replace(/\s+/g, '');
        return /^(\+57|0057|57)?[1-9][0-9]{8}$/.test(cleanPhone);
    }

    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    function clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.style.display = 'none';
        });
    }

    function submitForm() {
        const formData = {
            phone: document.getElementById('phone').value,
            scamType: document.getElementById('scamType').value,
            description: document.getElementById('description').value,
            location: document.getElementById('location').value,
            anonymous: document.getElementById('anonymous').checked
        };

        // Aquí iría la llamada a tu API
        console.log('Datos del reporte:', formData);
        
        // Mostrar mensaje de éxito
        form.style.display = 'none';
        successMessage.classList.remove('hidden');
        
        // Opcional: Resetear formulario después de 5 segundos
        setTimeout(() => {
            form.reset();
            form.style.display = 'block';
            successMessage.classList.add('hidden');
            charCount.textContent = '0';
        }, 5000);
    }
});
