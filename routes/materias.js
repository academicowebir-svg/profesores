const express = require('express');
const router = express.Router();

// Listar materias (filtradas por docente si es docente)
router.get('/', async (req, res) => {
    const db = req.db;
    const user = req.session.user;
    try {
        let query = 'SELECT * FROM materias';
        const params = [];
        if (user.rol === 'docente') {
            query += ' WHERE docente_id = ?';
            params.push(user.id);
        }
        query += ' ORDER BY nombre_materia';
        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Renderizar vista de materias
router.get('/view', (req, res) => {
    res.render('materias');
});

// Obtener una materia por ID
router.get('/:id', async (req, res) => {
    const db = req.db;
    try {
        const [rows] = await db.query('SELECT * FROM materias WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Materia no encontrada' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Crear nueva materia (solo rector/admin)
router.post('/', async (req, res) => {
    const db = req.db;
    const user = req.session.user;
    if (!['rector', 'admin'].includes(user.rol)) {
        return res.status(403).json({ error: 'Solo el rector puede crear materias' });
    }
    const { nombre_materia, curso, paralelo, especialidad, docente_id } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO materias (nombre_materia, curso, paralelo, especialidad, docente_id, school_id) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre_materia, curso, paralelo, especialidad || null, docente_id || null, user.school_id]
        );
        res.json({ id: result.insertId, message: 'Materia registrada exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Actualizar materia (solo rector/admin)
router.put('/:id', async (req, res) => {
    const db = req.db;
    const user = req.session.user;
    if (!['rector', 'admin'].includes(user.rol)) {
        return res.status(403).json({ error: 'Solo el rector puede editar materias' });
    }
    const { nombre_materia, curso, paralelo, especialidad, docente_id } = req.body;
    try {
        await db.query(
            'UPDATE materias SET nombre_materia = ?, curso = ?, paralelo = ?, especialidad = ?, docente_id = ? WHERE id = ? AND school_id = ?',
            [nombre_materia, curso, paralelo, especialidad || null, docente_id || null, req.params.id, user.school_id]
        );
        res.json({ message: 'Materia actualizada exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar materia (solo rector/admin)
router.delete('/:id', async (req, res) => {
    const db = req.db;
    const user = req.session.user;
    if (!['rector', 'admin'].includes(user.rol)) {
        return res.status(403).json({ error: 'Solo el rector puede eliminar materias' });
    }
    try {
        await db.query('DELETE FROM materias WHERE id = ? AND school_id = ?', [req.params.id, user.school_id]);
        res.json({ message: 'Materia eliminada exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
