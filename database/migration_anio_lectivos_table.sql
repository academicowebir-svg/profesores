-- Tabla de años lectivos
CREATE TABLE IF NOT EXISTS anio_lectivos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    anio VARCHAR(20) NOT NULL,
    school_id INT NOT NULL,
    activo TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY (anio, school_id),
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
);

-- Insertar año por defecto
INSERT IGNORE INTO anio_lectivos (anio, school_id, activo) 
SELECT '2026-2027', id, 1 FROM schools;
