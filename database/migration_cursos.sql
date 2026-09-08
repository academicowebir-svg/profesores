-- Tabla de cursos
CREATE TABLE IF NOT EXISTS cursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    paralelos VARCHAR(200) DEFAULT 'A,B',
    especialidades VARCHAR(500) DEFAULT '',
    school_id INT NOT NULL,
    activo TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY (nombre, school_id),
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
);

-- Insertar cursos por defecto
INSERT IGNORE INTO cursos (nombre, paralelos, especialidades, school_id) 
SELECT 'Primero', 'A,B', '', id FROM schools;
INSERT IGNORE INTO cursos (nombre, paralelos, especialidades, school_id) 
SELECT 'Segundo', 'A,B', '', id FROM schools;
INSERT IGNORE INTO cursos (nombre, paralelos, especialidades, school_id) 
SELECT 'Tercero', 'A,B', 'Contabilidad,Informatica,Mecanica,Ciencias', id FROM schools;
