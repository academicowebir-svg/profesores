const express = require('express');
const router = express.Router();

router.get('/view', (req, res) => {
    res.render('recuperacion');
});

// Materias del docente
router.get('/materias', async (req, res) => {
    const db = req.db;
    const user = req.session.user;
    try {
        const [rows] = await db.query(
            'SELECT id, nombre_materia, curso, paralelo, especialidad FROM materias WHERE docente_id = ? AND school_id = ?',
            [user.id, user.school_id]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Estudiantes de una materia
router.get('/materias/:materia_id/estudiantes', async (req, res) => {
    const db = req.db;
    const user = req.session.user;
    try {
        const [rows] = await db.query(`
            SELECT DISTINCT e.id, e.cedula, e.nombres_apellidos, e.discapacidad
            FROM grupos g
            INNER JOIN estudiantes e ON g.estudiante_id = e.id AND e.activo = 1
            WHERE g.materia_id = ? AND g.materia_id IN (SELECT id FROM materias WHERE docente_id = ?)
            ORDER BY e.nombres_apellidos
        `, [req.params.materia_id, user.id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ========== PLANES DE REFUERZO ==========

router.get('/planes', async (req, res) => {
    const db = req.db;
    const user = req.session.user;
    const { materia_id } = req.query;
    try {
        let query = `
            SELECT p.*, e.nombres_apellidos, e.cedula, m.nombre_materia, m.curso, m.paralelo
            FROM planes_refuerzo p
            INNER JOIN estudiantes e ON p.estudiante_id = e.id
            INNER JOIN materias m ON p.materia_id = m.id
            WHERE p.docente_id = ?
        `;
        const params = [user.id];
        if (materia_id) {
            query += ' AND p.materia_id = ?';
            params.push(materia_id);
        }
        query += ' ORDER BY p.created_at DESC';
        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/planes', async (req, res) => {
    const db = req.db;
    const user = req.session.user;
    const { estudiante_id, materia_id, trimestre, estrategia, objetivos, recursos, actividades, fecha_inicio, fecha_fin } = req.body;
    try {
        await db.query(
            `INSERT INTO planes_refuerzo (estudiante_id, materia_id, docente_id, trimestre, estrategia, objetivos, recursos, actividades, fecha_inicio, fecha_fin, school_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [estudiante_id, materia_id, user.id, trimestre || 1, estrategia, objetivos, recursos, actividades, fecha_inicio, fecha_fin, user.school_id]
        );
        res.json({ message: 'Plan de refuerzo creado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/planes/:id', async (req, res) => {
    const db = req.db;
    const user = req.session.user;
    const { estrategia, objetivos, recursos, actividades, fecha_inicio, fecha_fin, estado } = req.body;
    try {
        await db.query(
            `UPDATE planes_refuerzo SET estrategia = ?, objetivos = ?, recursos = ?, actividades = ?, fecha_inicio = ?, fecha_fin = ?, estado = ?
             WHERE id = ? AND docente_id = ? AND school_id = ?`,
            [estrategia, objetivos, recursos, actividades, fecha_inicio, fecha_fin, estado, req.params.id, user.id, user.school_id]
        );
        res.json({ message: 'Plan actualizado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/planes/:id', async (req, res) => {
    const db = req.db;
    const user = req.session.user;
    try {
        await db.query('DELETE FROM planes_refuerzo WHERE id = ? AND docente_id = ? AND school_id = ?', [req.params.id, user.id, user.school_id]);
        res.json({ message: 'Plan eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Estudiantes con plan de refuerzo en una materia
router.get('/materias/:materia_id/estudiantes-con-plan', async (req, res) => {
    const db = req.db;
    const user = req.session.user;
    try {
        const [rows] = await db.query(`
            SELECT DISTINCT e.id, e.cedula, e.nombres_apellidos, e.discapacidad
            FROM planes_refuerzo p
            INNER JOIN estudiantes e ON p.estudiante_id = e.id AND e.activo = 1
            WHERE p.materia_id = ? AND p.docente_id = ? AND p.estado = 'en_progreso'
            ORDER BY e.nombres_apellidos
        `, [req.params.materia_id, user.id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ========== ASISTENCIA RECUPERACION ==========

router.get('/asistencia', async (req, res) => {
    const db = req.db;
    const user = req.session.user;
    const { materia_id, fecha } = req.query;
    try {
        let query = `
            SELECT a.*, e.nombres_apellidos, e.cedula, m.nombre_materia
            FROM asistencia_recuperacion a
            INNER JOIN estudiantes e ON a.estudiante_id = e.id
            INNER JOIN materias m ON a.materia_id = m.id
            WHERE a.docente_id = ?
        `;
        const params = [user.id];
        if (materia_id) {
            query += ' AND a.materia_id = ?';
            params.push(materia_id);
        }
        if (fecha) {
            query += ' AND a.fecha = ?';
            params.push(fecha);
        }
        query += ' ORDER BY a.fecha DESC, e.nombres_apellidos';
        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/asistencia', async (req, res) => {
    const db = req.db;
    const user = req.session.user;
    const { estudiante_id, materia_id, fecha, estado, observaciones } = req.body;
    try {
        await db.query(
            `INSERT INTO asistencia_recuperacion (estudiante_id, materia_id, docente_id, fecha, estado, observaciones, school_id)
             VALUES (?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE estado = VALUES(estado), observaciones = VALUES(observaciones)`,
            [estudiante_id, materia_id, user.id, fecha, estado || 'presente', observaciones, user.school_id]
        );
        res.json({ message: 'Asistencia registrada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/asistencia/batch', async (req, res) => {
    const db = req.db;
    const user = req.session.user;
    const { materia_id, fecha, registros } = req.body;
    try {
        for (const r of registros) {
            await db.query(
                `INSERT INTO asistencia_recuperacion (estudiante_id, materia_id, docente_id, fecha, estado, observaciones, school_id)
                 VALUES (?, ?, ?, ?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE estado = VALUES(estado), observaciones = VALUES(observaciones)`,
                [r.estudiante_id, materia_id, user.id, fecha, r.estado || 'presente', r.observaciones || '', user.school_id]
            );
        }
        res.json({ message: 'Asistencia guardada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ========== EVALUACIONES RECUPERACION ==========

router.get('/evaluaciones', async (req, res) => {
    const db = req.db;
    const user = req.session.user;
    const { materia_id } = req.query;
    try {
        let query = `
            SELECT ev.*, e.nombres_apellidos, e.cedula, m.nombre_materia
            FROM evaluaciones_recuperacion ev
            INNER JOIN estudiantes e ON ev.estudiante_id = e.id
            INNER JOIN materias m ON ev.materia_id = m.id
            WHERE ev.docente_id = ?
        `;
        const params = [user.id];
        if (materia_id) {
            query += ' AND ev.materia_id = ?';
            params.push(materia_id);
        }
        query += ' ORDER BY ev.fecha DESC, e.nombres_apellidos';
        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/evaluaciones', async (req, res) => {
    const db = req.db;
    const user = req.session.user;
    const { estudiante_id, materia_id, fecha, tipo, valoracion, nota, observaciones } = req.body;
    try {
        await db.query(
            `INSERT INTO evaluaciones_recuperacion (estudiante_id, materia_id, docente_id, fecha, tipo, valoracion, nota, observaciones, school_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [estudiante_id, materia_id, user.id, fecha, tipo || 'recuperacion', valoracion, nota, observaciones, user.school_id]
        );
        res.json({ message: 'Evaluacion registrada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/evaluaciones/:id', async (req, res) => {
    const db = req.db;
    const user = req.session.user;
    const { fecha, tipo, valoracion, nota, observaciones } = req.body;
    try {
        await db.query(
            `UPDATE evaluaciones_recuperacion SET fecha = ?, tipo = ?, valoracion = ?, nota = ?, observaciones = ?
             WHERE id = ? AND docente_id = ? AND school_id = ?`,
            [fecha, tipo, valoracion, nota, observaciones, req.params.id, user.id, user.school_id]
        );
        res.json({ message: 'Evaluacion actualizada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/evaluaciones/:id', async (req, res) => {
    const db = req.db;
    const user = req.session.user;
    try {
        await db.query('DELETE FROM evaluaciones_recuperacion WHERE id = ? AND docente_id = ? AND school_id = ?', [req.params.id, user.id, user.school_id]);
        res.json({ message: 'Evaluacion eliminada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
