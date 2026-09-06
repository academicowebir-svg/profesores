# Sistema de Gestión Académica

Aplicación completa para gestión académica de profesores con base de datos en MySQL.

## Requisitos

- **Node.js** (v14+)
- **MySQL Server** (8.0+)
- **Visual Studio Code**

## Instalación

1. Clonar o descargar el proyecto
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Crear la base de datos en MySQL Workbench:
   - Abrir MySQL Workbench
   - Conectar con las credenciales (usuario: root, contraseña: Betoben1)
   - Ejecutar el script `database/schema.sql`

4. Iniciar el servidor:
   ```bash
   npm run start
   ```
5. Abrir en el navegador: http://localhost:3000

## Menú Principal

| Opción | Descripción |
|--------|-------------|
| Ingreso de Estudiantes | Registrar, editar y eliminar estudiantes |
| Ingreso de Materias | Registrar, editar y eliminar materias |
| Grupos | Crear grupos y asignar estudiantes a materias |
| Asistencia | Registrar asistencia (sep 2026 - jul 2027) |
| Notas Trimestrales | Ingresar notas con cálculo automático de promedios |
| Reportes | Reportes académicos |
| Boletines | Generación de boletines |
| Salir | Salir del sistema |

## Módulos

### Estudiantes
- Cédula, nombres y apellidos, teléfono del representante, sexo

### Materias
- Nombre de la materia, curso, paralelo, especialidad

### Grupos
- Crear grupos y enlazar estudiantes con materias

### Asistencias
- Registro diario de asistencia (presente, ausente, atraso)
- Periodo lectivo: Septiembre 2026 - Julio 2027

### Notas Trimestrales
- Tres trimestres
- Tareas y lecciones con promedio (70%)
- Proyecto (15%)
- Examen (15%)
- Cálculo automático de la nota final
- Porcentajes editables

### Base de Datos

**Credenciales MySQL:**
- Usuario: root
- Contraseña: Betoben1
- Base de datos: gestion_academica

## Estructura del Proyecto

```
gestion-academica/
├── config/
│   ├── app.js          # Configuración Express
│   └── database.js     # Conexión MySQL
├── database/
│   ├── schema.sql      # Script de base de datos
│   └── mysql_import.bat
├── public/
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── main.js
│       ├── estudiantes.js
│       ├── materias.js
│       ├── grupos.js
│       ├── asistencias.js
│       ├── notas.js
│       ├── reportes.js
│       └── boletines.js
├── routes/
│   ├── index.js
│   ├── estudiantes.js
│   ├── materias.js
│   ├── grupos.js
│   ├── asistencias.js
│   ├── notas.js
│   ├── reportes.js
│   └── boletines.js
├── views/
│   ├── index.ejs
│   ├── estudiantes.ejs
│   ├── materias.ejs
│   ├── grupos.ejs
│   ├── asistencias.ejs
│   ├── notas.ejs
│   ├── reportes.ejs
│   └── boletines.ejs
├── .env
├── package.json
└── server.js
```

## Tecnologías

- **Backend:** Node.js + Express
- **Base de datos:** MySQL
- **Frontend:** HTML5 + CSS3 (Bootstrap 5) + JavaScript
- **Motor de plantillas:** EJS