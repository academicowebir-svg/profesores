let estudiantesData = [];
let estudiantesFiltrados = [];
let currentEditId = null;

document.addEventListener('DOMContentLoaded', function() {
    cargarEstudiantes();
    document.getElementById('estudianteForm').addEventListener('submit', guardarEstudiante);
});

async function cargarEstudiantes() {
    try {
        const response = await fetch('/api/estudiantes');
        estudiantesData = await response.json();
        estudiantesFiltrados = estudiantesData;
        renderEstudiantes();
    } catch (err) {
        console.error('Error:', err);
        showNotification('Error al cargar estudiantes', 'danger');
    }
}

function renderEstudiantes() {
    const tbody = document.getElementById('tablaEstudiantes');
    tbody.innerHTML = '';
    
    if (estudiantesFiltrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="12" class="text-center text-muted">No se encontraron estudiantes</td></tr>';
        return;
    }

    estudiantesFiltrados.forEach((est, index) => {
        const sexoBadge = est.sexo === 'M' 
            ? '<span class="badge bg-primary">M</span>' 
            : '<span class="badge bg-danger">F</span>';
        
        const tieneDiscapacidad = est.discapacidad === 'SI';
        const estaActivo = est.activo === 1;
        const estadoBadge = estaActivo 
            ? '<span class="badge bg-success">Activo</span>' 
            : '<span class="badge bg-secondary">Inactivo</span>';
        const rowStyle = !estaActivo ? 'opacity:0.5' : '';
        
        const row = `
            <tr style="${rowStyle}">
                <td>${index + 1}</td>
                <td>${est.cedula}</td>
                <td style="${tieneDiscapacidad ? 'color:#6f42c1;font-weight:600' : ''}">${est.nombres_apellidos}</td>
                <td>${est.correo_electronico || 'N/A'}</td>
                <td>${est.representante || 'N/A'}</td>
                <td>${est.telefono_representante || 'N/A'}</td>
                <td>${sexoBadge}</td>
                <td>${est.especialidad || 'N/A'}</td>
                <td>${est.curso || 'N/A'}</td>
                <td>${est.paralelo || 'N/A'}</td>
                <td>${est.discapacidad || 'NO'}</td>
                <td class="text-center">${estadoBadge}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-warning me-1" onclick="editarEstudiante(${est.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm ${estaActivo ? 'btn-secondary' : 'btn-success'} me-1" onclick="toggleActivo(${est.id}, ${estaActivo ? 0 : 1})" title="${estaActivo ? 'Inactivar' : 'Activar'}">
                        <i class="fas fa-${estaActivo ? 'ban' : 'check-circle'}"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarEstudiante(${est.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function buscarEstudiantes() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    if (!search) {
        estudiantesFiltrados = estudiantesData;
    } else {
        estudiantesFiltrados = estudiantesData.filter(est => 
            est.cedula.toLowerCase().includes(search) ||
            est.nombres_apellidos.toLowerCase().includes(search)
        );
    }
    renderEstudiantes();
}

function abrirModalNuevo() {
    document.getElementById('modalTitle').textContent = 'Nuevo Estudiante';
    document.getElementById('estudianteForm').reset();
    document.getElementById('estudianteId').value = '';
    currentEditId = null;
}

async function editarEstudiante(id) {
    try {
        const response = await fetch(`/api/estudiantes/${id}`);
        const estudiante = await response.json();
        
        document.getElementById('modalTitle').textContent = 'Editar Estudiante';
        document.getElementById('estudianteId').value = estudiante.id;
        document.getElementById('cedula').value = estudiante.cedula;
        document.getElementById('nombres_apellidos').value = estudiante.nombres_apellidos;
        document.getElementById('correo_electronico').value = estudiante.correo_electronico || '';
        document.getElementById('representante').value = estudiante.representante || '';
        document.getElementById('telefono_representante').value = estudiante.telefono_representante || '';
        document.getElementById('especialidad').value = estudiante.especialidad || '';
        document.getElementById('curso').value = estudiante.curso || '';
        document.getElementById('paralelo').value = estudiante.paralelo || '';
        document.getElementById('discapacidad').value = estudiante.discapacidad || 'NO';
        currentEditId = id;
        
        const modal = new bootstrap.Modal(document.getElementById('estudianteModal'));
        modal.show();
    } catch (err) {
        console.error('Error:', err);
        showNotification('Error al obtener estudiante', 'danger');
    }
}

function eliminarEstudiante(id) {
    if (!confirm('¿Está seguro de eliminar este estudiante?')) return;
    
    fetch(`/api/estudiantes/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        showNotification('Estudiante eliminado exitosamente', 'success');
        cargarEstudiantes();
    })
    .catch(err => {
        console.error('Error:', err);
        showNotification('Error al eliminar estudiante', 'danger');
    });
}

