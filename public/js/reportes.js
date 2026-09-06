let materiasData = [];
let estudiantesData = [];
let profesorActual = '';
let materiaActual = null;

document.addEventListener('DOMContentLoaded', function() {
    cargarMateriasReportes();
    cargarEstudiantesReportes();
});

async function cargarMateriasReportes() {
    try {
        const response = await fetch('/api/reportes/materias');
        materiasData = await response.json();
    const selects = ['asisMateriaSelect', 'notasMateriaSelect', 'comentMateriaSelect'];
    selects.forEach(id => {
            const select = document.getElementById(id);
            if (!select) return;
            select.innerHTML = '<option value="">Seleccionar...</option>';
            materiasData.forEach(m => {
                const esp = m.especialidad ? ` - ${m.especialidad}` : '';
                select.innerHTML += `<option value="${m.id}" data-profesor="${m.profesor || ''}" data-nombre="${m.nombre_materia}" data-curso="${m.curso}" data-paralelo="${m.paralelo}" data-especialidad="${m.especialidad || ''}">${m.nombre_materia} (${m.curso} ${m.paralelo}${esp})</option>`;
            });
        });

        selects.forEach(id => {
            const select = document.getElementById(id);
            if (!select) return;
            select.addEventListener('change', function() {
                const opt = this.options[this.selectedIndex];
                if (this.value) {
                    materiaActual = {
                        nombre: opt.dataset.nombre,
                        curso: opt.dataset.curso,
                        paralelo: opt.dataset.paralelo,
                        especialidad: opt.dataset.especialidad || '',
                        profesor: opt.dataset.profesor || ''
                    };
                    profesorActual = opt.dataset.profesor || '';
                } else {
                    materiaActual = null;
                    profesorActual = '';
                }
            });
        });

    const whatsappSelect = document.getElementById('whatsappMateriaFiltro');
    if (whatsappSelect) {
        whatsappSelect.innerHTML = '<option value="">Todas</option>';
        materiasData.forEach(m => {
            const esp = m.especialidad ? ` - ${m.especialidad}` : '';
            const grupoNombre = m.nombre_materia + ' - ' + m.curso + ' ' + m.paralelo;
            whatsappSelect.innerHTML += `<option value="${grupoNombre}" data-profesor="${m.profesor || ''}" data-nombre="${m.nombre_materia}" data-curso="${m.curso}" data-paralelo="${m.paralelo}" data-especialidad="${m.especialidad || ''}">${m.nombre_materia} (${m.curso} ${m.paralelo}${esp})</option>`;
        });
        whatsappSelect.addEventListener('change', function() {
            const opt = this.options[this.selectedIndex];
            if (this.value) {
                materiaActual = {
                    nombre: opt.dataset.nombre,
                    curso: opt.dataset.curso,
                    paralelo: opt.dataset.paralelo,
                    especialidad: opt.dataset.especialidad || '',
                    profesor: opt.dataset.profesor || ''
                };
                profesorActual = opt.dataset.profesor || '';
            } else {
                materiaActual = null;
                profesorActual = '';
            }
        });
    }
    } catch (err) {
        console.error('Error cargando materias:', err);
    }
}

async function cargarEstudiantesReportes() {
    try {
        const response = await fetch('/api/reportes/estudiantes');
        estudiantesData = await response.json();
    } catch (err) {
        console.error('Error cargando estudiantes:', err);
    }
}

function buscarEstudianteReporte(input, hiddenId) {
    const valor = input.value.toLowerCase().trim();
    const listaId = input.id.replace('BusquedaEstudiante', 'ListaEstudiantes');
    const lista = document.getElementById(listaId);
    lista.innerHTML = '';
    if (valor.length < 2) {
        lista.style.display = 'none';
        document.getElementById(hiddenId).value = '';
        return;
    }
    const filtrados = estudiantesData.filter(e =>
        e.nombres_apellidos.toLowerCase().includes(valor) || e.cedula.includes(valor)
    ).slice(0, 10);
    if (filtrados.length === 0) {
        lista.style.display = 'none';
        return;
    }
    filtrados.forEach(e => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'list-group-item list-group-item-action';
        item.textContent = `${e.cedula} - ${e.nombres_apellidos}`;
        item.onclick = function() {
            input.value = `${e.cedula} - ${e.nombres_apellidos}`;
            document.getElementById(hiddenId).value = e.id;
            lista.style.display = 'none';
        };
        lista.appendChild(item);
    });
    lista.style.display = 'block';
}

