const express = require('express');
const router = express.Router();

// Página de inicio / Menú principal
router.get('/', (req, res) => {
    res.render('index', { user: req.session.user });
});

module.exports = router;