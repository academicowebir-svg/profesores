const express = require('express');
const router = express.Router();


// Renderizar vista de boletines
router.get('/view', (req, res) => {
    const db = req.db;
    res.render('boletines');
});

// Generar boletín de un estudiante para un trimestre específico
router.get('/:estudiante_id/trimestre/:trimestre', async (req, res) => {
    const db = req.db;
    const { estudiante_id, trimestre } = req.params;
    try {
        const [boletin] = await db.query(`
            SELECT e.cedula, e.nombres_apellidos, e.sexo,
                   g.nombre_grupo, m.nombre_materia, m.curso, m.paralelo, m.especialidad,
                   pt.promedio_tareas, pt.nota_proyecto, pt.nota_examen, pt.nota_final
            FROM estudiantes e
            INNER JOIN grupos g ON e.id = g.estudiante_id
            INNER JOIN materias m ON g.materia_id = m.id
            LEFT JOIN promedios_trimestrales pt ON g.id = pt.grupo_id AND pt.trimestre = ?
            WHERE e.id = ?
            ORDER BY m.nombre_materia
        `, [trimestre, estudiante_id]);

        if (boletin.length === 0) {
            return res.status(404).json({ error: 'Estudiante no encontrado' });
        }

        const estudianteData = boletin[0];
        const materias = boletin.map(row => ({
            nombre_grupo: row.nombre_grupo,
            nombre_materia: row.nombre_materia,
            curso: row.curso,
            paralelo: row.paralelo,
            especialidad: row.especialidad,
            promedio_tareas: row.promedio_tareas,
            nota_proyecto: row.nota_proyecto,
            nota_examen: row.nota_examen,
            nota_final: row.nota_final
        }));

        const notasValidas = materias.filter(m => m.nota_final !== null);
        const promedioGeneral = notasValidas.length > 0
            ? notasValidas.reduce((sum, m) => sum + parseFloat(m.nota_final), 0) / notasValidas.length
            : null;

        const boletinData = {
            estudiante: {
                cedula: estudianteData.cedula,
                nombres_apellidos: estudianteData.nombres_apellidos,
                sexo: estudianteData.sexo
            },
            trimestre: parseInt(trimestre),
            materias: materias,
            promedio_general: promedioGeneral ? parseFloat(promedioGeneral.toFixed(2)) : null,
            fecha_emision: new Date().toISOString().split('T')[0]
        };

        res.json(boletinData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Generar boletín completo (los 3 trimestres)
router.get('/:estudiante_id/completo', async (req, res) => {
    const db = req.db;
    const { estudiante_id } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT e.cedula, e.nombres_apellidos, e.sexo,
                   m.nombre_materia, m.curso, m.paralelo, m.especialidad,
                   pt.trimestre, pt.promedio_tareas, pt.nota_proyecto, pt.nota_examen, pt.nota_final
            FROM estudiantes e
            INNER JOIN grupos g ON e.id = g.estudiante_id
            INNER JOIN materias m ON g.materia_id = m.id
            LEFT JOIN promedios_trimestrales pt ON g.id = pt.grupo_id
            WHERE e.id = ?
            ORDER BY m.nombre_materia, pt.trimestre
        `, [estudiante_id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Estudiante no encontrado' });
        }

        const estudianteData = rows[0];
        const materiasMap = {};

        rows.forEach(row => {
            const materiaKey = row.nombre_materia;
            if (!materiasMap[materiaKey]) {
                materiasMap[materiaKey] = {
                    nombre_materia: row.nombre_materia,
                    curso: row.curso,
                    paralelo: row.paralelo,
                    especialidad: row.especialidad,
                    trimestres: {}
                };
            }
            if (row.trimestre) {
                materiasMap[materiaKey].trimestres[row.trimestre] = {
                    promedio_tareas: row.promedio_tareas,
                    nota_proyecto: row.nota_proyecto,
                    nota_examen: row.nota_examen,
                    nota_final: row.nota_final
                };
            }
        });

        const boletinData = {
            estudiante: {
                cedula: estudianteData.cedula,
                nombres_apellidos: estudianteData.nombres_apellidos,
                sexo: estudianteData.sexo
            },
            materias: Object.values(materiasMap),
            fecha_emision: new Date().toISOString().split('T')[0]
        };

        res.json(boletinData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;