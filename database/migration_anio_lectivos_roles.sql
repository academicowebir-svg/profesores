-- Migracion: Activacion de años lectivos por rol
ALTER TABLE anio_lectivos 
    ADD COLUMN activo_docente TINYINT DEFAULT 1 AFTER activo,
    ADD COLUMN activo_secretaria TINYINT DEFAULT 1 AFTER activo_docente,
    ADD COLUMN activo_inspector TINYINT DEFAULT 1 AFTER activo_secretaria;
