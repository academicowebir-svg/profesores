const express = require('express');
const router = express.Router();

router.get('/view', (req, res) => {
    res.render('diagnostico');
});

router.get('/materias', async (req, res) => {
    const db = req.db;
    const user = req.session.user;
    try {
        let query = `
            SELECT DISTINCT m.id, m.nombre_materia, m.curso, m.paralelo, m.especialidad, m.docente_id
            FROM materias m
            INNER JOIN grupos g ON m.id = g.materia_id
        `;
        const params = [];
        if (user.rol === 'docente') {
            query += ' WHERE m.docente_id = ?';
            params.push(user.id);
        }
        query += ' ORDER BY m.nombre_materia, m.curso, m.paralelo';
        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/curso/:curso/paralelo/:paralelo/materia/:materia_id/estudiantes', async (req, res) => {
    const db = req.db;
    const { curso, paralelo, materia_id } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT DISTINCT e.id, e.cedula, e.nombres_apellidos, e.discapacidad, e.activo, g.id as grupo_id
            FROM estudiantes e
            INNER JOIN grupos g ON e.id = g.estudiante_id
            INNER JOIN materias m ON g.materia_id = m.id
            WHERE m.curso = ? AND m.paralelo = ? AND m.id = ?
            ORDER BY e.nombres_apellidos
        `, [curso, paralelo, materia_id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/grupo/:grupo_id/notas', async (req, res) => {
    const db = req.db;
    const { grupo_id } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT n.id, n.nota, n.fecha_registro, n.comentario, n.indice,
                   e.id as estudiante_id, e.cedula, e.nombres_apellidos
            FROM notas n
            INNER JOIN grupos g ON n.grupo_id = g.id
            INNER JOIN estudiantes e ON g.estudiante_id = e.id
            WHERE n.grupo_id = ? AND n.tipo = 'diagnostico'
            ORDER BY n.indice, e.nombres_apellidos
        `, [grupo_id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/grupo/:grupo_id/todas', async (req, res) => {
    const db = req.db;
    const { grupo_id } = req.params;
    try {
        const [grupoInfo] = await db.query(
            'SELECT nombre_grupo, materia_id FROM grupos WHERE id = ? LIMIT 1',
            [grupo_id]
        );
        if (grupoInfo.length === 0) {
            return res.status(404).json({ error: 'Grupo no encontrado' });
        }

        const [estudiantes] = await db.query(`
            SELECT e.id, e.cedula, e.nombres_apellidos, g.id as grupo_id
            FROM estudiantes e
            INNER JOIN grupos g ON e.id = g.estudiante_id
            WHERE g.nombre_grupo = ? AND g.materia_id = ? AND e.activo = 1
            ORDER BY e.nombres_apellidos
        `, [grupoInfo[0].nombre_grupo, grupoInfo[0].materia_id]);

        const [notas] = await db.query(`
            SELECT n.id, n.nota, n.fecha_registro, n.comentario, n.indice, n.grupo_id
            FROM notas n
            INNER JOIN grupos g ON n.grupo_id = g.id
            WHERE g.nombre_grupo = ? AND g.materia_id = ? AND n.tipo = 'diagnostico'
            ORDER BY n.indice
        `, [grupoInfo[0].nombre_grupo, grupoInfo[0].materia_id]);

        res.json({ estudiantes, notas });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/guardar', async (req, res) => {
    const db = req.db;
    const { notas } = req.body;
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        for (const item of notas) {
            if (item.nota !== null && item.nota !== undefined && item.nota !== '') {
                await conn.query(`
                    INSERT INTO notas (grupo_id, trimestre, tipo, nota, fecha_registro, comentario, indice)
                    VALUES (?, ?, 'diagnostico', ?, CURDATE(), ?, ?)
                    ON DUPLICATE KEY UPDATE nota = VALUES(nota), comentario = VALUES(comentario)
                `, [item.grupo_id, 0, item.nota, item.comentario || null, item.indice || 0]);
            }
        }

        await conn.commit();
        res.json({ message: 'Notas de diagnóstico guardadas exitosamente' });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        conn.release();
    }
});

router.post('/agregar-indice', async (req, res) => {
    const db = req.db;
    const { grupo_ids, indice } = req.body;
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        for (const grupo_id of grupo_ids) {
            const [existing] = await conn.query(
                'SELECT id FROM notas WHERE grupo_id = ? AND tipo = ? AND indice = ?',
                [grupo_id, 'diagnostico', indice]
            );
            if (existing.length === 0) {
                await conn.query(
                    'INSERT INTO notas (grupo_id, trimestre, tipo, nota, fecha_registro, indice) VALUES (?, 0, ?, NULL, CURDATE(), ?)',
                    [grupo_id, 'diagnostico', indice]
                );
            }
        }

        await conn.commit();
        res.json({ message: 'Columna agregada' });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        conn.release();
    }
});

module.exports = router;