document.addEventListener('click', function(e) {
    document.querySelectorAll('#asisListaEstudiantes, #notasListaEstudiantes, #comentListaEstudiantes').forEach(lista => {
        if (!lista.contains(e.target) && !e.target.matches('input[id*="BusquedaEstudiante"]')) {
            lista.style.display = 'none';
        }
    });
});

// ==================== ASISTENCIA POR MATERIA ====================

function cambiarTipoAsistencia(tipo) {
    // tabs handled by Bootstrap
}

async function generarReporteAsistenciaMateria() {
    const materiaId = document.getElementById('asisMateriaSelect').value;
    if (!materiaId) {
        showNotification('Seleccione una materia', 'warning');
        return;
    }
    const fechaInicio = document.getElementById('asisFechaInicioCurso').value;
    const fechaFin = document.getElementById('asisFechaFinCurso').value;
    let url = `/api/reportes/asistencia/materia/${materiaId}`;
    const params = [];
    if (fechaInicio) params.push(`fecha_inicio=${fechaInicio}`);
    if (fechaFin) params.push(`fecha_fin=${fechaFin}`);
    if (params.length) url += '?' + params.join('&');

    try {
        const response = await fetch(url);
        const data = await response.json();
        const tbody = document.querySelector('#tablaAsistenciaCurso tbody');
        tbody.innerHTML = '';
        const rows = data.estudiantes || data;
        profesorActual = data.profesor || '';
        if (rows.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">Sin datos para este curso</td></tr>';
            return;
        }
        rows.forEach((row, i) => {
            const pct = parseFloat(row.porcentaje_asistencia) || 0;
            let pctClass = 'text-success';
            if (pct < 70) pctClass = 'text-danger';
            else if (pct < 90) pctClass = 'text-warning';
            const fechaInicio = row.fecha_inicio ? new Date(row.fecha_inicio).toLocaleDateString('es-ES') : '-';
            const fechaFin = row.fecha_fin ? new Date(row.fecha_fin).toLocaleDateString('es-ES') : '-';
            const esInactivo = row.activo === 0;
            const estiloInactivo = esInactivo ? 'opacity:0.5;background:#e9ecef' : '';
            tbody.innerHTML += `
                <tr style="${estiloInactivo}">
                    <td>${i + 1}</td>
                    <td>${fechaInicio} - ${fechaFin}</td>
                    <td>${nombreEstudiante(row.nombres_apellidos, row.discapacidad)}${esInactivo ? ' <span class="badge bg-secondary">INACTIVO</span>' : ''}</td>
                    <td>${row.nombre_materia || row.nombre_grupo}</td>
                    <td>${row.total_clases || 0}</td>
                    <td>${row.asistencias || 0}</td>
                    <td>${row.ausencias || 0}</td>
                    <td class="${pctClass} fw-bold">${pct.toFixed(2)}%</td>
                </tr>
            `;
        });
    } catch (err) {
        console.error('Error:', err);
        showNotification('Error al generar reporte', 'danger');
    }
}

// ==================== ASISTENCIA POR ESTUDIANTE ====================

