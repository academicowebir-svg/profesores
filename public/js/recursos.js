let recursosData = [];
let materiasRecursos = [];

async function cargarMateriasRecursos() {
    try {
        const response = await fetch('/api/recursos/materias');
        materiasRecursos = await response.json();
        const selectFiltro = document.getElementById('filtroMateriaRecurso');
        const selectMateria = document.getElementById('recursoMateria');
        selectFiltro.innerHTML = '<option value="">Todas</option>';
        selectMateria.innerHTML = '<option value="">Sin materia</option>';
        materiasRecursos.forEach(m => {
            const opt1 = `<option value="${m.id}">${m.nombre_materia} - ${m.curso} (${m.paralelo})</option>`;
            selectFiltro.innerHTML += opt1;
            selectMateria.innerHTML += opt1;
        });
    } catch (err) {
        console.error('Error:', err);
    }
}

async function cargarRecursos() {
    const categoria = document.getElementById('filtroCategoria').value;
    const materiaId = document.getElementById('filtroMateriaRecurso').value;
    let url = '/api/recursos/list?';
    if (categoria) url += `categoria=${categoria}&`;
    if (materiaId) url += `materia_id=${materiaId}&`;

    try {
        const response = await fetch(url);
        recursosData = await response.json();
        renderizarRecursos();
    } catch (err) {
        console.error('Error:', err);
        showNotification('Error al cargar recursos', 'danger');
    }
}

function renderizarRecursos() {
    const container = document.getElementById('contenedorRecursos');
    if (recursosData.length === 0) {
        container.innerHTML = '<div class="col-12 text-center text-muted py-5"><i class="fas fa-book-open fa-3x mb-3"></i><p>No hay recursos registrados</p></div>';
        return;
    }

    const iconos = { documento: 'fa-file-alt', enlace: 'fa-link', video: 'fa-video', imagen: 'fa-image', otro: 'fa-ellipsis-h' };
    const colores = { documento: 'primary', enlace: 'success', video: 'danger', imagen: 'warning', otro: 'secondary' };

    container.innerHTML = recursosData.map(r => {
        const esArchivo = r.enlace && r.enlace.startsWith('/uploads/');
        return `
        <div class="col-md-4 col-sm-6 mb-3">
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <div class="d-flex align-items-center mb-2">
                        <i class="fas ${iconos[r.categoria] || 'fa-file'} fa-2x text-${colores[r.categoria] || 'secondary'} me-2"></i>
                        <h6 class="card-title mb-0">${r.titulo}</h6>
                    </div>
                    <p class="card-text text-muted small">${r.descripcion || 'Sin descripción'}</p>
                    ${r.nombre_materia ? `<span class="badge bg-light text-dark">${r.nombre_materia}</span>` : ''}
                    <span class="badge bg-${colores[r.categoria] || 'secondary'}">${r.categoria}</span>
                    ${esArchivo ? '<span class="badge bg-success ms-1"><i class="fas fa-paperclip"></i> Archivo</span>' : ''}
                </div>
                <div class="card-footer bg-transparent d-flex justify-content-between">
                    ${r.enlace ? `
                        <a href="${r.enlace}" ${esArchivo ? 'download' : 'target="_blank"'} class="btn btn-sm btn-outline-success"><i class="fas ${esArchivo ? 'fa-download' : 'fa-external-link-alt'} me-1"></i>${esArchivo ? 'Descargar' : 'Abrir'}</a>
                        ${esArchivo ? `<a href="/api/recursos/archivo/${r.enlace.split('/').pop()}" target="_blank" class="btn btn-sm btn-outline-primary ms-1"><i class="fas fa-eye me-1"></i>Ver</a>` : ''}
                    ` : '<span></span>'}
                    <div>
                        <button class="btn btn-sm btn-outline-primary" onclick="editarRecurso(${r.id})"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-outline-danger" onclick="eliminarRecurso(${r.id})"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            </div>
        </div>
    `}).join('');
}

function abrirModalRecurso(id) {
    document.getElementById('recursoId').value = '';
    document.getElementById('recursoTitulo').value = '';
    document.getElementById('recursoDescripcion').value = '';
    document.getElementById('recursoEnlace').value = '';
    document.getElementById('recursoArchivo').value = '';
    document.getElementById('recursoCategoria').value = 'documento';
    document.getElementById('recursoMateria').value = '';
    document.getElementById('modalRecursoTitulo').textContent = 'Nuevo Recurso';
    new bootstrap.Modal(document.getElementById('modalRecurso')).show();
}

function editarRecurso(id) {
    const r = recursosData.find(x => x.id === id);
    if (!r) return;
    document.getElementById('recursoId').value = r.id;
    document.getElementById('recursoTitulo').value = r.titulo;
    document.getElementById('recursoDescripcion').value = r.descripcion || '';
    document.getElementById('recursoEnlace').value = r.enlace || '';
    document.getElementById('recursoArchivo').value = '';
    document.getElementById('recursoCategoria').value = r.categoria;
    document.getElementById('recursoMateria').value = r.materia_id || '';
    document.getElementById('modalRecursoTitulo').textContent = 'Editar Recurso';
    new bootstrap.Modal(document.getElementById('modalRecurso')).show();
}

async function guardarRecurso() {
    const id = document.getElementById('recursoId').value;
    const titulo = document.getElementById('recursoTitulo').value.trim();
    if (!titulo) {
        showNotification('Ingrese un título', 'warning');
        return;
    }

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', document.getElementById('recursoDescripcion').value.trim());
    formData.append('enlace', document.getElementById('recursoEnlace').value.trim());
    formData.append('categoria', document.getElementById('recursoCategoria').value);
    formData.append('materia_id', document.getElementById('recursoMateria').value || '');

    const archivo = document.getElementById('recursoArchivo').files[0];
    if (archivo) {
        formData.append('archivo', archivo);
    }

    try {
        const url = id ? `/api/recursos/${id}` : '/api/recursos/';
        const method = id ? 'PUT' : 'POST';
        const response = await fetch(url, {
            method,
            body: formData
        });
        const result = await response.json();
        if (response.ok) {
            showNotification(result.message, 'success');
            bootstrap.Modal.getInstance(document.getElementById('modalRecurso')).hide();
            await cargarRecursos();
        } else {
            showNotification(result.error || 'Error', 'danger');
        }
    } catch (err) {
        console.error('Error:', err);
        showNotification('Error de conexión', 'danger');
    }
}

async function eliminarRecurso(id) {
    if (!confirm('¿Eliminar este recurso?')) return;
    try {
        const response = await fetch(`/api/recursos/${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (response.ok) {
            showNotification(result.message, 'success');
            await cargarRecursos();
        }
    } catch (err) {
        console.error('Error:', err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    cargarMateriasRecursos();
    cargarRecursos();
});
