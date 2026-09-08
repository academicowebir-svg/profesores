const express = require('express');
const router = express.Router();


// Renderizar vista de reportes
router.get('/view', (req, res) => {
    const db = req.db;
    res.render('reportes', { user: req.session.user });
});

// Obtener todos los grupos para reportes (filtrados por docente)
router.get('/grupos', async (req, res) => {
    const db = req.db;
    const user = req.session.user;
    try {
        let query = `
            SELECT DISTINCT g.id, g.nombre_grupo, m.nombre_materia, m.curso, m.paralelo, m.especialidad
            FROM grupos g
            INNER JOIN materias m ON g.materia_id = m.id
        `;
        const params = [];
        if (user.rol === 'docente') {
            query += ' WHERE m.docente_id = ?';
            params.push(user.id);
        }
        query += ' ORDER BY m.curso, m.paralelo, m.nombre_materia';
        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener materias únicas (filtradas por docente)
router.get('/materias', async (req, res) => {
    const db = req.db;
    const user = req.session.user;
    try {
        let query = `SELECT m.id, m.nombre_materia, m.curso, m.paralelo, m.especialidad, m.docente_id,
                     u.nombre as profesor
                     FROM materias m LEFT JOIN usuarios u ON m.docente_id = u.id`;
        const params = [];
        if (user.rol === 'docente') {
            query += ' WHERE m.docente_id = ?';
            params.push(user.id);
        }
        query += ' ORDER BY m.nombre_materia';
        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener estudiantes de un grupo
router.get('/grupos/:grupo_id/estudiantes', async (req, res) => {
    const db = req.db;
    try {
        const [rows] = await db.query(`
            SELECT e.id, e.cedula, e.nombres_apellidos, e.discapacidad, e.activo
            FROM grupos g
            INNER JOIN estudiantes e ON g.estudiante_id = e.id
            WHERE g.id = ?
            ORDER BY e.nombres_apellidos
        `, [req.params.grupo_id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener grupos por materia
router.get('/grupos-por-materia/:materia_id', async (req, res) => {
    const db = req.db;
    try {
        const [rows] = await db.query(`
            SELECT g.id, g.nombre_grupo
            FROM grupos g
            WHERE g.materia_id = ?
            ORDER BY g.nombre_grupo
        `, [req.params.materia_id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener todos los estudiantes
router.get('/estudiantes', async (req, res) => {
    const db = req.db;
    try {
        const [rows] = await db.query(`SELECT id, cedula, nombres_apellidos, discapacidad, curso, paralelo FROM estudiantes ORDER BY nombres_apellidos`);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==================== ASISTENCIA ====================

// Reporte de asistencia por GRUPO (resumen: % asistencia de cada estudiante)
router.get('/asistencia/grupo/:grupo_id', async (req, res) => {
    const db = req.db;
    const { grupo_id } = req.params;
    const { fecha_inicio, fecha_fin } = req.query;
    try {
        let query = `
            SELECT e.cedula, e.nombres_apellidos, e.activo,
                   COUNT(a.id) as total_clases,
                   SUM(CASE WHEN a.estado = 'presente' OR j.id IS NOT NULL THEN 1 ELSE 0 END) as asistencias,
                   SUM(CASE WHEN a.estado = 'ausente' AND j.id IS NULL THEN 1 ELSE 0 END) as ausencias,
                   ROUND(SUM(CASE WHEN a.estado = 'presente' OR j.id IS NOT NULL THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(a.id), 0), 1) as porcentaje_asistencia
            FROM grupos g
            INNER JOIN estudiantes e ON g.estudiante_id = e.id
            LEFT JOIN asistencias a ON a.grupo_id = g.id
            LEFT JOIN justificaciones j ON j.asistencia_id = a.id
            WHERE g.id = ?
        `;
        const params = [grupo_id];
        if (fecha_inicio && fecha_fin) {
            query += ' AND a.fecha BETWEEN ? AND ?';
            params.push(fecha_inicio, fecha_fin);
        }
        query += ' GROUP BY e.id, e.cedula, e.nombres_apellidos ORDER BY e.nombres_apellidos';
        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Reporte de asistencia por MATERIA (resumen de todos los grupos de la materia)
router.get('/asistencia/materia/:materia_id', async (req, res) => {
    const db = req.db;
    const { materia_id } = req.params;
    const { fecha_inicio, fecha_fin } = req.query;
    try {
        let query = `
            SELECT g.id as grupo_id, g.nombre_grupo,
                   e.nombres_apellidos, e.discapacidad, e.activo,
                   MIN(a.fecha) as fecha_inicio,
                   MAX(a.fecha) as fecha_fin,
                   COUNT(a.id) as total_clases,
                   SUM(CASE WHEN a.estado = 'presente' OR j.id IS NOT NULL THEN 1 ELSE 0 END) as asistencias,
                   SUM(CASE WHEN a.estado = 'ausente' AND j.id IS NULL THEN 1 ELSE 0 END) as ausencias,
                   ROUND(SUM(CASE WHEN a.estado = 'presente' OR j.id IS NOT NULL THEN 1 ELSE 0 END) * 100.0 / COUNT(a.id), 1) as porcentaje_asistencia
            FROM grupos g
            INNER JOIN estudiantes e ON g.estudiante_id = e.id
            INNER JOIN asistencias a ON a.grupo_id = g.id
            LEFT JOIN justificaciones j ON j.asistencia_id = a.id
            WHERE g.materia_id = ?
        `;
        const params = [materia_id];
        if (fecha_inicio && fecha_fin) {
            query += ' AND a.fecha BETWEEN ? AND ?';
            params.push(fecha_inicio, fecha_fin);
        }
        query += ' GROUP BY g.id, g.nombre_grupo, e.id, e.nombres_apellidos ORDER BY g.nombre_grupo, e.nombres_apellidos';
        const [rows] = await db.query(query, params);
        const [materiaRow] = await db.query(`
            SELECT u.nombre as profesor
            FROM materias m
            LEFT JOIN usuarios u ON m.docente_id = u.id
            WHERE m.id = ?
        `, [materia_id]);
        const profesor = materiaRow.length > 0 ? materiaRow[0].profesor : '';
        res.json({ estudiantes: rows, profesor });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Reporte de asistencia por ESTUDIANTE (todos los grupos del estudiante)
router.get('/asistencia/estudiante/:estudiante_id', async (req, res) => {
    const db = req.db;
    const { estudiante_id } = req.params;
    const { fecha_inicio, fecha_fin } = req.query;
    try {
        let query = `
            SELECT g.nombre_grupo, m.nombre_materia,
                   a.fecha, a.estado, a.comentario,
                   j.id as justificacion_id, j.motivo
            FROM asistencias a
            INNER JOIN grupos g ON a.grupo_id = g.id
            INNER JOIN materias m ON g.materia_id = m.id
            LEFT JOIN justificaciones j ON j.asistencia_id = a.id
            WHERE g.estudiante_id = ?
        `;
        const params = [estudiante_id];
        if (fecha_inicio && fecha_fin) {
            query += ' AND a.fecha BETWEEN ? AND ?';
            params.push(fecha_inicio, fecha_fin);
        }
        query += ' ORDER BY m.nombre_materia, a.fecha';
        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==================== NOTAS ====================

// Reporte de notas por GRUPO y trimestre
router.get('/notas/grupo/:grupo_id/trimestre/:trimestre', async (req, res) => {
    const db = req.db;
    const { grupo_id, trimestre } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT e.cedula, e.nombres_apellidos, e.activo,
                   GROUP_CONCAT(CASE WHEN n.tipo = 'tarea' THEN CONCAT('T', n.indice+1, ': ', n.nota) END SEPARATOR '|') as tareas,
                   MAX(CASE WHEN n.tipo = 'proyecto' AND n.indice = 0 THEN n.nota END) as proy_nota,
                   MAX(CASE WHEN n.tipo = 'proyecto' AND n.indice = 1 THEN n.nota END) as proy_dr,
                   MAX(CASE WHEN n.tipo = 'proyecto' AND n.indice = 2 THEN n.nota END) as proy_pr,
                   MAX(CASE WHEN n.tipo = 'examen' AND n.indice = 0 THEN n.nota END) as exa_nota,
                   MAX(CASE WHEN n.tipo = 'examen' AND n.indice = 1 THEN n.nota END) as exa_dre,
                   MAX(CASE WHEN n.tipo = 'examen' AND n.indice = 2 THEN n.nota END) as exa_er
            FROM grupos g
            INNER JOIN estudiantes e ON g.estudiante_id = e.id
            LEFT JOIN notas n ON n.grupo_id = g.id AND n.trimestre = ?
            WHERE g.id = ?
            GROUP BY e.id, e.cedula, e.nombres_apellidos
            ORDER BY e.nombres_apellidos
        `, [trimestre, grupo_id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Reporte de notas por MATERIA y trimestre (datos procesados)
router.get('/notas/materia/:materia_id/trimestre/:trimestre', async (req, res) => {
    const db = req.db;
    const { materia_id, trimestre } = req.params;
    try {
        const esFinal = trimestre === 'final';

        // Obtener info de la materia (curso, paralelo, especialidad)
        const [materiaInfo] = await db.query('SELECT curso, paralelo, especialidad FROM materias WHERE id = ?', [materia_id]);
        const matInfo = materiaInfo.length > 0 ? materiaInfo[0] : null;

        // Intentar obtener porcentajes específicos por materia+curso+paralelo+especialidad
        let pctTareasVal, pctProyectoVal, pctExamenVal;
        if (matInfo) {
            let configQuery = 'SELECT promedio_tareas, proyecto, examen FROM configuracion_porcentajes_materia_curso WHERE materia_id = ? AND curso = ? AND paralelo = ? AND school_id = (SELECT school_id FROM materias WHERE id = ? LIMIT 1)';
            let configParams = [materia_id, matInfo.curso, matInfo.paralelo, materia_id];
            if (matInfo.especialidad) {
                configQuery += ' AND especialidad = ?';
                configParams.push(matInfo.especialidad);
            } else {
                configQuery += ' AND especialidad IS NULL';
            }
            const [configRows] = await db.query(configQuery, configParams);
            if (configRows.length > 0) {
                pctTareasVal = parseFloat(configRows[0].promedio_tareas) ?? 70;
                pctProyectoVal = parseFloat(configRows[0].proyecto) ?? 15;
                pctExamenVal = parseFloat(configRows[0].examen) ?? 15;
            }
        }
        // Si no hay config específica, usar globales
        if (pctTareasVal === undefined) {
            const [pctRows] = await db.query('SELECT concepto, porcentaje FROM configuracion_porcentajes');
            const porcentajes = {};
            pctRows.forEach(r => { porcentajes[r.concepto] = parseFloat(r.porcentaje); });
            pctTareasVal = porcentajes.promedio_tareas ?? 70;
            pctProyectoVal = porcentajes.proyecto ?? 15;
            pctExamenVal = porcentajes.examen ?? 15;
        }

        const trimestresAConsultar = esFinal ? [1, 2, 3] : [parseInt(trimestre)];

        // Obtener todos los estudiantes de la materia
        const [estudiantesRows] = await db.query(`
            SELECT g.id as grupo_id, g.nombre_grupo,
                   e.id as estudiante_id, e.cedula, e.nombres_apellidos, e.discapacidad, e.activo
            FROM grupos g
            INNER JOIN estudiantes e ON g.estudiante_id = e.id
            WHERE g.materia_id = ?
            ORDER BY g.nombre_grupo, e.nombres_apellidos
        `, [materia_id]);

        const estudiantesMap = {};
        estudiantesRows.forEach(r => {
            estudiantesMap[r.estudiante_id] = {
                cedula: r.cedula,
                nombres_apellidos: r.nombres_apellidos,
                discapacidad: r.discapacidad,
                grupo: r.nombre_grupo,
                grupo_id: r.grupo_id
            };
        });

        const notasFinalesPorTrimestre = {};

        const placeholders = trimestresAConsultar.map(() => '?').join(',');
        const [allRows] = await db.query(`
            SELECT g.id as grupo_id,
                   e.id as estudiante_id, e.activo,
                   n.tipo, n.nota, n.indice, n.trimestre
            FROM grupos g
            INNER JOIN estudiantes e ON g.estudiante_id = e.id
            LEFT JOIN notas n ON n.grupo_id = g.id AND n.trimestre IN (${placeholders})
            WHERE g.materia_id = ?
            ORDER BY e.nombres_apellidos, n.tipo, n.indice
        `, [...trimestresAConsultar, materia_id]);

        for (const trim of trimestresAConsultar) {
            const rows = allRows.filter(r => r.trimestre == trim || r.trimestre === null);

            const tempMap = {};
            rows.forEach(r => {
                if (!tempMap[r.estudiante_id]) {
                    tempMap[r.estudiante_id] = { tareas: [], proy_nota: null, proy_dr: null, proy_pr: null, exa_nota: null, exa_dre: null, exa_er: null };
                }
                const est = tempMap[r.estudiante_id];
                if (r.tipo === 'tarea' && r.nota !== null) est.tareas.push(parseFloat(r.nota));
                else if (r.tipo === 'proyecto') {
                    if (r.indice === 0) est.proy_nota = parseFloat(r.nota);
                    else if (r.indice === 1) est.proy_dr = parseFloat(r.nota);
                    else if (r.indice === 2) est.proy_pr = parseFloat(r.nota);
                } else if (r.tipo === 'examen') {
                    if (r.indice === 0) est.exa_nota = parseFloat(r.nota);
                    else if (r.indice === 1) est.exa_dre = parseFloat(r.nota);
                    else if (r.indice === 2) est.exa_er = parseFloat(r.nota);
                }
            });

            for (const [estId, est] of Object.entries(tempMap)) {
                if (!notasFinalesPorTrimestre[estId]) notasFinalesPorTrimestre[estId] = [];
                const promTareas = est.tareas.length > 0 ? est.tareas.reduce((s, v) => s + v, 0) / est.tareas.length : 0;
                let proyFinal = 0;
                if (est.proy_nota !== null) {
                    const vals = [est.proy_nota];
                    if (est.proy_dr !== null) vals.push(est.proy_dr);
                    if (est.proy_pr !== null) vals.push(est.proy_pr);
                    const promProy = vals.reduce((s, v) => s + v, 0) / vals.length;
                    proyFinal = promProy > est.proy_nota ? promProy : est.proy_nota;
                }
                let exaFinal = 0;
                if (est.exa_nota !== null) {
                    const vals = [est.exa_nota];
                    if (est.exa_dre !== null) vals.push(est.exa_dre);
                    if (est.exa_er !== null) vals.push(est.exa_er);
                    const promExa = vals.reduce((s, v) => s + v, 0) / vals.length;
                    exaFinal = promExa > est.exa_nota ? promExa : est.exa_nota;
                }
                const notaFinal = (promTareas * pctTareasVal + proyFinal * pctProyectoVal + exaFinal * pctExamenVal) / 100;
                notasFinalesPorTrimestre[estId].push({
                    prom_tareas: promTareas,
                    pct_tareas: promTareas * pctTareasVal / 100,
                    proy_final: proyFinal,
                    pct_proyecto: proyFinal * pctProyectoVal / 100,
                    exa_final: exaFinal,
                    pct_examen: exaFinal * pctExamenVal / 100,
                    nota_final: notaFinal
                });
            }
        }

        const resultado = Object.entries(estudiantesMap).map(([estId, est]) => {
            const notasTrimestres = notasFinalesPorTrimestre[estId] || [];

            let promTareas, pctTareas, proyFinal, pctProyecto, exaFinal, pctExamen, notaFinal;

            if (esFinal) {
                const conNotas = notasTrimestres.filter(n => n.nota_final > 0);
                if (conNotas.length === 0) {
                    promTareas = null; pctTareas = null; proyFinal = null; pctProyecto = null;
                    exaFinal = null; pctExamen = null; notaFinal = null;
                } else {
                    promTareas = parseFloat((conNotas.reduce((s, n) => s + n.prom_tareas, 0) / conNotas.length).toFixed(2));
                    pctTareas = parseFloat((conNotas.reduce((s, n) => s + n.pct_tareas, 0) / conNotas.length).toFixed(2));
                    proyFinal = parseFloat((conNotas.reduce((s, n) => s + n.proy_final, 0) / conNotas.length).toFixed(2));
                    pctProyecto = parseFloat((conNotas.reduce((s, n) => s + n.pct_proyecto, 0) / conNotas.length).toFixed(2));
                    exaFinal = parseFloat((conNotas.reduce((s, n) => s + n.exa_final, 0) / conNotas.length).toFixed(2));
                    pctExamen = parseFloat((conNotas.reduce((s, n) => s + n.pct_examen, 0) / conNotas.length).toFixed(2));
                    notaFinal = parseFloat((conNotas.reduce((s, n) => s + n.nota_final, 0) / conNotas.length).toFixed(2));
                }
            } else {
                const n = notasTrimestres[0];
                if (!n || n.nota_final === 0) {
                    promTareas = null; pctTareas = null; proyFinal = null; pctProyecto = null;
                    exaFinal = null; pctExamen = null; notaFinal = null;
                } else {
                    promTareas = parseFloat(n.prom_tareas.toFixed(2));
                    pctTareas = parseFloat(n.pct_tareas.toFixed(2));
                    proyFinal = parseFloat(n.proy_final.toFixed(2));
                    pctProyecto = parseFloat(n.pct_proyecto.toFixed(2));
                    exaFinal = parseFloat(n.exa_final.toFixed(2));
                    pctExamen = parseFloat(n.pct_examen.toFixed(2));
                    notaFinal = parseFloat(n.nota_final.toFixed(2));
                }
            }

            return {
                cedula: est.cedula,
                nombres_apellidos: est.nombres_apellidos,
                discapacidad: est.discapacidad,
                grupo: est.grupo,
                prom_tareas: promTareas, pct_tareas: pctTareas, proy_final: proyFinal, pct_proyecto: pctProyecto,
                exa_final: exaFinal, pct_examen: pctExamen, nota_final: notaFinal,
                notas_trimestrales: esFinal ? [notasTrimestres[0]?.nota_final || null, notasTrimestres[1]?.nota_final || null, notasTrimestres[2]?.nota_final || null] : null
            };
        });

        // Calcular promedios generales
        const withTareas = resultado.filter(r => r.prom_tareas !== null);
        const withProy = resultado.filter(r => r.proy_final !== null);
        const withExa = resultado.filter(r => r.exa_final !== null);
        const withFinal = resultado.filter(r => r.nota_final !== null);

        const promedios = {
            prom_tareas: withTareas.length > 0 ? parseFloat((withTareas.reduce((s, r) => s + r.prom_tareas, 0) / withTareas.length).toFixed(2)) : null,
            pct_tareas: withTareas.length > 0 ? parseFloat((withTareas.reduce((s, r) => s + r.pct_tareas, 0) / withTareas.length).toFixed(2)) : null,
            proy_final: withProy.length > 0 ? parseFloat((withProy.reduce((s, r) => s + r.proy_final, 0) / withProy.length).toFixed(2)) : null,
            pct_proyecto: withProy.length > 0 ? parseFloat((withProy.reduce((s, r) => s + r.pct_proyecto, 0) / withProy.length).toFixed(2)) : null,
            exa_final: withExa.length > 0 ? parseFloat((withExa.reduce((s, r) => s + r.exa_final, 0) / withExa.length).toFixed(2)) : null,
            pct_examen: withExa.length > 0 ? parseFloat((withExa.reduce((s, r) => s + r.pct_examen, 0) / withExa.length).toFixed(2)) : null,
            nota_final: withFinal.length > 0 ? parseFloat((withFinal.reduce((s, r) => s + r.nota_final, 0) / withFinal.length).toFixed(2)) : null
        };

        const [materiaRow] = await db.query(`
            SELECT u.nombre as profesor
            FROM materias m LEFT JOIN usuarios u ON m.docente_id = u.id
            WHERE m.id = ?
        `, [materia_id]);
        const profesor = materiaRow.length > 0 ? materiaRow[0].profesor : '';

        res.json({ estudiantes: resultado, promedios, porcentajes: { tareas: pctTareasVal, proyecto: pctProyectoVal, examen: pctExamenVal }, profesor });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Reporte de notas por ESTUDIANTE y trimestre
router.get('/notas/estudiante/:estudiante_id/trimestre/:trimestre', async (req, res) => {
    const db = req.db;
    const { estudiante_id, trimestre } = req.params;
    try {
        const esFinal = trimestre === 'final';
        const trimestresAConsultar = esFinal ? [1, 2, 3] : [parseInt(trimestre)];

        const [rows] = await db.query(`
            SELECT g.id as grupo_id, g.nombre_grupo, m.nombre_materia,
                   n.tipo, n.nota, n.indice, n.trimestre
            FROM notas n
            INNER JOIN grupos g ON n.grupo_id = g.id
            INNER JOIN materias m ON g.materia_id = m.id
            WHERE g.estudiante_id = ? AND n.trimestre IN (?)
            ORDER BY m.nombre_materia, n.tipo, n.indice
        `, [estudiante_id, trimestresAConsultar]);

        const materiasMap = {};
        rows.forEach(r => {
            const key = r.nombre_materia;
            if (!materiasMap[key]) {
                materiasMap[key] = { nombre_grupo: r.nombre_grupo, nombre_materia: r.nombre_materia, notasPorTrimestre: {} };
            }
            const m = materiasMap[key];
            if (!m.notasPorTrimestre[r.trimestre]) {
                m.notasPorTrimestre[r.trimestre] = { tareas: [], proy_nota: null, proy_dr: null, proy_pr: null, exa_nota: null, exa_dre: null, exa_er: null };
            }
            const nt = m.notasPorTrimestre[r.trimestre];
            if (r.tipo === 'tarea' && r.nota !== null) nt.tareas.push(parseFloat(r.nota));
            else if (r.tipo === 'proyecto') {
                if (r.indice === 0) nt.proy_nota = parseFloat(r.nota);
                else if (r.indice === 1) nt.proy_dr = parseFloat(r.nota);
                else if (r.indice === 2) nt.proy_pr = parseFloat(r.nota);
            } else if (r.tipo === 'examen') {
                if (r.indice === 0) nt.exa_nota = parseFloat(r.nota);
                else if (r.indice === 1) nt.exa_dre = parseFloat(r.nota);
                else if (r.indice === 2) nt.exa_er = parseFloat(r.nota);
            }
        });

        const resultado = [];
        for (const m of Object.values(materiasMap) ) {
            if (esFinal) {
                const trims = Object.values(m.notasPorTrimestre);
                const avgNum = (arr, key) => {
                    const vals = arr.map(t => t[key]).filter(v => v !== null && v !== undefined);
                    return vals.length > 0 ? parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2)) : null;
                };
                const avgTareasArr = trims.map(t => t.tareas && t.tareas.length > 0 ? t.tareas.reduce((a, b) => a + b, 0) / t.tareas.length : null).filter(v => v !== null);
                const avgTareas = avgTareasArr.length > 0 ? parseFloat((avgTareasArr.reduce((a, b) => a + b, 0) / avgTareasArr.length).toFixed(2)) : null;
                const tareasStr = avgTareas !== null ? `Prom: ${avgTareas}` : 'N/A';
                resultado.push({
                    nombre_grupo: m.nombre_grupo,
                    nombre_materia: m.nombre_materia,
                    tareas: tareasStr,
                    proy_nota: avgNum(trims, 'proy_nota'),
                    proy_dr: avgNum(trims, 'proy_dr'),
                    proy_pr: avgNum(trims, 'proy_pr'),
                    exa_nota: avgNum(trims, 'exa_nota'),
                    exa_dre: avgNum(trims, 'exa_dre'),
                    exa_er: avgNum(trims, 'exa_er')
                });
            } else {
                const nt = m.notasPorTrimestre[trimestre] || Object.values(m.notasPorTrimestre)[0] || {};
                const tareasStr = nt.tareas && nt.tareas.length > 0
                    ? nt.tareas.map((v, i) => `T${i+1}: ${v}`).join(' | ')
                    : 'N/A';
                resultado.push({
                    nombre_grupo: m.nombre_grupo,
                    nombre_materia: m.nombre_materia,
                    tareas: tareasStr,
                    proy_nota: nt.proy_nota,
                    proy_dr: nt.proy_dr,
                    proy_pr: nt.proy_pr,
                    exa_nota: nt.exa_nota,
                    exa_dre: nt.exa_dre,
                    exa_er: nt.exa_er
                });
            }
        }

        res.json(resultado);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==================== COMENTARIOS ====================

// Reporte de comentarios por materia
router.get('/comentarios/materia/:materia_id', async (req, res) => {
    const db = req.db;
    const { materia_id } = req.params;
    const { fecha_inicio, fecha_fin } = req.query;
    try {
        let query = `
            SELECT 'asistencia' as origen, a.comentario, a.fecha as fecha_registro,
                   g.nombre_grupo, e.cedula, e.nombres_apellidos, e.discapacidad, e.activo
            FROM asistencias a
            INNER JOIN grupos g ON a.grupo_id = g.id
            INNER JOIN estudiantes e ON g.estudiante_id = e.id
            WHERE g.materia_id = ? AND a.comentario IS NOT NULL AND a.comentario != ''
            UNION ALL
            SELECT 'nota' as origen, n.comentario, n.fecha_registro,
                   g.nombre_grupo, e.cedula, e.nombres_apellidos, e.discapacidad, e.activo
            FROM notas n
            INNER JOIN grupos g ON n.grupo_id = g.id
            INNER JOIN estudiantes e ON g.estudiante_id = e.id
            WHERE g.materia_id = ? AND n.comentario IS NOT NULL AND n.comentario != ''
        `;
        const params = [materia_id, materia_id];
        if (fecha_inicio && fecha_fin) {
            query += ' AND fecha_registro BETWEEN ? AND ?';
            params.push(fecha_inicio, fecha_fin);
        }
        query += ' ORDER BY fecha_registro DESC, nombres_apellidos';
        const [rows] = await db.query(query, params);
        const [materiaRow] = await db.query(`
            SELECT u.nombre as profesor
            FROM materias m LEFT JOIN usuarios u ON m.docente_id = u.id
            WHERE m.id = ?
        `, [materia_id]);
        const profesor = materiaRow.length > 0 ? materiaRow[0].profesor : '';
        res.json({ comentarios: rows, profesor });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Reporte de comentarios por estudiante
router.get('/comentarios/estudiante/:estudiante_id', async (req, res) => {
    const db = req.db;
    const { estudiante_id } = req.params;
    const { fecha_inicio, fecha_fin } = req.query;
    try {
        let query = `
            SELECT 'asistencia' as origen, a.comentario, a.fecha as fecha_registro,
                   g.nombre_grupo, m.nombre_materia
            FROM asistencias a
            INNER JOIN grupos g ON a.grupo_id = g.id
            INNER JOIN materias m ON g.materia_id = m.id
            WHERE g.estudiante_id = ? AND a.comentario IS NOT NULL AND a.comentario != ''
            UNION ALL
            SELECT 'nota' as origen, n.comentario, n.fecha_registro,
                   g.nombre_grupo, m.nombre_materia
            FROM notas n
            INNER JOIN grupos g ON n.grupo_id = g.id
            INNER JOIN materias m ON g.materia_id = m.id
            WHERE g.estudiante_id = ? AND n.comentario IS NOT NULL AND n.comentario != ''
        `;
        const params = [estudiante_id, estudiante_id];
        if (fecha_inicio && fecha_fin) {
            query += ' AND fecha_registro BETWEEN ? AND ?';
            params.push(fecha_inicio, fecha_fin);
        }
        query += ' ORDER BY fecha_registro DESC';
        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==================== MENSAJES WHATSAPP ====================

router.get('/whatsapp/materia/:materia_id', async (req, res) => {
    const db = req.db;
    const { materia_id } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT g.id as grupo_id, g.nombre_grupo,
                   e.cedula, e.nombres_apellidos, e.discapacidad, e.activo,
                   e.representante, e.telefono_representante,
                   u.nombre as profesor, m.nombre_materia
            FROM grupos g
            INNER JOIN estudiantes e ON g.estudiante_id = e.id
            INNER JOIN materias m ON g.materia_id = m.id
            LEFT JOIN usuarios u ON m.docente_id = u.id
            WHERE g.materia_id = ?
            ORDER BY e.nombres_apellidos
        `, [materia_id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/whatsapp/estudiante/:estudiante_id', async (req, res) => {
    const db = req.db;
    const { estudiante_id } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT g.id as grupo_id, g.nombre_grupo,
                   e.cedula, e.nombres_apellidos, e.discapacidad, e.activo,
                   e.representante, e.telefono_representante,
                   u.nombre as profesor, m.nombre_materia
            FROM grupos g
            INNER JOIN estudiantes e ON g.estudiante_id = e.id
            INNER JOIN materias m ON g.materia_id = m.id
            LEFT JOIN usuarios u ON m.docente_id = u.id
            WHERE g.estudiante_id = ?
            ORDER BY m.nombre_materia
        `, [estudiante_id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/whatsapp/detalle/:grupo_id', async (req, res) => {
    const db = req.db;
    const { grupo_id } = req.params;
    const { tipo } = req.query;
    try {
        const [grupoInfo] = await db.query(`
            SELECT g.nombre_grupo, e.cedula, e.nombres_apellidos, e.activo, e.representante,
                   e.telefono_representante, u.nombre as profesor, m.nombre_materia
            FROM grupos g
            INNER JOIN estudiantes e ON g.estudiante_id = e.id
            INNER JOIN materias m ON g.materia_id = m.id
            LEFT JOIN usuarios u ON m.docente_id = u.id
            WHERE g.id = ? LIMIT 1
        `, [grupo_id]);
        if (grupoInfo.length === 0) return res.json({ detalle: '' });
        const info = grupoInfo[0];
        let detalle = '';

        if (tipo === 'inasistencia') {
            const [asis] = await db.query(`
                SELECT COUNT(*) as total,
                       SUM(CASE WHEN estado = 'ausente' THEN 1 ELSE 0 END) as ausencias
                FROM asistencias WHERE grupo_id = ?
            `, [grupo_id]);
            if (asis.length > 0 && asis[0].total > 0) {
                const pct = ((asis[0].ausencias / asis[0].total) * 100).toFixed(1);
                detalle = `${asis[0].ausencias} ausencias de ${asis[0].total} clases (${pct}%)`;
            } else {
                detalle = 'Sin registros de asistencia';
            }
        } else if (tipo === 'rendimiento') {
            const [pcts] = await db.query('SELECT concepto, porcentaje FROM configuracion_porcentajes');
            const pctMap = {};
            pcts.forEach(p => { pctMap[p.concepto] = parseFloat(p.porcentaje); });
            const pctT = pctMap['promedio_tareas'] ?? 70;
            const pctP = pctMap['proyecto'] ?? 15;
            const pctE = pctMap['examen'] ?? 15;

            const [maxT] = await db.query('SELECT MAX(trimestre) as max_t FROM notas WHERE grupo_id = ?', [grupo_id]);
            const trimestre = maxT.length > 0 && maxT[0].max_t ? maxT[0].max_t : 1;

            const [notas] = await db.query('SELECT nota, tipo, indice FROM notas WHERE grupo_id = ? AND trimestre = ?', [grupo_id, trimestre]);
            const tareas = notas.filter(n => n.tipo === 'tarea').map(n => parseFloat(n.nota) || 0);
            const promT = tareas.length > 0 ? tareas.reduce((a, b) => a + b, 0) / tareas.length : 0;

            const proj = notas.filter(n => n.tipo === 'proyecto');
            let proyF = 0;
            if (proj.length > 0) {
                const nP = parseFloat(proj.find(p => p.indice === 0)?.nota) || 0;
                const dr = parseFloat(proj.find(p => p.indice === 1)?.nota) || 0;
                const pr = parseFloat(proj.find(p => p.indice === 2)?.nota) || 0;
                proyF = Math.max(nP, (nP + dr + pr) / 3);
            }

            const exm = notas.filter(n => n.tipo === 'examen');
            let exaF = 0;
            if (exm.length > 0) {
                const nE = parseFloat(exm.find(e => e.indice === 0)?.nota) || 0;
                const dre = parseFloat(exm.find(e => e.indice === 1)?.nota) || 0;
                const er = parseFloat(exm.find(e => e.indice === 2)?.nota) || 0;
                exaF = Math.max(nE, (nE + dre + er) / 3);
            }

            const notaFinal = (promT * pctT + proyF * pctP + exaF * pctE) / 100;
            detalle = `Nota Final en Clase hasta la fecha: ${notaFinal.toFixed(2)}`;
        } else {
            detalle = 'Le solicitamos revisar el progreso del estudiante.';
        }

        res.json({ ...info, detalle });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Registrar mensaje enviado
router.post('/whatsapp/registrar', async (req, res) => {
    const db = req.db;
    const { estudiante, representante, telefono, grupo_nombre, materia_nombre, profesor, tipo, mensaje } = req.body;
    try {
        await db.query(
            'INSERT INTO mensajes_whatsapp (estudiante, representante, telefono, grupo_nombre, materia_nombre, profesor, tipo, mensaje) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [estudiante, representante || '', telefono || '', grupo_nombre || '', materia_nombre || '', profesor || '', tipo || 'general', mensaje || '']
        );
        res.json({ message: 'Mensaje registrado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Historial de mensajes enviados
router.get('/whatsapp/historial', async (req, res) => {
    const db = req.db;
    const { fecha_inicio, fecha_fin, tipo, busqueda, materia } = req.query;
    try {
        let query = 'SELECT * FROM mensajes_whatsapp WHERE 1=1';
        const params = [];
        if (fecha_inicio) {
            query += ' AND DATE(enviado_at) >= ?';
            params.push(fecha_inicio);
        }
        if (fecha_fin) {
            query += ' AND DATE(enviado_at) <= ?';
            params.push(fecha_fin);
        }
        if (tipo) {
            query += ' AND tipo = ?';
            params.push(tipo);
        }
        if (materia) {
            query += ' AND grupo_nombre = ?';
            params.push(materia);
        }
        if (busqueda) {
            query += ' AND (estudiante LIKE ? OR representante LIKE ? OR grupo_nombre LIKE ?)';
            const b = `%${busqueda}%`;
            params.push(b, b, b);
        }
        query += ' ORDER BY enviado_at DESC';
        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;