async function generarReporteAsistenciaEstudiante() {
    const estudianteId = document.getElementById('asisEstudianteSeleccionado').value;
    if (!estudianteId) {
        showNotification('Seleccione un estudiante', 'warning');
        return;
    }
    const fechaInicio = document.getElementById('asisFechaInicioEst').value;
    const fechaFin = document.getElementById('asisFechaFinEst').value;
    let url = `/api/reportes/asistencia/estudiante/${estudianteId}`;
    const params = [];
    if (fechaInicio) params.push(`fecha_inicio=${fechaInicio}`);
    if (fechaFin) params.push(`fecha_fin=${fechaFin}`);
    if (params.length) url += '?' + params.join('&');

    try {
        const response = await fetch(url);
        const data = await response.json();
        const tbody = document.querySelector('#tablaAsistenciaEstudiante tbody');
        tbody.innerHTML = '';
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Sin registros de asistencia</td></tr>';
            return;
        }
        data.forEach((row, i) => {
            let estadoBadge;
            if (row.justificacion_id) {
                estadoBadge = '<span class="badge bg-info">Justificado</span>';
            } else if (row.estado === 'presente') {
                estadoBadge = '<span class="badge bg-success">Presente</span>';
            } else {
                estadoBadge = '<span class="badge bg-danger">Ausente</span>';
            }
            const motivoTitle = row.justificacion_id && row.motivo ? ` title="${row.motivo}"` : '';
            tbody.innerHTML += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${row.nombre_materia}</td>
                    <td>${row.nombre_materia || row.nombre_grupo}</td>
                    <td>${row.fecha.split('T')[0]}</td>
                    <td><span${motivoTitle}>${estadoBadge}</span></td>
                    <td>${row.comentario || ''}</td>
                </tr>
            `;
        });
    } catch (err) {
        console.error('Error:', err);
        showNotification('Error al generar reporte', 'danger');
    }
}

// ==================== NOTAS POR MATERIA ====================

function cambiarTipoNotas(tipo) {
    // tabs handled by Bootstrap
}

function colorNota(v) {
    if (v === null || v === undefined || v === '') return '';
    const n = parseFloat(v);
    if (isNaN(n)) return '';
    if (n <= 4) return 'text-danger fw-bold';
    if (n < 7) return 'fw-bold';
    return 'text-success fw-bold';
}

async function generarReporteNotasMateria() {
    const materiaId = document.getElementById('notasMateriaSelect').value;
    const trimestre = document.getElementById('notasTrimestreCurso').value;
    if (!materiaId) {
        showNotification('Seleccione una materia', 'warning');
        return;
    }
    try {
        const response = await fetch(`/api/reportes/notas/materia/${materiaId}/trimestre/${trimestre}`);
        const data = await response.json();
        profesorActual = data.profesor || '';
        const tbody = document.querySelector('#tablaNotasCurso tbody');
        tbody.innerHTML = '';

        if (!data.estudiantes || data.estudiantes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="10" class="text-center text-muted">Sin notas para esta materia</td></tr>';
            return;
        }

        const pct = data.porcentajes;
        const esFinal = trimestre === 'final';

        if (esFinal) {
            const thead = document.querySelector('#tablaNotasCurso thead tr');
            thead.innerHTML = `
                <th>#</th>
                <th>Estudiante</th>
                <th>T1</th>
                <th>T2</th>
                <th>T3</th>
                <th>Prom. Final</th>
                <th>Aprendizajes</th>
                <th>Supletorio</th>
                <th>Pérdida</th>
            `;

            let supletCount = 0, perdidaCount = 0;
            const avgT1 = [], avgT2 = [], avgT3 = [], avgPF = [];

            data.estudiantes.forEach((row, i) => {
                const t1 = row.notas_trimestrales ? row.notas_trimestrales[0] : null;
                const t2 = row.notas_trimestrales ? row.notas_trimestrales[1] : null;
                const t3 = row.notas_trimestrales ? row.notas_trimestrales[2] : null;
                const pf = row.nota_final;
                const esInactivo = row.activo === 0;
                const estiloInactivo = esInactivo ? 'opacity:0.5;background:#e9ecef' : '';

                if (!esInactivo) {
                    if (t1 !== null) avgT1.push(t1);
                    if (t2 !== null) avgT2.push(t2);
                    if (t3 !== null) avgT3.push(t3);
                    if (pf !== null) avgPF.push(pf);
                }

                let aprendizaje = '';
                if (pf !== null) {
                    if (pf <= 4) aprendizaje = 'No alcanza';
                    else if (pf <= 6.99) aprendizaje = 'Próximos a alcanzar';
                    else if (pf <= 8.99) aprendizaje = 'Alcanzan';
                    else aprendizaje = 'Domina';
                }
                if (!esInactivo) {
                    if (pf >= 4.01 && pf <= 6.99) supletCount++;
                    else if (pf !== null && pf < 4) perdidaCount++;
                }

                tbody.innerHTML += `
                    <tr style="${estiloInactivo}">
                        <td>${i + 1}</td>
                        <td>${nombreEstudiante(row.nombres_apellidos, row.discapacidad)}${esInactivo ? ' <span class="badge bg-secondary">INACTIVO</span>' : ''}</td>
                        <td class="${colorNota(t1)} fw-bold">${t1 !== null ? t1.toFixed(2) : '-'}</td>
                        <td class="${colorNota(t2)} fw-bold">${t2 !== null ? t2.toFixed(2) : '-'}</td>
                        <td class="${colorNota(t3)} fw-bold">${t3 !== null ? t3.toFixed(2) : '-'}</td>
                        <td class="${colorNota(pf)} fw-bold">${pf !== null ? pf.toFixed(2) : '-'}</td>
                        <td class="fw-bold">${aprendizaje}</td>
                        <td class="fw-bold">${pf !== null && pf >= 4.01 && pf <= 6.99 ? 'X' : ''}</td>
                        <td class="fw-bold">${pf !== null && pf < 4 ? 'X' : ''}</td>
                    </tr>
                `;
            });

            const avg = arr => arr.length > 0 ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2) : '-';
            tbody.innerHTML += `
                <tr class="table-info fw-bold">
                    <td colspan="2" class="text-end">PROMEDIOS:</td>
                    <td>${avg(avgT1)}</td>
                    <td>${avg(avgT2)}</td>
                    <td>${avg(avgT3)}</td>
                    <td>${avg(avgPF)}</td>
                    <td></td>
                    <td>${supletCount}</td>
                    <td>${perdidaCount}</td>
                </tr>
            `;
        } else {
            const thead = document.querySelector('#tablaNotasCurso thead tr');
            thead.innerHTML = `
                <th>#</th>
                <th>Estudiante</th>
                <th>Prom. Clase</th>
                <th>(${pct.tareas}%)</th>
                <th>Proyecto Final</th>
                <th>(${pct.proyecto}%)</th>
                <th>Examen Final</th>
                <th>(${pct.examen}%)</th>
                <th>Nota Final</th>
            `;

            data.estudiantes.forEach((row, i) => {
                const fmt = v => v !== null ? v.toFixed(2) : '-';
                const esInactivo = row.activo === 0;
                const estiloInactivo = esInactivo ? 'opacity:0.5;background:#e9ecef' : '';
                tbody.innerHTML += `
                    <tr style="${estiloInactivo}">
                        <td>${i + 1}</td>
                        <td>${nombreEstudiante(row.nombres_apellidos, row.discapacidad)}${esInactivo ? ' <span class="badge bg-secondary">INACTIVO</span>' : ''}</td>
                        <td>${fmt(row.prom_tareas)}</td>
                        <td>${fmt(row.pct_tareas)}</td>
                        <td>${fmt(row.proy_final)}</td>
                        <td>${fmt(row.pct_proyecto)}</td>
                        <td>${fmt(row.exa_final)}</td>
                        <td>${fmt(row.pct_examen)}</td>
                        <td class="${colorNota(row.nota_final)} fw-bold">${fmt(row.nota_final)}</td>
                    </tr>
                `;
            });

            const p = data.promedios;
            const fmtP = v => v !== null ? v.toFixed(2) : '-';
            tbody.innerHTML += `
                <tr class="table-info fw-bold">
                    <td colspan="2" class="text-end">PROMEDIOS:</td>
                    <td>${fmtP(p.prom_tareas)}</td>
                    <td>${fmtP(p.pct_tareas)}</td>
                    <td>${fmtP(p.proy_final)}</td>
                    <td>${fmtP(p.pct_proyecto)}</td>
                    <td>${fmtP(p.exa_final)}</td>
                    <td>${fmtP(p.pct_examen)}</td>
                    <td class="${colorNota(p.nota_final)}">${fmtP(p.nota_final)}</td>
                </tr>
            `;
        }
    } catch (err) {
        console.error('Error:', err);
        showNotification('Error al generar reporte', 'danger');
    }
}

// ==================== NOTAS POR ESTUDIANTE ====================

async function generarReporteNotasEstudiante() {
    const estudianteId = document.getElementById('notasEstudianteSeleccionado').value;
    const trimestre = document.getElementById('notasTrimestreEst').value;
    if (!estudianteId) {
        showNotification('Seleccione un estudiante', 'warning');
        return;
    }
    try {
        const response = await fetch(`/api/reportes/notas/estudiante/${estudianteId}/trimestre/${trimestre}`);
        const data = await response.json();
        const tbody = document.querySelector('#tablaNotasEstudiante tbody');
        tbody.innerHTML = '';
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="10" class="text-center text-muted">Sin notas registradas</td></tr>';
            return;
        }
        data.forEach((row, i) => {
            tbody.innerHTML += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${row.nombre_materia}</td>
                    <td>${row.nombre_materia || row.nombre_grupo}</td>
                    <td>${row.tareas || 'N/A'}</td>
                    <td class="${colorNota(row.proy_nota)}">${row.proy_nota ?? ''}</td>
                    <td>${row.proy_dr ?? ''}</td>
                    <td>${row.proy_pr ?? ''}</td>
                    <td class="${colorNota(row.exa_nota)}">${row.exa_nota ?? ''}</td>
                    <td>${row.exa_dre ?? ''}</td>
                    <td>${row.exa_er ?? ''}</td>
                </tr>
            `;
        });
    } catch (err) {
        console.error('Error:', err);
        showNotification('Error al generar reporte', 'danger');
    }
}

