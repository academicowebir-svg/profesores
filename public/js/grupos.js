let materiasDisponibles = [];
let estudiantesDisponibles = [];
let gruposAsignados = [];
let currentMateriaSeleccionada = null;

document.addEventListener('DOMContentLoaded', function() {
    cargarDatosIniciales();
    document.getElementById('asignacionForm').addEventListener('submit', guardarAsignacion);
});

async function cargarDatosIniciales() {
    try {
        const [materiasRes, estudiantesRes, gruposRes] = await Promise.all([
            fetch('/api/materias'),
            fetch('/api/estudiantes'),
            fetch('/api/grupos/list')
        ]);
        materiasDisponibles = await materiasRes.json();
        estudiantesDisponibles = await estudiantesRes.json();
        gruposAsignados = await gruposRes.json();

        // Populate materia select
        const select = document.getElementById('materiaSeleccion');
        select.innerHTML = '<option value="">Seleccionar materia...</option>';
        materiasDisponibles.forEach(m => {
            const option = document.createElement('option');
            option.value = m.id;
            option.textContent = `${m.nombre_materia} - ${m.curso} (${m.paralelo}) - ${m.especialidad || 'Sin especialidad'}`;
            select.appendChild(option);
        });

        cargarTablaAsignaciones();
    } catch (err) {
        console.error('Error:', err);
        showNotification('Error al cargar datos', 'danger');
    }
}

async function cargarEstudiantesMateria() {
    const materiaId = document.getElementById('materiaSeleccion').value;
    if (!materiaId) {
        document.getElementById('estudiantes_checkboxes').innerHTML = '';
        currentMateriaSeleccionada = null;
        return;
    }

    currentMateriaSeleccionada = materiaId;

    // Llenar filtros con valores únicos de los estudiantes
    const cursos = [...new Set(estudiantesDisponibles.map(e => e.curso).filter(Boolean))].sort();
    const paralelos = [...new Set(estudiantesDisponibles.map(e => e.paralelo).filter(Boolean))].sort();
    const especialidades = [...new Set(estudiantesDisponibles.map(e => e.especialidad).filter(Boolean))].sort();

    const fillSelect = (id, values) => {
        const select = document.getElementById(id);
        select.innerHTML = '<option value="">Todos</option>';
        values.forEach(v => {
            select.innerHTML += `<option value="${v}">${v}</option>`;
        });
    };
    fillSelect('filtroCurso', cursos);
    fillSelect('filtroParalelo', paralelos);
    fillSelect('filtroEspecialidad', especialidades);

    renderEstudiantesCheckboxes();
}

function filtrarEstudiantes() {
    renderEstudiantesCheckboxes();
}

function renderEstudiantesCheckboxes() {
    const materiaId = currentMateriaSeleccionada;
    const filtroCurso = document.getElementById('filtroCurso').value;
    const filtroParalelo = document.getElementById('filtroParalelo').value;
    const filtroEspecialidad = document.getElementById('filtroEspecialidad').value;

    const container = document.getElementById('estudiantes_checkboxes');
    container.innerHTML = '';

    // Get assigned student IDs for this materia
    fetch(`/api/grupos/por-materia/${materiaId}/estudiantes`)
    .then(res => res.json())
    .then(estudiantesAsignados => {
        const asignadosIds = estudiantesAsignados.map(e => e.estudiante_id);

        // Filter students by curso, paralelo, especialidad
        const filtrados = estudiantesDisponibles.filter(est => {
            if (filtroCurso && est.curso !== filtroCurso) return false;
            if (filtroParalelo && est.paralelo !== filtroParalelo) return false;
            if (filtroEspecialidad && est.especialidad !== filtroEspecialidad) return false;
            return true;
        });

        if (filtrados.length === 0) {
            container.innerHTML = '<div class="col-12 text-center text-muted">No se encontraron estudiantes con estos filtros</div>';
            return;
        }

        filtrados.forEach(est => {
            const isChecked = asignadosIds.includes(est.id) ? 'checked' : '';
            const div = document.createElement('div');
            div.className = 'col';
            div.innerHTML = `
                <label class="form-label d-flex align-items-center gap-2">
                    <input type="checkbox" name="estudiante_checkbox" value="${est.id}" ${isChecked}>
                    <span>${est.cedula} - ${nombreEstudiante(est.nombres_apellidos, est.discapacidad)}</span>
                </label>
            `;
            container.appendChild(div);
        });
    })
    .catch(() => {
        // Fallback: show all filtered without checked state
        const filtrados = estudiantesDisponibles.filter(est => {
            if (filtroCurso && est.curso !== filtroCurso) return false;
            if (filtroParalelo && est.paralelo !== filtroParalelo) return false;
            if (filtroEspecialidad && est.especialidad !== filtroEspecialidad) return false;
            return true;
        });
        filtrados.forEach(est => {
            const div = document.createElement('div');
            div.className = 'col';
            div.innerHTML = `
                <label class="form-label d-flex align-items-center gap-2">
                    <input type="checkbox" name="estudiante_checkbox" value="${est.id}">
                    <span>${est.cedula} - ${nombreEstudiante(est.nombres_apellidos, est.discapacidad)}</span>
                </label>
            `;
            container.appendChild(div);
        });
    });
}

