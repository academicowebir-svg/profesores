-- Tabla para pruebas de diagnóstico
CREATE TABLE IF NOT EXISTS pruebas_diagnostico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    estudiante_id INT NOT NULL,
    materia_id INT NOT NULL,
    curso VARCHAR(50) NOT NULL,
    paralelo VARCHAR(10) NOT NULL,
    fecha DATE DEFAULT (CURDATE()),
    destrezas JSON,
    total DECIMAL(4,2) DEFAULT 0,
    descripcion VARCHAR(255),
    anio_lectivo VARCHAR(20) DEFAULT '2026-2027',
    school_id INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_estudiante (estudiante_id),
    KEY idx_materia (materia_id),
    KEY idx_curso (curso, paralelo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