// ==================== COMENTARIOS ====================

function cambiarTipoComentarios(tipo) {
    // tabs handled by Bootstrap
}

async function generarReporteComentariosMateria() {
    const materiaId = document.getElementById('comentMateriaSelect').value;
    if (!materiaId) {
        showNotification('Seleccione una materia', 'warning');
        return;
    }
    const fechaInicio = document.getElementById('comentFechaInicio').value;
    const fechaFin = document.getElementById('comentFechaFin').value;
    let url = `/api/reportes/comentarios/materia/${materiaId}`;
    const params = [];
    if (fechaInicio) params.push(`fecha_inicio=${fechaInicio}`);
    if (fechaFin) params.push(`fecha_fin=${fechaFin}`);
    if (params.length) url += '?' + params.join('&');

    try {
        const response = await fetch(url);
        const data = await response.json();
        const tbody = document.querySelector('#tablaComentariosMateria tbody');
        tbody.innerHTML = '';
        const rows = data.comentarios || data;
        profesorActual = data.profesor || '';
        if (rows.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Sin comentarios registrados</td></tr>';
            return;
        }
        rows.forEach((row, i) => {
            const fecha = row.fecha_registro ? row.fecha_registro.split('T')[0] : '';
            const badge = row.origen === 'asistencia'
                ? '<span class="badge bg-info">Asistencia</span>'
                : '<span class="badge bg-warning text-dark">Nota</span>';
            const esInactivo = row.activo === 0;
            const estiloInactivo = esInactivo ? 'opacity:0.5;background:#e9ecef' : '';
            tbody.innerHTML += `
                <tr style="${estiloInactivo}">
                    <td>${i + 1}</td>
                    <td>${fecha}</td>
                    <td>${nombreEstudiante(row.nombres_apellidos, row.discapacidad)}${esInactivo ? ' <span class="badge bg-secondary">INACTIVO</span>' : ''}</td>
                    <td>${badge}</td>
                    <td>${row.comentario}</td>
                </tr>
            `;
        });
    } catch (err) {
        console.error('Error:', err);
        showNotification('Error al generar reporte', 'danger');
    }
}

