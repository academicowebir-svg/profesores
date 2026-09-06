const express = require('express');
const router = express.Router();


// Listar todos los estudiantes
router.get('/', async (req, res) => {
    const db = req.db;
    try {
        const [rows] = await db.query('SELECT * FROM estudiantes ORDER BY nombres_apellidos');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Renderizar vista de estudiantes
router.get('/view', (req, res) => {
    const db = req.db;
    res.render('estudiantes');
});

// Buscar estudiante por cédula
router.get('/cedula/:cedula', async (req, res) => {
    const db = req.db;
    try {
        const [rows] = await db.query('SELECT * FROM estudiantes WHERE cedula = ?', [req.params.cedula]);
        if (rows.length === 0) return res.status(404).json({ error: 'Estudiante no encontrado' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Activar/Inactivar estudiante
router.put('/:id/activo', async (req, res) => {
    const db = req.db;
    try {
        await db.query('UPDATE estudiantes SET activo = ? WHERE id = ?', [req.body.activo, req.params.id]);
        res.json({ message: 'Estado actualizado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener un estudiante por ID
router.get('/:id', async (req, res) => {
    const db = req.db;
    try {
        const [rows] = await db.query('SELECT * FROM estudiantes WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Estudiante no encontrado' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Crear nuevo estudiante
router.post('/', async (req, res) => {
    const db = req.db;
    const { cedula, nombres_apellidos, telefono_representante, sexo, correo_electronico, representante, especialidad, curso, paralelo, discapacidad } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO estudiantes (cedula, nombres_apellidos, telefono_representante, sexo, correo_electronico, representante, especialidad, curso, paralelo, discapacidad) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [cedula, nombres_apellidos, telefono_representante, sexo, correo_electronico, representante, especialidad, curso, paralelo, discapacidad || 'NO']
        );
        res.json({ id: result.insertId, message: 'Estudiante registrado exitosamente' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ error: 'La cédula ya está registrada' });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
});

// Actualizar estudiante
router.put('/:id', async (req, res) => {
    const db = req.db;
    const { cedula, nombres_apellidos, telefono_representante, sexo, correo_electronico, representante, especialidad, curso, paralelo, discapacidad } = req.body;
    try {
        await db.query(
            'UPDATE estudiantes SET cedula = ?, nombres_apellidos = ?, telefono_representante = ?, sexo = ?, correo_electronico = ?, representante = ?, especialidad = ?, curso = ?, paralelo = ?, discapacidad = ? WHERE id = ?',
            [cedula, nombres_apellidos, telefono_representante, sexo, correo_electronico, representante, especialidad, curso, paralelo, discapacidad || 'NO', req.params.id]
        );
        res.json({ message: 'Estudiante actualizado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar todos los estudiantes
router.delete('/eliminar-todos', async (req, res) => {
    const db = req.db;
    try {
        const [result] = await db.query('DELETE FROM estudiantes');
        res.json({ message: `${result.affectedRows} estudiantes eliminados` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar estudiante
router.delete('/:id', async (req, res) => {
    const db = req.db;
    try {
        await db.query('DELETE FROM estudiantes WHERE id = ?', [req.params.id]);
        res.json({ message: 'Estudiante eliminado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Importar estudiantes desde Excel
router.post('/importar', async (req, res) => {
    const db = req.db;
    const { estudiantes } = req.body;
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        let insertados = 0, duplicados = 0;
        for (const est of estudiantes) {
            try {
                await conn.query(
                    'INSERT INTO estudiantes (cedula, nombres_apellidos, sexo, correo_electronico, representante, telefono_representante, especialidad, curso, paralelo, discapacidad) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [est.cedula, est.nombres_apellidos, est.sexo, est.correo_electronico || null, est.representante || null, est.telefono_representante || null, est.especialidad || null, est.curso || null, est.paralelo || null, est.discapacidad || 'NO']
                );
                insertados++;
            } catch (err) {
                if (err.code === 'ER_DUP_ENTRY') duplicados++;
                else throw err;
            }
        }
        await conn.commit();
        res.json({ message: `Importados: ${insertados}, Duplicados omitidos: ${duplicados}` });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        conn.release();
    }
});

module.exports = router;