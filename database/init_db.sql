CREATE DATABASE IF NOT EXISTS gestion_academica;
USE gestion_academica;

SOURCE C:/Users/irvin/Desktop/Profesores/database/schema.sql;

-- Crear escuela por defecto
INSERT INTO schools (nombre, direccion, telefono) VALUES ('Escuela Default', 'Direccion Default', '0000000000');

-- Crear usuarios de prueba
INSERT INTO usuarios (cedula, nombre, password, rol, school_id, estado) VALUES
('admin', 'Administrador', 'admin123', 'admin', 1, 1),
('1400501076', 'Docente Prueba', 'Betoben1', 'docente', 1, 1),
('0000000001', 'Secretaria Prueba', 'secretaria1', 'secretaria', 1, 1),
('0000000002', 'Rector Prueba', 'rector1', 'rector', 1, 1);

SELECT 'Base de datos creada exitosamente' AS resultado;
SELECT * FROM usuarios;