async function generarReporteComentariosEstudiante() {
    const estudianteId = document.getElementById('comentEstudianteSeleccionado').value;
    if (!estudianteId) {
        showNotification('Seleccione un estudiante', 'warning');
        return;
    }
    const fechaInicio = document.getElementById('comentFechaInicioEst').value;
    const fechaFin = document.getElementById('comentFechaFinEst').value;
    let url = `/api/reportes/comentarios/estudiante/${estudianteId}`;
    const params = [];
    if (fechaInicio) params.push(`fecha_inicio=${fechaInicio}`);
    if (fechaFin) params.push(`fecha_fin=${fechaFin}`);
    if (params.length) url += '?' + params.join('&');

    try {
        const response = await fetch(url);
        const data = await response.json();
        const tbody = document.querySelector('#tablaComentariosEstudiante tbody');
        tbody.innerHTML = '';
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Sin comentarios registrados</td></tr>';
            return;
        }
        data.forEach((row, i) => {
            const fecha = row.fecha_registro ? row.fecha_registro.split('T')[0] : '';
            const badge = row.origen === 'asistencia'
                ? '<span class="badge bg-info">Asistencia</span>'
                : '<span class="badge bg-warning text-dark">Nota</span>';
            tbody.innerHTML += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${fecha}</td>
                    <td>${row.nombre_materia}</td>
                    <td>${row.nombre_materia || row.nombre_grupo}</td>
                    <td>${badge}</td>
                    <td>${row.comentario}</td>
                </tr>
            `;
        });
    } catch (err) {
        console.error('Error:', err);
        showNotification('Error al generar reporte', 'danger');
    }
}

// ==================== MENSAJES WHATSAPP ====================

async function cargarHistorialWhatsApp() {
    const fechaInicio = document.getElementById('whatsappFechaInicio').value;
    const fechaFin = document.getElementById('whatsappFechaFin').value;
    const tipo = document.getElementById('whatsappTipoFiltro').value;
    const materia = document.getElementById('whatsappMateriaFiltro').value;
    const busqueda = document.getElementById('whatsappBusqueda').value;

    let url = '/api/reportes/whatsapp/historial?';
    const params = [];
    if (fechaInicio) params.push(`fecha_inicio=${fechaInicio}`);
    if (fechaFin) params.push(`fecha_fin=${fechaFin}`);
    if (tipo) params.push(`tipo=${tipo}`);
    if (materia) params.push(`materia=${encodeURIComponent(materia)}`);
    if (busqueda) params.push(`busqueda=${encodeURIComponent(busqueda)}`);
    if (params.length) url += params.join('&');

    try {
        const response = await fetch(url);
        const data = await response.json();
        const tbody = document.getElementById('tbodyHistorialWhatsApp');
        tbody.innerHTML = '';
        profesorActual = (data.length > 0 && data[0].profesor) ? data[0].profesor : '';
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="text-center text-muted">No hay mensajes registrados</td></tr>';
            return;
        }
        data.forEach((row, i) => {
            const fecha = row.enviado_at ? row.enviado_at.split('T')[0] : '';
            const hora = row.enviado_at ? new Date(row.enviado_at).toLocaleTimeString('es-ES') : '';
            let tipoBadge = '<span class="badge bg-secondary">General</span>';
            if (row.tipo === 'inasistencia') tipoBadge = '<span class="badge bg-danger">Inasistencia</span>';
            else if (row.tipo === 'rendimiento') tipoBadge = '<span class="badge bg-warning text-dark">Rendimiento</span>';
            tbody.innerHTML += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${fecha}</td>
                    <td>${hora}</td>
                    <td>${row.estudiante}</td>
                    <td>${row.representante || 'N/A'}</td>
                    <td>${row.telefono || 'N/A'}</td>
                    <td>${row.materia_nombre || 'N/A'}</td>
                    <td>${tipoBadge}</td>
                    <td>${row.profesor || 'N/A'}</td>
                </tr>
            `;
        });
        showNotification(`${data.length} mensajes encontrados`, 'info');
    } catch (err) {
        console.error('Error:', err);
        showNotification('Error al cargar historial', 'danger');
    }
}

