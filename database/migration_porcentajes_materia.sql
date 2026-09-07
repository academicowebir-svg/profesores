-- Tabla de porcentajes por materia
CREATE TABLE IF NOT EXISTS configuracion_porcentajes_materia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    materia_id INT NOT NULL,
    promedio_tareas DECIMAL(5,2) DEFAULT 70,
    proyecto DECIMAL(5,2) DEFAULT 15,
    examen DECIMAL(5,2) DEFAULT 15,
    school_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY (materia_id, school_id),
    FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
);