async function guardarAsignacion(e) {
    e.preventDefault();

    const materiaId = document.getElementById('materiaSeleccion').value;
    if (!materiaId) {
        showNotification('Debe seleccionar una materia', 'warning');
        return;
    }

    const seleccionados = Array.from(document.querySelectorAll('input[name="estudiante_checkbox"]:checked')).map(cb => parseInt(cb.value));
    if (seleccionados.length === 0) {
        showNotification('Debe seleccionar al menos un estudiante', 'warning');
        return;
    }

    try {
        const response = await fetch('/api/grupos/asignar-materia', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                materia_id: parseInt(materiaId),
                estudiante_ids: seleccionados
            })
        });

        const data = await response.json();
        if (response.ok) {
            showNotification(data.message, 'success');
            document.getElementById('asignacionForm').reset();
            cargarDatosIniciales();
            mostrarTab('listar');
        } else {
            showNotification(data.error || 'Error', 'danger');
        }
    } catch (err) {
        console.error('Error:', err);
        showNotification('Error de conexión', 'danger');
    }
}

function seleccionarTodo() {
    document.querySelectorAll('input[name="estudiante_checkbox"]').forEach(cb => cb.checked = true);
}

function deseleccionarTodo() {
    document.querySelectorAll('input[name="estudiante_checkbox"]').forEach(cb => cb.checked = false);
}

function cargarTablaAsignaciones() {
    const tbody = document.getElementById('tablaAsignaciones');
    tbody.innerHTML = '';

    if (gruposAsignados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No hay asignaciones registradas</td></tr>';
        return;
    }

    // Group by nombre_grupo + materia_id (use API response which already has total_estudiantes)
    const asignaciones = {};
    gruposAsignados.forEach(g => {
        const key = `${g.nombre_grupo}_${g.materia_id}`;
        if (!asignaciones[key]) {
            asignaciones[key] = {
                nombre_grupo: g.nombre_grupo,
                materia_id: g.materia_id,
                nombre_materia: g.nombre_materia,
                curso: g.curso,
                paralelo: g.paralelo,
                especialidad: g.especialidad,
                total_estudiantes: g.total_estudiantes
            };
        }
    });

    let index = 1;
    Object.values(asignaciones).forEach(a => {
        const row = `
            <tr>
                <td>${index++}</td>
                <td>${a.nombre_materia}</td>
                <td>${a.curso}</td>
                <td>${a.paralelo}</td>
                <td>${a.especialidad || 'N/A'}</td>
                <td class="text-center"><span class="badge bg-info">${a.total_estudiantes}</span></td>
                <td class="text-center">
                    <button class="btn btn-sm btn-info" onclick="verDetallesAsignacion(${a.materia_id})">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

async function verDetallesAsignacion(materiaId) {
    try {
        const response = await fetch(`/api/grupos/por-materia/${materiaId}/estudiantes`);
        const estudiantes = await response.json();

        let html = '<h6>Estudiantes asignados:</h6><ul class="list-group">';
        if (estudiantes.length === 0) {
            html += '<li class="list-group-item">No hay estudiantes asignados</li>';
        } else {
            estudiantes.forEach(est => {
                html += `<li class="list-group-item">${est.cedula} - ${nombreEstudiante(est.nombres_apellidos, est.discapacidad)} (${est.sexo === 'M' ? 'M' : 'F'})</li>`;
            });
        }
        html += '</ul>';

        const modalHtml = `
            <div class="modal fade" id="detallesModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Detalle de Asignacion</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">${html}</div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        let modalEl = document.getElementById('detallesModal');
        if (!modalEl) {
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            modalEl = document.getElementById('detallesModal');
        }

        // Always update the modal body content
        modalEl.querySelector('.modal-body').innerHTML = html;

        const modal = new bootstrap.Modal(modalEl);
        modal.show();
    } catch (err) {
        showNotification('Error al cargar detalles', 'danger');
    }
}

function mostrarTab(tab) {
    document.getElementById('tabAsignar').style.display = tab === 'asignar' ? 'block' : 'none';
    document.getElementById('tabListar').style.display = tab === 'listar' ? 'block' : 'none';

    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    if (tab === 'asignar') document.querySelector('[onclick="mostrarTab(\'asignar\')"]').classList.add('active');
    if (tab === 'listar') document.querySelector('[onclick="mostrarTab(\'listar\')"]').classList.add('active');
}