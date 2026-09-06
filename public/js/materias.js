let materiasData = [];
let materiasFiltradas = [];
let currentEditId = null;

document.addEventListener('DOMContentLoaded', function() {
    cargarMaterias();
    document.getElementById('materiaForm').addEventListener('submit', guardarMateria);
});

async function cargarMaterias() {
    try {
        const response = await fetch('/api/materias');
        materiasData = await response.json();
        materiasFiltradas = materiasData;
        renderMaterias();
    } catch (err) {
        console.error('Error:', err);
        showNotification('Error al cargar materias', 'danger');
    }
}

function renderMaterias() {
    const tbody = document.getElementById('tablaMaterias');
    tbody.innerHTML = '';
    
    if (materiasFiltradas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">No se encontraron materias</td></tr>';
        return;
    }

    materiasFiltradas.forEach((mat, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${mat.nombre_materia}</td>
                <td>${mat.curso}</td>
                <td>${mat.paralelo}</td>
                <td>${mat.especialidad || 'N/A'}</td>
                <td>${mat.horas_semana || 0}</td>
                <td>${mat.profesor || 'N/A'}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-warning me-1" onclick="editarMateria(${mat.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarMateria(${mat.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function buscarMaterias() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    if (!search) {
        materiasFiltradas = materiasData;
    } else {
        materiasFiltradas = materiasData.filter(mat => 
            mat.nombre_materia.toLowerCase().includes(search)
        );
    }
    renderMaterias();
}

function abrirModalNuevo() {
    document.getElementById('modalTitle').textContent = 'Nueva Materia';
    document.getElementById('materiaForm').reset();
    document.getElementById('materiaId').value = '';
    currentEditId = null;
}

async function editarMateria(id) {
    try {
        const response = await fetch(`/api/materias/${id}`);
        const materia = await response.json();
        
        document.getElementById('modalTitle').textContent = 'Editar Materia';
        document.getElementById('materiaId').value = materia.id;
        document.getElementById('nombre_materia').value = materia.nombre_materia;
        document.getElementById('curso').value = materia.curso;
        document.getElementById('paralelo').value = materia.paralelo;
        document.getElementById('especialidad').value = materia.especialidad || '';
        document.getElementById('horas_semana').value = materia.horas_semana || 0;
        document.getElementById('profesor').value = materia.profesor || '';
        currentEditId = id;
        
        const modal = new bootstrap.Modal(document.getElementById('materiaModal'));
        modal.show();
    } catch (err) {
        console.error('Error:', err);
        showNotification('Error al obtener materia', 'danger');
    }
}

function eliminarMateria(id) {
    if (!confirm('¿Está seguro de eliminar esta materia?')) return;
    
    fetch(`/api/materias/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        showNotification('Materia eliminada exitosamente', 'success');
        cargarMaterias();
    })
    .catch(err => {
        console.error('Error:', err);
        showNotification('Error al eliminar materia', 'danger');
    });
}

async function guardarMateria(e) {
    e.preventDefault();
    
    const materia = {
        nombre_materia: document.getElementById('nombre_materia').value,
        curso: document.getElementById('curso').value,
        paralelo: document.getElementById('paralelo').value,
        especialidad: document.getElementById('especialidad').value,
        horas_semana: document.getElementById('horas_semana').value,
        profesor: document.getElementById('profesor').value
    };

    try {
        let url = '/api/materias';
        let method = 'POST';
        
        if (currentEditId) {
            url = `/api/materias/${currentEditId}`;
            method = 'PUT';
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(materia)
        });

        const data = await response.json();
        
        if (response.ok) {
            showNotification(data.message, 'success');
            const modal = bootstrap.Modal.getInstance(document.getElementById('materiaModal'));
            modal.hide();
            cargarMaterias();
        } else {
            showNotification(data.error || 'Error al guardar', 'danger');
        }
    } catch (err) {
        console.error('Error:', err);
        showNotification('Error de conexión', 'danger');
    }
}