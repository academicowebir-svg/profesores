const express = require('express');
const router = express.Router();

// Vista principal de administracion de usuarios
router.get('/view', async (req, res) => {
    try {
        const db = req.app.get('masterPool');
        const user = req.session.user;
        const [usuarios] = await db.query(
            'SELECT id, cedula, nombre, password, estado, rol, school_id, created_at FROM usuarios WHERE school_id = ? ORDER BY id',
            [user.school_id]
        );
        const [schools] = await db.query('SELECT id, nombre FROM schools ORDER BY nombre');
        res.render('admin', { usuarios, schools, user });
    } catch (err) {
        console.error('Error al listar usuarios:', err);
        res.status(500).send('Error del servidor');
    }
});

// Agregar usuario
router.post('/agregar', async (req, res) => {
    try {
        const { cedula, password, nombre, rol, school_id } = req.body;
        const db = req.app.get('masterPool');
        const user = req.session.user;

        const [existente] = await db.query('SELECT id FROM usuarios WHERE cedula = ?', [cedula]);
        if (existente.length > 0) {
            return res.status(400).json({ success: false, message: 'La cedula ya esta registrada' });
        }

        await db.query(
            'INSERT INTO usuarios (cedula, password, nombre, estado, rol, school_id) VALUES (?, ?, ?, 1, ?, ?)',
            [cedula, password, nombre, rol || 'docente', school_id || user.school_id]
        );
        res.json({ success: true, message: 'Usuario agregado correctamente' });
    } catch (err) {
        console.error('Error al agregar usuario:', err);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

// Editar usuario
router.put('/editar/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, password, estado, rol, school_id } = req.body;
        const db = req.app.get('masterPool');

        let query = 'UPDATE usuarios SET nombre = ?, estado = ?, rol = ?, school_id = ?';
        let params = [
            nombre,
            estado === 'on' || estado === 1 ? 1 : 0,
            rol || 'docente',
            school_id || null
        ];

        if (password && password.trim() !== '') {
            query += ', password = ?';
            params.push(password);
        }

        query += ' WHERE id = ?';
        params.push(id);

        await db.query(query, params);
        res.json({ success: true, message: 'Usuario actualizado correctamente' });
    } catch (err) {
        console.error('Error al editar usuario:', err);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

// Eliminar usuario
router.delete('/eliminar/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = req.app.get('masterPool');

        if (String(id) === String(req.session.user.id)) {
            return res.status(400).json({ success: false, message: 'No puede eliminarse a si mismo' });
        }

        await db.query('DELETE FROM usuarios WHERE id = ?', [id]);
        res.json({ success: true, message: 'Usuario eliminado correctamente' });
    } catch (err) {
        console.error('Error al eliminar usuario:', err);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

module.exports = router;
