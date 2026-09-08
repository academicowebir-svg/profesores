-- Eliminar tabla anterior si existe
DROP TABLE IF EXISTS configuracion_porcentajes_curso;

-- Crear tabla con materia, curso, paralelo y especialidad
CREATE TABLE IF NOT EXISTS configuracion_porcentajes_materia_curso (
    id INT AUTO_INCREMENT PRIMARY KEY,
    materia_id INT NOT NULL,
    curso VARCHAR(50) NOT NULL,
    paralelo VARCHAR(10) NOT NULL,
    especialidad VARCHAR(50) DEFAULT NULL,
    promedio_tareas DECIMAL(5,2) DEFAULT 70,
    proyecto DECIMAL(5,2) DEFAULT 15,
    examen DECIMAL(5,2) DEFAULT 15,
    school_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_config (materia_id, curso, paralelo, especialidad, school_id),
    FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
);