function toggleActivo(id, nuevoEstado) {
    const accion = nuevoEstado === 0 ? 'inactivar' : 'activar';
    if (!confirm(`¿Desea ${accion} este estudiante?`)) return;
    
    fetch(`/api/estudiantes/${id}/activo`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: nuevoEstado })
    })
    .then(response => response.json())
    .then(data => {
        showNotification(`Estudiante ${accion}do exitosamente`, 'success');
        cargarEstudiantes();
    })
    .catch(err => {
        console.error('Error:', err);
        showNotification(`Error al ${accion} estudiante`, 'danger');
    });
}

function eliminarTodosEstudiantes() {
    if (!confirm('¿ELIMINAR TODOS LOS ESTUDIANTES? Esta accion no se puede deshacer.')) return;
    if (!confirm('Seguro que desea eliminar todos los estudiantes del sistema?')) return;

    fetch('/api/estudiantes/eliminar-todos', { method: 'DELETE' })
    .then(res => res.json())
    .then(data => {
        showNotification(data.message || 'Todos los estudiantes eliminados', 'success');
        cargarEstudiantes();
    })
    .catch(err => {
        console.error('Error:', err);
        showNotification('Error al eliminar estudiantes', 'danger');
    });
}

async function guardarEstudiante(e) {
    e.preventDefault();
    
    const estudiante = {
        cedula: document.getElementById('cedula').value,
        nombres_apellidos: document.getElementById('nombres_apellidos').value,
        telefono_representante: document.getElementById('telefono_representante').value,
        sexo: document.getElementById('sexo').value,
        correo_electronico: document.getElementById('correo_electronico').value,
        representante: document.getElementById('representante').value,
        especialidad: document.getElementById('especialidad').value,
        curso: document.getElementById('curso').value,
        paralelo: document.getElementById('paralelo').value,
        discapacidad: document.getElementById('discapacidad').value
    };

    try {
        let url = '/api/estudiantes';
        let method = 'POST';
        
        if (currentEditId) {
            url = `/api/estudiantes/${currentEditId}`;
            method = 'PUT';
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(estudiante)
        });

        const data = await response.json();
        
        if (response.ok) {
            showNotification(data.message, 'success');
            const modal = bootstrap.Modal.getInstance(document.getElementById('estudianteModal'));
            modal.hide();
            cargarEstudiantes();
        } else {
            showNotification(data.error || 'Error al guardar', 'danger');
        }
    } catch (err) {
        console.error('Error:', err);
        showNotification('Error de conexión', 'danger');
    }
}

function importarExcel(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, { defval: '' });

            if (jsonData.length === 0) {
                showNotification('El archivo esta vacio', 'warning');
                return;
            }

            // Mapear columnas del Excel a campos del estudiante
            const estudiantes = jsonData.map(row => {
                const keys = Object.keys(row);
                return {
                    cedula: row[keys.find(k => k.toLowerCase().includes('cedula'))] || '',
                    nombres_apellidos: row[keys.find(k => k.toLowerCase().includes('nombre'))] || '',
                    sexo: (row[keys.find(k => k.toLowerCase().includes('sexo'))] || '').toString().toUpperCase().charAt(0) === 'F' ? 'F' : 'M',
                    correo_electronico: row[keys.find(k => k.toLowerCase().includes('correo') || k.toLowerCase().includes('email'))] || '',
                    representante: row[keys.find(k => k.toLowerCase().includes('representante'))] || '',
                    telefono_representante: row[keys.find(k => k.toLowerCase().includes('telefono') || k.toLowerCase().includes('tel'))] || '',
                    especialidad: row[keys.find(k => k.toLowerCase().includes('especialidad'))] || '',
                    curso: row[keys.find(k => k.toLowerCase().includes('curso'))] || '',
                    paralelo: row[keys.find(k => k.toLowerCase().includes('paralelo'))] || '',
                    discapacidad: (row[keys.find(k => k.toLowerCase().includes('discapacidad'))] || 'NO').toString().toUpperCase()
                };
            });

            const validos = estudiantes.filter(e => e.cedula && e.nombres_apellidos);
            if (validos.length === 0) {
                showNotification('No se encontraron estudiantes validos (requiere cedula y nombre)', 'warning');
                return;
            }

            if (!confirm(`Se importaran ${validos.length} estudiantes. Continuar?`)) return;

            fetch('/api/estudiantes/importar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estudiantes: validos })
            })
            .then(res => res.json())
            .then(data => {
                showNotification(data.message || `${validos.length} estudiantes importados`, 'success');
                cargarEstudiantes();
            })
            .catch(err => {
                console.error('Error:', err);
                showNotification('Error al importar', 'danger');
            });
        } catch (err) {
            console.error('Error leyendo Excel:', err);
            showNotification('Error al leer el archivo Excel', 'danger');
        }
    };
    reader.readAsArrayBuffer(file);
    event.target.value = '';
}