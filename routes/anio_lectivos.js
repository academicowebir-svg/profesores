const express = require('express');
const router = express.Router();

// Renderizar vista
router.get('/view', (req, res) => {
    res.render('anio_lectivos');
});

// Listar años lectivos de la escuela
router.get('/', async (req, res) => {
    try {
        const db = req.db;
        const schoolId = req.session.user.school_id;
        const [rows] = await db.query(
            'SELECT * FROM anio_lectivos WHERE school_id = ? ORDER BY anio DESC',
            [schoolId]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Crear año lectivo
router.post('/', async (req, res) => {
    try {
        const db = req.db;
        const schoolId = req.session.user.school_id;
        const { anio } = req.body;
        if (!anio) return res.status(400).json({ error: 'Año lectivo requerido' });

        const [existente] = await db.query(
            'SELECT id FROM anio_lectivos WHERE anio = ? AND school_id = ?',
            [anio, schoolId]
        );
        if (existente.length > 0) {
            return res.status(400).json({ error: 'Este año lectivo ya existe' });
        }

        const [result] = await db.query(
            'INSERT INTO anio_lectivos (anio, school_id, activo) VALUES (?, ?, 1)',
            [anio, schoolId]
        );
        res.json({ id: result.insertId, message: 'Año lectivo creado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Activar/desactivar año lectivo
router.put('/:id/toggle', async (req, res) => {
    try {
        const db = req.db;
        const schoolId = req.session.user.school_id;
        await db.query(
            'UPDATE anio_lectivos SET activo = NOT activo WHERE id = ? AND school_id = ?',
            [req.params.id, schoolId]
        );
        res.json({ message: 'Estado actualizado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar año lectivo
router.delete('/:id', async (req, res) => {
    try {
        const db = req.db;
        const schoolId = req.session.user.school_id;
        await db.query(
            'DELETE FROM anio_lectivos WHERE id = ? AND school_id = ?',
            [req.params.id, schoolId]
        );
        res.json({ message: 'Año lectivo eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
