CREATE DATABASE IF NOT EXISTS gestion_academica;
USE gestion_academica;

-- Tabla de escuelas
CREATE TABLE IF NOT EXISTS schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    direccion VARCHAR(255),
    telefono VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de usuarios con roles
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cedula VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('docente','secretaria','rector','inspector') DEFAULT 'docente',
    school_id INT,
    estado TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE SET NULL
);

-- Tabla de estudiantes
CREATE TABLE IF NOT EXISTS estudiantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cedula VARCHAR(20) NOT NULL,
    nombres_apellidos VARCHAR(100) NOT NULL,
    telefono_representante VARCHAR(20),
    sexo ENUM('M','F') NOT NULL,
    fecha_nacimiento DATE,
    edad TINYINT,
    email VARCHAR(100),
    tipo_sangre VARCHAR(5),
    discapacidad VARCHAR(50) DEFAULT 'NO',
    discapacidad_tipo VARCHAR(100),
    pais VARCHAR(50),
    provincia VARCHAR(50),
    ciudad VARCHAR(50),
    parroquia VARCHAR(50),
    direccion VARCHAR(255),
    representante VARCHAR(100),
    cedula_representante VARCHAR(20),
    email_representante VARCHAR(100),
    lugar_trabajo_representante VARCHAR(100),
    anio_lectivo VARCHAR(10),
    curso VARCHAR(50),
    paralelo VARCHAR(10),
    especialidad VARCHAR(100),
    activo TINYINT DEFAULT 1,
    school_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_cedula_school (cedula, school_id),
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
);

-- Tabla de materias (creadas por rector, con docente asignado)
CREATE TABLE IF NOT EXISTS materias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_materia VARCHAR(100) NOT NULL,
    curso VARCHAR(50) NOT NULL,
    paralelo VARCHAR(50) NOT NULL,
    especialidad VARCHAR(100),
    docente_id INT,
    school_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (docente_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
);

-- Tabla de grupos (asignacion alumno-materia)
CREATE TABLE IF NOT EXISTS grupos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_grupo VARCHAR(100) NOT NULL,
    materia_id INT NOT NULL,
    estudiante_id INT NOT NULL,
    school_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_grupo_estudiante (materia_id, estudiante_id),
    FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE,
    FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
);

-- Tabla de asistencias
CREATE TABLE IF NOT EXISTS asistencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    grupo_id INT NOT NULL,
    fecha DATE NOT NULL,
    estado ENUM('presente','ausente','atraso') DEFAULT 'presente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_asistencia (grupo_id, fecha),
    FOREIGN KEY (grupo_id) REFERENCES grupos(id) ON DELETE CASCADE
);

-- Tabla de configuracion de porcentajes
CREATE TABLE IF NOT EXISTS configuracion_porcentajes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    concepto VARCHAR(50) NOT NULL UNIQUE,
    porcentaje DECIMAL(5,2) NOT NULL DEFAULT 0,
    descripcion VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT IGNORE INTO configuracion_porcentajes (concepto, porcentaje, descripcion) VALUES
('promedio_tareas', 70.00, 'Porcentaje del promedio de tareas y lecciones'),
('proyecto', 15.00, 'Porcentaje de la nota del proyecto'),
('examen', 15.00, 'Porcentaje de la nota del examen');

-- Tabla de notas
CREATE TABLE IF NOT EXISTS notas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    grupo_id INT NOT NULL,
    trimestre TINYINT NOT NULL,
    tipo ENUM('tarea','proyecto','examen') NOT NULL,
    nota DECIMAL(5,2),
    comentario TEXT,
    fecha_registro DATE,
    indice INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_nota_grupo_tipo_idx (grupo_id, trimestre, tipo, indice),
    FOREIGN KEY (grupo_id) REFERENCES grupos(id) ON DELETE CASCADE
);

-- Tabla de promedios por trimestre
CREATE TABLE IF NOT EXISTS promedios_trimestrales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    grupo_id INT NOT NULL,
    trimestre TINYINT NOT NULL,
    promedio_tareas DECIMAL(5,2),
    nota_proyecto DECIMAL(5,2),
    nota_examen DECIMAL(5,2),
    nota_final DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_promedio (grupo_id, trimestre),
    FOREIGN KEY (grupo_id) REFERENCES grupos(id) ON DELETE CASCADE
);

-- Tabla de sesiones (express-mysql-session)
CREATE TABLE IF NOT EXISTS sessions (
    session_id VARCHAR(128) PRIMARY KEY,
    expires INT UNSIGNED NOT NULL,
    data MEDIUMTEXT
) ENGINE=InnoDB;
