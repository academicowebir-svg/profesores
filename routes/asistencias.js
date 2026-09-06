const express = require('express');
const router = express.Router();


// Renderizar vista de asistencias
router.get('/view', (req, res) => {
    const db = req.db;
    res.render('asistencias');
});

// Obtener asistencias de una semana para un grupo (todos los estudiantes del grupo)
router.get('/semana/:grupo_id', async (req, res) => {
    const db = req.db;
    const { grupo_id } = req.params;
    const { fechas } = req.query;
    try {
        const [grupoInfo] = await db.query(
            'SELECT nombre_grupo, materia_id FROM grupos WHERE id = ? LIMIT 1',
            [grupo_id]
        );
        if (grupoInfo.length === 0) return res.json([]);

        let dateFilter = '';
        const params = [grupoInfo[0].nombre_grupo, grupoInfo[0].materia_id];
        if (fechas) {
            const fechaArray = fechas.split(',');
            const placeholders = fechaArray.map(() => '?').join(', ');
            dateFilter = ` AND a.fecha IN (${placeholders})`;
            fechaArray.forEach(f => params.push(f));
        }

        const [rows] = await db.query(`
            SELECT a.id, a.grupo_id, a.fecha, a.estado, a.comentario, e.id as estudiante_id,
                   e.cedula, e.nombres_apellidos, e.discapacidad, e.activo
            FROM asistencias a
            INNER JOIN grupos g ON a.grupo_id = g.id
            INNER JOIN estudiantes e ON g.estudiante_id = e.id
            WHERE g.nombre_grupo = ? AND g.materia_id = ?
            ${dateFilter}
            ORDER BY e.nombres_apellidos, a.fecha
        `, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Guardar asistencia para una semana
router.post('/semana', async (req, res) => {
    const db = req.db;
    const { asistencias } = req.body;
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        for (const item of asistencias) {
            await conn.query(
                'INSERT INTO asistencias (grupo_id, fecha, estado, comentario) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE estado = VALUES(estado), comentario = VALUES(comentario)',
                [item.grupo_id, item.fecha, item.estado, item.comentario || null]
            );
        }
        await conn.commit();
        res.json({ message: `Asistencias registradas: ${asistencias.length} registros` });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        conn.release();
    }
});

// Registrar asistencia para un estudiante en una fecha
router.post('/', async (req, res) => {
    const db = req.db;
    const { grupo_id, fecha, estado } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO asistencias (grupo_id, fecha, estado) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE estado = ?',
            [grupo_id, fecha, estado, estado]
        );
        res.json({ id: result.insertId, message: 'Asistencia registrada exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Actualizar comentario de asistencia
router.put('/comentario', async (req, res) => {
    const db = req.db;
    const { grupo_id, fecha, comentario } = req.body;
    try {
        await db.query(
            'UPDATE asistencias SET comentario = ? WHERE grupo_id = ? AND fecha = ?',
            [comentario || null, grupo_id, fecha]
        );
        res.json({ message: 'Comentario guardado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Registrar asistencia para todos los estudiantes de un grupo en una fecha
router.post('/grupo', async (req, res) => {
    const db = req.db;
    const { grupo_id, fecha, asistencias } = req.body;
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        for (const item of asistencias) {
            await conn.query(
                'INSERT INTO asistencias (grupo_id, fecha, estado) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE estado = ?',
                [item.grupo_id, fecha, item.estado, item.estado]
            );
        }
        await conn.commit();
        res.json({ message: 'Asistencias registradas exitosamente' });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        conn.release();
    }
});

// Buscar asistencia de un estudiante por cedula o nombre (todas las materias) - ANTES de /:grupo_id
router.get('/buscar-estudiante', async (req, res) => {
    const db = req.db;
    const user = req.session.user;
    const anio = user.anio_lectivo || '2026-2027';
    const { busqueda } = req.query;
    if (!busqueda) {
        return res.json([]);
    }
    try {
        const [rows] = await db.query(`
            SELECT a.id, a.fecha, a.estado, a.grupo_id,
                   e.cedula, e.nombres_apellidos, e.discapacidad,
                   m.nombre_materia, m.curso, m.paralelo, m.especialidad,
                   j.id as justificacion_id, j.motivo
            FROM asistencias a
            INNER JOIN grupos g ON a.grupo_id = g.id
            INNER JOIN materias m ON g.materia_id = m.id
            INNER JOIN estudiantes e ON g.estudiante_id = e.id
            LEFT JOIN justificaciones j ON j.asistencia_id = a.id
            WHERE g.anio_lectivo = ? AND (e.cedula LIKE ? OR e.nombres_apellidos LIKE ?)
            ORDER BY m.nombre_materia, a.fecha
        `, [anio, `%${busqueda}%`, `%${busqueda}%`]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener asistencias por grupo y rango de fechas
router.get('/grupo/:grupo_id', async (req, res) => {
    const db = req.db;
    const { grupo_id } = req.params;
    const { fecha_inicio, fecha_fin } = req.query;
    try {
        let query = `
            SELECT a.id, a.grupo_id, a.fecha, a.estado, e.id as estudiante_id,
                   e.cedula, e.nombres_apellidos, m.nombre_materia, m.curso, m.paralelo
            FROM asistencias a
            INNER JOIN grupos g ON a.grupo_id = g.id
            INNER JOIN estudiantes e ON g.estudiante_id = e.id
            INNER JOIN materias m ON g.materia_id = m.id
            WHERE a.grupo_id IN (
                SELECT id FROM grupos WHERE nombre_grupo = (
                    SELECT nombre_grupo FROM grupos WHERE id = ? LIMIT 1
                ) AND materia_id = (
                    SELECT materia_id FROM grupos WHERE id = ? LIMIT 1
                )
            )
        `;
        const params = [grupo_id, grupo_id];
        if (fecha_inicio && fecha_fin) {
            query += ' AND a.fecha BETWEEN ? AND ?';
            params.push(fecha_inicio, fecha_fin);
        }
        query += ' ORDER BY e.nombres_apellidos, a.fecha';
        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener faltas agrupadas por curso (todas las materias del periodo)
router.get('/faltas-por-curso', async (req, res) => {
    const db = req.db;
    const user = req.session.user;
    const anio = user.anio_lectivo || '2026-2027';
    try {
        const [rows] = await db.query(`
            SELECT 
                m.nombre_materia,
                m.curso,
                m.paralelo,
                m.especialidad,
                e.cedula,
                e.nombres_apellidos,
                e.discapacidad,
                COUNT(CASE WHEN a.estado = 'ausente' AND j.id IS NULL THEN 1 END) as total_faltas,
                COUNT(CASE WHEN a.estado = 'presente' OR j.id IS NOT NULL THEN 1 END) as total_asistencias
            FROM grupos g
            INNER JOIN materias m ON g.materia_id = m.id
            INNER JOIN estudiantes e ON g.estudiante_id = e.id
            LEFT JOIN asistencias a ON a.grupo_id = g.id
            LEFT JOIN justificaciones j ON j.asistencia_id = a.id
            WHERE g.anio_lectivo = ?
            GROUP BY m.nombre_materia, m.curso, m.paralelo, m.especialidad, e.cedula, e.nombres_apellidos
            HAVING total_faltas > 0
            ORDER BY m.nombre_materia, e.nombres_apellidos
        `, [anio]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener asistencias de un grupo - DESPUES de las rutas especificas
router.get('/:grupo_id', async (req, res) => {
    const db = req.db;
    try {
        const [rows] = await db.query(`
            SELECT a.id, a.fecha, a.estado, e.cedula, e.nombres_apellidos, e.discapacidad,
                   g.id as grupo_id
            FROM asistencias a
            INNER JOIN grupos g ON a.grupo_id = g.id
            INNER JOIN estudiantes e ON g.estudiante_id = e.id
            WHERE a.grupo_id = ?
            ORDER BY a.fecha, e.nombres_apellidos
        `, [req.params.grupo_id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
