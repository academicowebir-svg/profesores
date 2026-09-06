const express = require('express');
const router = express.Router();


// Listar todos los grupos (filtrados por docente)
router.get('/', async (req, res) => {
    const db = req.db;
    const user = req.session.user;
    const anio = user.anio_lectivo || '2026-2027';
    try {
        let query = `
            SELECT g.id, g.nombre_grupo, g.materia_id, m.nombre_materia, m.curso, m.paralelo, m.especialidad,
                   e.cedula, e.nombres_apellidos, e.sexo, e.discapacidad, e.activo
            FROM grupos g
            INNER JOIN materias m ON g.materia_id = m.id
            INNER JOIN estudiantes e ON g.estudiante_id = e.id
            WHERE g.anio_lectivo = ?
        `;
        const params = [anio];
        if (user.rol === 'docente') {
            query += ' AND m.docente_id = ?';
            params.push(user.id);
        }
        query += ' ORDER BY g.nombre_grupo, e.nombres_apellidos';
        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Listar grupos únicos con conteo de estudiantes (filtrados por docente)
router.get('/list', async (req, res) => {
    const db = req.db;
    const user = req.session.user;
    const anio = user.anio_lectivo || '2026-2027';
    try {
        let query = `
            SELECT MIN(g.id) as id, g.nombre_grupo, g.materia_id, m.nombre_materia, m.curso, m.paralelo, m.especialidad,
                   COUNT(g.estudiante_id) as total_estudiantes
            FROM grupos g
            INNER JOIN materias m ON g.materia_id = m.id
            WHERE g.anio_lectivo = ?
        `;
        const params = [anio];
        if (user.rol === 'docente') {
            query += ' AND m.docente_id = ?';
            params.push(user.id);
        }
        query += ' GROUP BY g.nombre_grupo, g.materia_id, m.nombre_materia, m.curso, m.paralelo, m.especialidad ORDER BY g.nombre_grupo';
        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Renderizar vista de grupos/ asignaciones
router.get('/view', (req, res) => {
    const db = req.db;
    res.render('grupos');
});

// Obtener estudiantes asignados a una materia (por materia_id)
router.get('/por-materia/:materia_id/estudiantes', async (req, res) => {
    const db = req.db;
    try {
        const [rows] = await db.query(`
            SELECT g.id, e.id as estudiante_id, e.cedula, e.nombres_apellidos, 
                   e.telefono_representante, e.sexo, e.discapacidad, e.activo, g.nombre_grupo, g.materia_id
            FROM grupos g
            INNER JOIN estudiantes e ON g.estudiante_id = e.id
            WHERE g.materia_id = ?
            ORDER BY e.nombres_apellidos
        `, [req.params.materia_id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Asignar estudiantes a una materia (solo agrega/quita sin destruir grupo_ids existentes)
router.post('/asignar-materia', async (req, res) => {
    const db = req.db;
    const user = req.session.user;
    const { materia_id, estudiante_ids } = req.body;
    const anio = user.anio_lectivo || '2026-2027';
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        
        // Get materia name to use as nombre_grupo
        const [materiaRows] = await conn.query(
            'SELECT nombre_materia FROM materias WHERE id = ? LIMIT 1',
            [materia_id]
        );
        if (materiaRows.length === 0) {
            await conn.rollback();
            return res.status(404).json({ error: 'Materia no encontrada' });
        }
        const nombreGrupo = materiaRows[0].nombre_materia;
        
        // Obtener estudiantes actualmente asignados
        const [actuales] = await conn.query(
            'SELECT estudiante_id FROM grupos WHERE materia_id = ? AND anio_lectivo = ?',
            [materia_id, anio]
        );
        const actualesIds = actuales.map(a => a.estudiante_id);
        const nuevosIds = estudiante_ids || [];

        // Agregar nuevos (los que no estaban)
        for (const eid of nuevosIds) {
            if (!actualesIds.includes(eid)) {
                await conn.query(
                    'INSERT IGNORE INTO grupos (nombre_grupo, materia_id, estudiante_id, school_id, anio_lectivo) VALUES (?, ?, ?, ?, ?)',
                    [nombreGrupo, materia_id, eid, user.school_id, anio]
                );
            }
        }

        // NO eliminar los que ya estaban (para preservar grupo_id y notas)
        
        await conn.commit();
        res.json({ message: `Asignacion guardada: ${nuevosIds.length} estudiantes en ${nombreGrupo}` });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        conn.release();
    }
});

// Obtener detalles de un grupo (nombre_grupo + materia_id)
router.get('/:id', async (req, res) => {
    const db = req.db;
    try {
        const [rows] = await db.query(`
            SELECT g.id, g.nombre_grupo, g.materia_id, m.nombre_materia, m.curso, m.paralelo, m.especialidad
            FROM grupos g
            INNER JOIN materias m ON g.materia_id = m.id
            WHERE g.id = ?
            LIMIT 1
        `, [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Grupo no encontrado' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener estudiantes de un grupo único (por nombre_grupo + materia_id)
router.get('/detalle/:grupo_id', async (req, res) => {
    const db = req.db;
    try {
        // Primero obtener el nombre_grupo y materia_id del registro
        const [grupoInfo] = await db.query(
            'SELECT nombre_grupo, materia_id FROM grupos WHERE id = ? LIMIT 1',
            [req.params.grupo_id]
        );
        if (grupoInfo.length === 0) return res.status(404).json({ error: 'Grupo no encontrado' });
        
        const { nombre_grupo, materia_id } = grupoInfo[0];
        
        // Obtener todos los estudiantes de este grupo
        const [rows] = await db.query(`
            SELECT g.id, e.cedula, e.nombres_apellidos, e.telefono_representante, e.sexo, e.discapacidad, e.activo
            FROM grupos g
            INNER JOIN estudiantes e ON g.estudiante_id = e.id
            WHERE g.nombre_grupo = ? AND g.materia_id = ?
            ORDER BY e.nombres_apellidos
        `, [nombre_grupo, materia_id]);
        res.json({
            id: req.params.grupo_id,
            nombre_grupo,
            materia_id,
            estudiantes: rows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener estudiantes asignados a un grupo (por su grupo_id, devuelve TODOS los estudiantes del grupo)
router.get('/:id/estudiantes', async (req, res) => {
    const db = req.db;
    try {
        // Primero obtener nombre_grupo y materia_id del grupo
        const [grupoInfo] = await db.query(
            'SELECT nombre_grupo, materia_id FROM grupos WHERE id = ? LIMIT 1',
            [req.params.id]
        );
        if (grupoInfo.length === 0) return res.status(404).json({ error: 'Grupo no encontrado' });

        const { nombre_grupo, materia_id } = grupoInfo[0];

        // Obtener todos los estudiantes de este grupo (nombre_grupo + materia_id), incluir inactivos
        const [rows] = await db.query(`
            SELECT g.id, e.id as estudiante_id, e.cedula, e.nombres_apellidos, 
                   e.telefono_representante, e.sexo, e.discapacidad, e.activo, g.nombre_grupo, g.materia_id
            FROM grupos g
            INNER JOIN estudiantes e ON g.estudiante_id = e.id
            WHERE g.nombre_grupo = ? AND g.materia_id = ?
            ORDER BY e.nombres_apellidos
        `, [nombre_grupo, materia_id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Crear un grupo y asignar múltiples estudiantes a una materia
router.post('/', async (req, res) => {
    const db = req.db;
    const user = req.session.user;
    const { nombre_grupo, materia_id, estudiante_ids } = req.body;
    const anio = user.anio_lectivo || '2026-2027';
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        
        // Insertar un registro por cada estudiante (todos comparten nombre_grupo y materia_id)
        if (estudiante_ids && Array.isArray(estudiante_ids) && estudiante_ids.length > 0) {
            for (const eid of estudiante_ids) {
                await conn.query(
                    'INSERT IGNORE INTO grupos (nombre_grupo, materia_id, estudiante_id, school_id, anio_lectivo) VALUES (?, ?, ?, ?, ?)',
                    [nombre_grupo, materia_id, eid, user.school_id, anio]
                );
            }
        }
        
        // Obtener el ID del primer estudiante insertado como identificador del grupo
        const [grupoRows] = await conn.query(
            'SELECT id FROM grupos WHERE nombre_grupo = ? AND materia_id = ? AND anio_lectivo = ? LIMIT 1',
            [nombre_grupo, materia_id, anio]
        );
        
        await conn.commit();
        res.json({ id: grupoRows[0].id, message: 'Grupo creado y estudiantes asignados exitosamente' });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        conn.release();
    }
});

// Asignar estudiantes a un grupo existente (por nombre_grupo + materia_id)
router.post('/asignar', async (req, res) => {
    const db = req.db;
    const user = req.session.user;
    const { nombre_grupo, materia_id, estudiante_ids } = req.body;
    const anio = user.anio_lectivo || '2026-2027';
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        
        if (estudiante_ids && Array.isArray(estudiante_ids) && estudiante_ids.length > 0) {
            for (const eid of estudiante_ids) {
                await conn.query(
                    'INSERT IGNORE INTO grupos (nombre_grupo, materia_id, estudiante_id, school_id, anio_lectivo) VALUES (?, ?, ?, ?, ?)',
                    [nombre_grupo, materia_id, eid, user.school_id, anio]
                );
            }
        }
        
        await conn.commit();
        res.json({ message: 'Estudiantes asignados al grupo exitosamente' });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        conn.release();
    }
});

// Eliminar un grupo completo (todos los estudiantes de un nombre_grupo + materia_id)
router.delete('/completo/:nombre/:materia_id', (req, res) => {
    const db = req.db;
    const { nombre, materia_id } = req.params;
    db.query(
        'DELETE FROM grupos WHERE nombre_grupo = ? AND materia_id = ?',
        [nombre, materia_id]
    ).then(() => {
        res.json({ message: 'Grupo eliminado exitosamente' });
    }).catch(err => {
        res.status(500).json({ error: err.message });
    });
});

// Eliminar un estudiante de un grupo específico (nombre_grupo + materia_id + estudiante_id)
router.delete('/:nombre/:materia_id/:estudiante_id', (req, res) => {
    const db = req.db;
    const { nombre, materia_id, estudiante_id } = req.params;
    db.query(
        'DELETE FROM grupos WHERE nombre_grupo = ? AND materia_id = ? AND estudiante_id = ?',
        [nombre, materia_id, estudiante_id]
    ).then(result => {
        if (result.affectedRows === 0) return res.status(404).json({ error: 'No se encontró el registro' });
        res.json({ message: 'Estudiante eliminado del grupo' });
    }).catch(err => {
        res.status(500).json({ error: err.message });
    });
});

module.exports = router;