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
        const anio = req.session.user.anio_lectivo || '2026-2027';
        const [rows] = await db.query(
            'SELECT * FROM estudiantes WHERE school_id = ? AND anio_lectivo = ? ORDER BY nombres_apellidos',
            [schoolId, anio]
        );
        res.json(rows);
    } catch (err) {
        console.error('Error al listar estudiantes:', err);
        res.status(500).json({ error: err.message });
    }
});

// Buscar estudiantes de años anteriores (para auto-completar matrícula)
router.get('/buscar-anteriores', async (req, res) => {
    try {
        const db = req.db;
        const schoolId = req.session.user.school_id;
        const anioActual = req.session.user.anio_lectivo || '2026-2027';
        const { cedula } = req.query;
        if (!cedula) return res.json(null);
        const [rows] = await db.query(
            'SELECT * FROM estudiantes WHERE cedula = ? AND school_id = ? AND anio_lectivo != ? ORDER BY anio_lectivo DESC LIMIT 1',
            [cedula, schoolId, anioActual]
        );
        res.json(rows.length > 0 ? rows[0] : null);
    } catch (err) {
        console.error('Error al buscar estudiantes anteriores:', err);
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
            representante, cedula_representante, parentesco_representante, telefono_representante,
            email_representante, lugar_trabajo_representante,
            anio_lectivo, curso, paralelo, especialidad
        } = req.body;

        const anio = anio_lectivo || '2026-2027';

        // Verificar cédula duplicada solo en el mismo año
        if (cedula) {
            const [existente] = await db.query(
                'SELECT id FROM estudiantes WHERE cedula = ? AND school_id = ? AND anio_lectivo = ?',
                [cedula, schoolId, anio]
            );
            if (existente.length > 0) {
                return res.status(400).json({ error: 'La cedula ya esta registrada en este año lectivo' });
            }
        }

        // Generar número de matrícula
        const anioCorto = anio.split('-')[0].slice(-2);
        const [lastMat] = await db.query(
            "SELECT numero_matricula FROM estudiantes WHERE numero_matricula LIKE ? AND school_id = ? ORDER BY id DESC LIMIT 1",
            [`MAT-${anioCorto}-%`, schoolId]
        );
        let numSeq = 1;
        if (lastMat.length > 0) {
            const lastNum = parseInt(lastMat[0].numero_matricula.split('-')[2]);
            numSeq = lastNum + 1;
        }
        const numeroMatricula = `MAT-${anioCorto}-${String(numSeq).padStart(4, '0')}`;

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
                numero_matricula, cedula, nombres_apellidos, sexo, fecha_nacimiento, edad, email,
                tipo_sangre, discapacidad, discapacidad_tipo,
                pais, provincia, ciudad, parroquia, direccion,
                representante, cedula_representante, parentesco_representante, telefono_representante,
                email_representante, lugar_trabajo_representante,
                anio_lectivo, curso, paralelo, especialidad, school_id
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [
                numeroMatricula, cedula || null, nombres_apellidos, sexo, fecha_nacimiento || null, edad, email || null,
                tipo_sangre || null, discapacidad || 'NO', discapacidad_tipo || null,
                pais || null, provincia || null, ciudad || null, parroquia || null, direccion || null,
                representante || null, cedula_representante || null, parentesco_representante || null, telefono_representante || null,
                email_representante || null, lugar_trabajo_representante || null,
                anio, curso || null, paralelo || null, especialidad || null, schoolId
            ]
        );
        res.json({ message: 'Estudiante matriculado exitosamente', id: result.insertId, numero_matricula: numeroMatricula });
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
            representante, cedula_representante, parentesco_representante, telefono_representante,
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
                representante=?, cedula_representante=?, parentesco_representante=?, telefono_representante=?,
                email_representante=?, lugar_trabajo_representante=?,
                anio_lectivo=?, curso=?, paralelo=?, especialidad=?, activo=?
            WHERE id=? AND school_id=?`,
            [
                cedula, nombres_apellidos, sexo, fecha_nacimiento || null, edad, email || null,
                tipo_sangre || null, discapacidad || 'NO', discapacidad_tipo || null,
                pais || null, provincia || null, ciudad || null, parroquia || null, direccion || null,
                representante || null, cedula_representante || null, parentesco_representante || null, telefono_representante || null,
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

            const anioRow = row.anio_lectivo ? String(row.anio_lectivo).trim() : anioDefault;

            const [existente] = await db.query(
                'SELECT id FROM estudiantes WHERE cedula = ? AND school_id = ? AND anio_lectivo = ?',
                [cedula, schoolId, anioRow]
            );
            if (existente.length > 0) {
                omitidos++;
                continue;
            }

            // Generar número de matrícula
            const anioCorto = anioRow.split('-')[0].slice(-2);
            const [lastMat] = await db.query(
                "SELECT numero_matricula FROM estudiantes WHERE numero_matricula LIKE ? AND school_id = ? ORDER BY id DESC LIMIT 1",
                [`MAT-${anioCorto}-%`, schoolId]
            );
            let numSeq = 1;
            if (lastMat.length > 0) {
                const lastNum = parseInt(lastMat[0].numero_matricula.split('-')[2]);
                numSeq = lastNum + 1;
            }
            const numeroMatricula = `MAT-${anioCorto}-${String(numSeq).padStart(4, '0')}`;

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
                    numero_matricula, cedula, nombres_apellidos, sexo, fecha_nacimiento, edad, email,
                    tipo_sangre, discapacidad, discapacidad_tipo,
                    pais, provincia, ciudad, parroquia, direccion,
                    representante, cedula_representante, telefono_representante,
                    email_representante, lugar_trabajo_representante,
                    anio_lectivo, curso, paralelo, especialidad, school_id
                ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                [
                    numeroMatricula, cedula, nombres_apellidos,
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
                    anioRow,
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
