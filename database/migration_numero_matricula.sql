-- Agregar número de matrícula único por año lectivo
ALTER TABLE estudiantes ADD COLUMN numero_matricula VARCHAR(30) AFTER id;

-- Generar números de matrícula para registros existentes
SET @counter = 0;
UPDATE estudiantes SET numero_matricula = CONCAT('MAT-2026-', LPAD((@counter := @counter + 1), 4, '0'))
WHERE anio_lectivo = '2026-2027' AND numero_matricula IS NULL;

-- Agregar índice único por número de matrícula y año lectivo
ALTER TABLE estudiantes ADD UNIQUE KEY unique_matricula_anio (numero_matricula, anio_lectivo);
