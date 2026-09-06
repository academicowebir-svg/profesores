const express = require('express');
const router = express.Router();
const multer = require('multer');
const XLSX = require('xlsx');

const upload = multer({ storage: multer.memoryStorage() });

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

router.get('/plantilla-excel', (req, res) => {
    const wb = XLSX.utils.book_new();
    const headers = [
        'cedula', 'nombres_apellidos', 'sexo', 'fecha_nacimiento', 'email',
        'tipo_sangre', 'discapacidad', 'discapacidad_tipo',
        'pais', 'provincia', 'ciudad', 'parroquia', 'direccion',
        'representante', 'cedula_representante', 'telefono_representante',
        'email_representante', 'lugar_trabajo_representante',
        'anio_lectivo', 'curso', 'paralelo', 'especialidad'
    ];
    const exampleRow = [
        '1234567890', 'Juan Perez Lopez', 'M', '2010-05-15', 'juan@email.com',
        'O+', 'NO', '',
        'Ecuador', 'Morona Santiago', 'Sucua', 'Sucua', 'Av. Principal',
        'Maria Lopez', '0987654321', '0999123456', 'maria@email.com', 'Empresa X',
        '2026-2027', 'Primero', 'A', 'Informatica'
    ];
    const ws = XLSX.utils.aoa_to_sheet([headers, exampleRow]);
    XLSX.utils.book_append_sheet(wb, ws, 'Estudiantes');
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Disposition', 'attachment; filename=plantilla_matricula.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buf);
});

router.post('/importar-excel', upload.single('archivo'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se envio ningun archivo' });
        }

        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        if (rows.length === 0) {
            return res.status(400).json({ error: 'El archivo esta vacio o no tiene el formato correcto' });
        }

        const db = req.db;
        const schoolId = req.session.user.school_id;
        let insertados = 0, omitidos = 0, errores = [];
        const anioDefault = '2026-2027';

        for (const row of rows) {
            const cedula = String(row.cedula || '').trim();
            const nombres_apellidos = String(row.nombres_apellidos || '').trim();
            const sexo = String(row.sexo || 'M').trim().toUpperCase();
            const curso = String(row.curso || '').trim();
            const paralelo = String(row.paralelo || '').trim();

            if (!cedula || !nombres_apellidos) {
                errores.push(`Fila omitida: cedula o nombres vacios`);
                omitidos++;
                continue;
            }

            const [existente] = await db.query(
                'SELECT id FROM estudiantes WHERE cedula = ? AND school_id = ?',
                [cedula, schoolId]
            );
            if (existente.length > 0) {
                omitidos++;
                continue;
            }

            let edad = null;
            const fechaNac = row.fecha_nacimiento ? String(row.fecha_nacimiento).trim() : null;
            if (fechaNac) {
                const hoy = new Date();
                const nac = new Date(fechaNac);
                edad = hoy.getFullYear() - nac.getFullYear();
                const m = hoy.getMonth() - nac.getMonth();
                if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
            }

            await db.query(
                `INSERT INTO estudiantes (
                    cedula, nombres_apellidos, sexo, fecha_nacimiento, edad, email,
                    tipo_sangre, discapacidad, discapacidad_tipo,
                    pais, provincia, ciudad, parroquia, direccion,
                    representante, cedula_representante, telefono_representante,
                    email_representante, lugar_trabajo_representante,
                    anio_lectivo, curso, paralelo, especialidad, school_id
                ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                [
                    cedula, nombres_apellidos,
                    sexo === 'F' ? 'F' : 'M',
                    fechaNac || null, edad,
                    row.email ? String(row.email).trim() : null,
                    row.tipo_sangre ? String(row.tipo_sangre).trim() : null,
                    row.discapacidad ? String(row.discapacidad).trim().toUpperCase() : 'NO',
                    row.discapacidad_tipo ? String(row.discapacidad_tipo).trim() : null,
                    row.pais ? String(row.pais).trim() : 'Ecuador',
                    row.provincia ? String(row.provincia).trim() : null,
                    row.ciudad ? String(row.ciudad).trim() : null,
                    row.parroquia ? String(row.parroquia).trim() : null,
                    row.direccion ? String(row.direccion).trim() : null,
                    row.representante ? String(row.representante).trim() : null,
                    row.cedula_representante ? String(row.cedula_representante).trim() : null,
                    row.telefono_representante ? String(row.telefono_representante).trim() : null,
                    row.email_representante ? String(row.email_representante).trim() : null,
                    row.lugar_trabajo_representante ? String(row.lugar_trabajo_representante).trim() : null,
                    row.anio_lectivo ? String(row.anio_lectivo).trim() : anioDefault,
                    curso || null, paralelo || null,
                    row.especialidad ? String(row.especialidad).trim() : null,
                    schoolId
                ]
            );
            insertados++;
        }

        res.json({
            message: `Importacion completada: ${insertados} insertados, ${omitidos} omitidos`,
            insertados, omitidos, errores: errores.slice(0, 10)
        });
    } catch (err) {
        console.error('Error al importar Excel:', err);
        res.status(500).json({ error: 'Error al procesar el archivo: ' + err.message });
    }
});

module.exports = router;
