const express = require('express');
const router = express.Router();

router.get('/view', (req, res) => {
    res.render('secretaria', { user: req.session.user });
});

router.get('/estudiantes', async (req, res) => {
    try {
        const db = req.db;
        const schoolId = req.session.user.school_id;
        const [rows] = await db.query(
            'SELECT * FROM estudiantes WHERE school_id = ? ORDER BY nombres_apellidos',
            [schoolId]
        );
        res.json(rows);
    } catch (err) {
        console.error('Error al listar estudiantes:', err);
        res.status(500).json({ error: err.message });
    }
});

router.post('/estudiantes', async (req, res) => {
    try {
        const db = req.db;
        const schoolId = req.session.user.school_id;
        const {
            cedula, nombres_apellidos, sexo, fecha_nacimiento, email,
            tipo_sangre, discapacidad, discapacidad_tipo,
            pais, provincia, ciudad, parroquia, direccion,
            representante, cedula_representante, telefono_representante,
            email_representante, lugar_trabajo_representante,
            anio_lectivo, curso, paralelo, especialidad
        } = req.body;

        const [existente] = await db.query(
            'SELECT id FROM estudiantes WHERE cedula = ? AND school_id = ?',
            [cedula, schoolId]
        );
        if (existente.length > 0) {
            return res.status(400).json({ error: 'La cedula ya esta registrada en esta escuela' });
        }

        let edad = null;
        if (fecha_nacimiento) {
            const hoy = new Date();
            const nac = new Date(fecha_nacimiento);
            edad = hoy.getFullYear() - nac.getFullYear();
            const m = hoy.getMonth() - nac.getMonth();
            if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
        }

        const [result] = await db.query(
            `INSERT INTO estudiantes (
                cedula, nombres_apellidos, sexo, fecha_nacimiento, edad, email,
                tipo_sangre, discapacidad, discapacidad_tipo,
                pais, provincia, ciudad, parroquia, direccion,
                representante, cedula_representante, telefono_representante,
                email_representante, lugar_trabajo_representante,
                anio_lectivo, curso, paralelo, especialidad, school_id
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [
                cedula, nombres_apellidos, sexo, fecha_nacimiento || null, edad, email || null,
                tipo_sangre || null, discapacidad || 'NO', discapacidad_tipo || null,
                pais || null, provincia || null, ciudad || null, parroquia || null, direccion || null,
                representante || null, cedula_representante || null, telefono_representante || null,
                email_representante || null, lugar_trabajo_representante || null,
                anio_lectivo || null, curso || null, paralelo || null, especialidad || null, schoolId
            ]
        );
        res.json({ message: 'Estudiante matriculado exitosamente', id: result.insertId });
    } catch (err) {
        console.error('Error al crear estudiante:', err);
        res.status(500).json({ error: err.message });
    }
});

router.put('/estudiantes/:id', async (req, res) => {
    try {
        const db = req.db;
        const schoolId = req.session.user.school_id;
        const { id } = req.params;
        const {
            cedula, nombres_apellidos, sexo, fecha_nacimiento, email,
            tipo_sangre, discapacidad, discapacidad_tipo,
            pais, provincia, ciudad, parroquia, direccion,
            representante, cedula_representante, telefono_representante,
            email_representante, lugar_trabajo_representante,
            anio_lectivo, curso, paralelo, especialidad, activo
        } = req.body;

        let edad = null;
        if (fecha_nacimiento) {
            const hoy = new Date();
            const nac = new Date(fecha_nacimiento);
            edad = hoy.getFullYear() - nac.getFullYear();
            const m = hoy.getMonth() - nac.getMonth();
            if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
        }

        await db.query(
            `UPDATE estudiantes SET
                cedula=?, nombres_apellidos=?, sexo=?, fecha_nacimiento=?, edad=?, email=?,
                tipo_sangre=?, discapacidad=?, discapacidad_tipo=?,
                pais=?, provincia=?, ciudad=?, parroquia=?, direccion=?,
                representante=?, cedula_representante=?, telefono_representante=?,
                email_representante=?, lugar_trabajo_representante=?,
                anio_lectivo=?, curso=?, paralelo=?, especialidad=?, activo=?
            WHERE id=? AND school_id=?`,
            [
                cedula, nombres_apellidos, sexo, fecha_nacimiento || null, edad, email || null,
                tipo_sangre || null, discapacidad || 'NO', discapacidad_tipo || null,
                pais || null, provincia || null, ciudad || null, parroquia || null, direccion || null,
                representante || null, cedula_representante || null, telefono_representante || null,
                email_representante || null, lugar_trabajo_representante || null,
                anio_lectivo || null, curso || null, paralelo || null, especialidad || null,
                activo !== undefined ? activo : 1, id, schoolId
            ]
        );
        res.json({ message: 'Estudiante actualizado exitosamente' });
    } catch (err) {
        console.error('Error al editar estudiante:', err);
        res.status(500).json({ error: err.message });
    }
});

router.delete('/estudiantes/:id', async (req, res) => {
    try {
        const db = req.db;
        const schoolId = req.session.user.school_id;
        const { id } = req.params;
        await db.query('DELETE FROM estudiantes WHERE id = ? AND school_id = ?', [id, schoolId]);
        res.json({ message: 'Estudiante eliminado exitosamente' });
    } catch (err) {
        console.error('Error al eliminar estudiante:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
