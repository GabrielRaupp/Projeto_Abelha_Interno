const express = require('express');
const db = require('../db');


const router = express.Router();

router.get('/', (req, res) => {
    const query = 'SELECT * FROM telemetria';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao executar consulta:', err);
            res.status(500).send({ message: 'Erro ao executar consulta' });
            return;
        }
        res.json(results);
    });
});

module.exports = router;
