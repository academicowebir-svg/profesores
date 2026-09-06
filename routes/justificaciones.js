const express = require('express');
const router = express.Router();

router.get('/view', (req, res) => {
    res.render('justificaciones', { user: req.session.user });
});

// Buscar estudiantes por cedula o nombre
router.get('/buscar-estudiante', async (req, res) => {
    const db = req.db;
    const { q } = req.query;
    try {
        const searchTerm = `%${q}%`;
        const [rows] = await db.query(
            `SELECT id, cedula, nombres_apellidos, curso, paralelo, especialidad, discapacidad
             FROM estudiantes
             WHERE (cedula LIKE ? OR nombres_apellidos LIKE ?) AND activo = 1
             ORDER BY nombres_apellidos
             LIMIT 20`,
            [searchTerm, searchTerm]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener faltas de un estudiante en una fecha
router.get('/faltas/:estudiante_id', async (req, res) => {
    const db = req.db;
    const { estudiante_id } = req.params;
    const { fecha } = req.query;
    const fechaConsulta = fecha || new Date().toISOString().split('T')[0];
    try {
        const [rows] = await db.query(`
            SELECT a.id as asistencia_id, a.fecha, a.estado, a.comentario,
                   g.nombre_grupo, m.nombre_materia, m.curso, m.paralelo, m.especialidad,
                   j.id as justificacion_id, j.motivo, j.justificado_por, j.fecha_justificacion
            FROM asistencias a
            INNER JOIN grupos g ON a.grupo_id = g.id
            INNER JOIN materias m ON g.materia_id = m.id
            LEFT JOIN justificaciones j ON j.asistencia_id = a.id
            WHERE g.estudiante_id = ? AND a.fecha = ? AND a.estado != 'presente'
            ORDER BY m.nombre_materia
        `, [estudiante_id, fechaConsulta]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener historial de justificaciones de un estudiante
router.get('/historial/:estudiante_id', async (req, res) => {
    const db = req.db;
    const { estudiante_id } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT j.*, a.fecha as fecha_falta, a.estado,
                   g.nombre_grupo, m.nombre_materia
            FROM justificaciones j
            INNER JOIN asistencias a ON j.asistencia_id = a.id
            INNER JOIN grupos g ON a.grupo_id = g.id
            INNER JOIN materias m ON g.materia_id = m.id
            WHERE j.estudiante_id = ?
            ORDER BY j.created_at DESC
        `, [estudiante_id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Crear justificacion
router.post('/', async (req, res) => {
    const db = req.db;
    const user = req.session.user;
    const { asistencia_id, estudiante_id, motivo } = req.body;
    try {
        const [existe] = await db.query(
            'SELECT id FROM justificaciones WHERE asistencia_id = ?',
            [asistencia_id]
        );
        if (existe.length > 0) {
            return res.status(400).json({ error: 'Esta falta ya tiene una justificacion' });
        }
        await db.query(
            `INSERT INTO justificaciones (asistencia_id, estudiante_id, motivo, justificado_por, school_id)
             VALUES (?, ?, ?, ?, ?)`,
            [asistencia_id, estudiante_id, motivo, user.nombre, user.school_id]
        );
        res.json({ message: 'Justificacion registrada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Justificar todo el dia (todas las faltas de un estudiante en una fecha)
router.post('/dia', async (req, res) => {
    const db = req.db;
    const user = req.session.user;
    const { estudiante_id, fecha, motivo } = req.body;
    const fechaConsulta = fecha || new Date().toISOString().split('T')[0];
    try {
        const [faltas] = await db.query(`
            SELECT a.id as asistencia_id
            FROM asistencias a
            INNER JOIN grupos g ON a.grupo_id = g.id
            LEFT JOIN justificaciones j ON j.asistencia_id = a.id
            WHERE g.estudiante_id = ? AND a.fecha = ? AND a.estado != 'presente' AND j.id IS NULL
        `, [estudiante_id, fechaConsulta]);
        if (faltas.length === 0) {
            return res.status(400).json({ error: 'No hay faltas sin justificar en esta fecha' });
        }
        let justificadas = 0;
        for (const f of faltas) {
            await db.query(
                `INSERT IGNORE INTO justificaciones (asistencia_id, estudiante_id, motivo, justificado_por, school_id)
                 VALUES (?, ?, ?, ?, ?)`,
                [f.asistencia_id, estudiante_id, motivo, user.nombre, user.school_id]
            );
            justificadas++;
        }
        res.json({ message: `${justificadas} falta(s) justificada(s)` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar justificacion
router.delete('/:id', async (req, res) => {
    const db = req.db;
    try {
        await db.query('DELETE FROM justificaciones WHERE id = ?', [req.params.id]);
        res.json({ message: 'Justificacion eliminada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
