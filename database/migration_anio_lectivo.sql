-- Migracion: Agregar anio_lectivo a tablas que faltan
-- Fecha: 2026-09-06

-- 1. materias
ALTER TABLE materias ADD COLUMN anio_lectivo VARCHAR(20) DEFAULT '2026-2027' AFTER especialidad;
UPDATE materias SET anio_lectivo = '2026-2027' WHERE anio_lectivo IS NULL;

-- 2. grupos
ALTER TABLE grupos ADD COLUMN anio_lectivo VARCHAR(20) DEFAULT '2026-2027' AFTER school_id;
UPDATE grupos SET anio_lectivo = '2026-2027' WHERE anio_lectivo IS NULL;

-- 3. notas
ALTER TABLE notas ADD COLUMN anio_lectivo VARCHAR(20) DEFAULT '2026-2027' AFTER indice;
UPDATE notas SET anio_lectivo = '2026-2027' WHERE anio_lectivo IS NULL;

-- 4. asistencias
ALTER TABLE asistencias ADD COLUMN anio_lectivo VARCHAR(20) DEFAULT '2026-2027' AFTER comentario;
UPDATE asistencias SET anio_lectivo = '2026-2027' WHERE anio_lectivo IS NULL;

-- 5. promedios_trimestrales
ALTER TABLE promedios_trimestrales ADD COLUMN anio_lectivo VARCHAR(20) DEFAULT '2026-2027' AFTER nota_final;
UPDATE promedios_trimestrales SET anio_lectivo = '2026-2027' WHERE anio_lectivo IS NULL;
