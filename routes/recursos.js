const express = require('express');
const router = express.Router();

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }
});

router.get('/view', (req, res) => {
    const db = req.db;
    res.render('recursos');
});

router.get('/list', async (req, res) => {
    const db = req.db;
    try {
        const { categoria, materia_id } = req.query;
        let query = `
            SELECT r.*, m.nombre_materia
            FROM recursos r
            LEFT JOIN materias m ON r.materia_id = m.id
            WHERE 1=1
        `;
        const params = [];
        if (categoria) {
            query += ' AND r.categoria = ?';
            params.push(categoria);
        }
        if (materia_id) {
            query += ' AND r.materia_id = ?';
            params.push(materia_id);
        }
        query += ' ORDER BY r.created_at DESC';
        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', upload.single('archivo'), async (req, res) => {
    const db = req.db;
    const { titulo, descripcion, enlace, categoria, materia_id } = req.body;
    let archivoRuta = '';
    if (req.file) {
        archivoRuta = '/uploads/' + req.file.filename;
    }
    try {
        const [result] = await db.query(
            'INSERT INTO recursos (titulo, descripcion, enlace, categoria, materia_id) VALUES (?, ?, ?, ?, ?)',
            [titulo, descripcion || '', enlace || archivoRuta, categoria || 'documento', materia_id || null]
        );
        res.json({ id: result.insertId, message: 'Recurso creado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', upload.single('archivo'), async (req, res) => {
    const db = req.db;
    const { titulo, descripcion, enlace, categoria, materia_id } = req.body;
    let archivoRuta = enlace || '';
    if (req.file) {
        archivoRuta = '/uploads/' + req.file.filename;
    }
    try {
        await db.query(
            'UPDATE recursos SET titulo = ?, descripcion = ?, enlace = ?, categoria = ?, materia_id = ? WHERE id = ?',
            [titulo, descripcion || '', archivoRuta, categoria || 'documento', materia_id || null, req.params.id]
        );
        res.json({ message: 'Recurso actualizado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    const db = req.db;
    try {
        const [rows] = await db.query('SELECT enlace FROM recursos WHERE id = ?', [req.params.id]);
        if (rows.length > 0 && rows[0].enlace && rows[0].enlace.startsWith('/uploads/')) {
            const filePath = path.join(__dirname, '..', rows[0].enlace);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        await db.query('DELETE FROM recursos WHERE id = ?', [req.params.id]);
        res.json({ message: 'Recurso eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/archivo/:filename', (req, res) => {
    const db = req.db;
    const filePath = path.join(__dirname, '..', 'uploads', req.params.filename);
    if (!fs.existsSync(filePath)) return res.status(404).send('Archivo no encontrado');
    res.sendFile(filePath);
});

router.get('/materias', async (req, res) => {
    const db = req.db;
    try {
        const [rows] = await db.query('SELECT id, nombre_materia, curso, paralelo FROM materias ORDER BY nombre_materia');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
