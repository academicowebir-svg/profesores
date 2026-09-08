-- Fix: ON DELETE CASCADE para tablas dependientes de estudiantes
-- planes_refuerzo
ALTER TABLE planes_refuerzo DROP FOREIGN KEY IF EXISTS planes_refuerzo_ibfk_1;
ALTER TABLE planes_refuerzo ADD FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE;

-- asistencia_recuperacion
ALTER TABLE asistencia_recuperacion DROP FOREIGN KEY IF EXISTS asistencia_recuperacion_ibfk_1;
ALTER TABLE asistencia_recuperacion ADD FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE;

-- evaluaciones_recuperacion
ALTER TABLE evaluaciones_recuperacion DROP FOREIGN KEY IF EXISTS evaluaciones_recuperacion_ibfk_1;
ALTER TABLE evaluaciones_recuperacion ADD FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE;