function construirEncabezadoPDF(tipoReporte) {
    let html = '<div style="text-align:center; margin-bottom:10px;">';
    if (materiaActual) {
        const esp = materiaActual.especialidad ? ' - ' + materiaActual.especialidad : '';
        html += '<h4 style="margin-bottom:3px;">Reporte por ' + tipoReporte + ' - ' + materiaActual.nombre + '</h4>';
        html += '<p style="margin-bottom:3px; font-size:13px;">Materia – ' + materiaActual.nombre + ' (' + materiaActual.curso + ' ' + materiaActual.paralelo + esp + ')</p>';
        html += '<p style="margin-bottom:5px; font-size:13px;">Docente - ' + (materiaActual.profesor || 'Sin asignar') + '</p>';
    } else {
        html += '<h4 style="margin-bottom:5px;">Reporte por ' + tipoReporte + '</h4>';
    }
    html += '</div>';
    return html;
}

function exportarPDF(tablaId, titulo, subtitulo) {
    const tabla = document.getElementById(tablaId);
    const config = {
        margin: [10, 5, 10, 5],
        filename: tablaId + '.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    const div = document.createElement('div');
    div.style.width = '100%';
    let html = construirEncabezadoPDF('Estudiante');
    if (subtitulo) {
        html += '<p style="text-align:center; margin-bottom:5px; font-size:12px;">' + subtitulo + '</p>';
    }
    div.innerHTML = html + tabla.outerHTML;
    html2pdf().set(config).from(div).save();
}

function exportarPDFNotasMateria() {
    const tabla = document.getElementById('tablaNotasCurso');
    const config = {
        margin: [10, 5, 10, 5],
        filename: 'Reporte_Notas_Materia.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    const div = document.createElement('div');
    div.innerHTML = construirEncabezadoPDF('Notas') + tabla.outerHTML;
    html2pdf().set(config).from(div).save();
}

function exportarPDFConDocente(tablaId, titulo) {
    const tabla = document.getElementById(tablaId);
    const config = {
        margin: [10, 5, 10, 5],
        filename: tablaId + '.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    const tipo = titulo.includes('Asistencia') ? 'Asistencia' : titulo.includes('Comentario') ? 'Comentarios' : titulo.includes('WhatsApp') ? 'Mensajes WhatsApp' : titulo;
    const div = document.createElement('div');
    div.innerHTML = construirEncabezadoPDF(tipo) + tabla.outerHTML;
    html2pdf().set(config).from(div).save();
}
