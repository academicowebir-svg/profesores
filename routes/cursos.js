const express = require('express');
const router = express.Router();

// Listar cursos de la escuela
router.get('/', async (req, res) => {
    try {
        const db = req.db;
        const schoolId = req.session.user.school_id;
        const [rows] = await db.query(
            'SELECT * FROM cursos WHERE school_id = ? ORDER BY nombre',
            [schoolId]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Crear curso
router.post('/', async (req, res) => {
    try {
        const db = req.db;
        const schoolId = req.session.user.school_id;
        const { nombre, paralelos, especialidades } = req.body;
        if (!nombre) return res.status(400).json({ error: 'Nombre del curso requerido' });

        const [existente] = await db.query(
            'SELECT id FROM cursos WHERE nombre = ? AND school_id = ?',
            [nombre, schoolId]
        );
        if (existente.length > 0) {
            return res.status(400).json({ error: 'Este curso ya existe' });
        }

        const [result] = await db.query(
            'INSERT INTO cursos (nombre, paralelos, especialidades, school_id) VALUES (?, ?, ?, ?)',
            [nombre, paralelos || 'A,B', especialidades || '', schoolId]
        );
        res.json({ id: result.insertId, message: 'Curso creado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Actualizar curso
router.put('/:id', async (req, res) => {
    try {
        const db = req.db;
        const schoolId = req.session.user.school_id;
        const { nombre, paralelos, especialidades, activo } = req.body;
        await db.query(
            'UPDATE cursos SET nombre = ?, paralelos = ?, especialidades = ?, activo = ? WHERE id = ? AND school_id = ?',
            [nombre, paralelos, especialidades, activo !== undefined ? activo : 1, req.params.id, schoolId]
        );
        res.json({ message: 'Curso actualizado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Activar/desactivar curso
router.put('/:id/toggle', async (req, res) => {
    try {
        const db = req.db;
        const schoolId = req.session.user.school_id;
        await db.query(
            'UPDATE cursos SET activo = NOT activo WHERE id = ? AND school_id = ?',
            [req.params.id, schoolId]
        );
        res.json({ message: 'Estado actualizado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar curso
router.delete('/:id', async (req, res) => {
    try {
        const db = req.db;
        const schoolId = req.session.user.school_id;
        await db.query(
            'DELETE FROM cursos WHERE id = ? AND school_id = ?',
            [req.params.id, schoolId]
        );
        res.json({ message: 'Curso eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
