// Funciones globales para el sistema

window.salir = function() {
    if (confirm('¿Está seguro de que desea salir del sistema?')) {
        window.location.href = '/';
    }
};

window.showMenu = function() {
    window.location.href = '/';
};

// Funcion para mostrar notificaciones
window.showNotification = function(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer') || document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
    toastContainer.style.zIndex = '9999';
    document.body.appendChild(toastContainer);

    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2" data-bs-dismiss="toast"></button>
        </div>
    `;

    toastContainer.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast, { delay: 4000 });
    bsToast.show();

    setTimeout(() => {
        toast.remove();
    }, 4000);
};

// Helper: retorna nombre coloreado si tiene discapacidad
window.nombreEstudiante = function(nombre, discapacidad) {
    if (discapacidad === 'SI') {
        return `<span style="color:#6f42c1;font-weight:600">${nombre}</span>`;
    }
    return nombre;
};