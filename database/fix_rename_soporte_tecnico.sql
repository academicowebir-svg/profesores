-- Renombrar "Soporte Tecnico" a "Soporte Informatico" en todas las tablas
-- Ejecutar en la base de datos

-- Materias
UPDATE materias SET especialidad = 'Soporte Informatico' WHERE especialidad = 'Soporte Tecnico';

-- Estudiantes
UPDATE estudiantes SET especialidad = 'Soporte Informatico' WHERE especialidad = 'Soporte Tecnico';

-- Grupos
UPDATE grupos SET especialidad = 'Soporte Informatico' WHERE especialidad = 'Soporte Tecnico';

-- Cursos (el campo especialidades es un CSV)
UPDATE cursos SET especialidades = REPLACE(especialidades, 'Soporte Tecnico', 'Soporte Informatico') WHERE especialidades LIKE '%Soporte Tecnico%';

-- Configuracion de porcentajes por materia+curso+paralelo+especialidad
UPDATE configuracion_porcentajes_materia_curso SET especialidad = 'Soporte Informatico' WHERE especialidad = 'Soporte Tecnico';
