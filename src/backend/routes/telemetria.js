const express = require('express');
const db = require('../db');  // A conexão do banco de dados

const router = express.Router();

// Rota para recuperar dados de telemetria
router.get('/api/telemetria', (req, res) => {
    const query = 'SELECT * FROM telemetria';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao executar consulta:', err);
            res.status(500).send({ message: 'Erro ao executar consulta' });
            return;
        }
        res.json(results);  // Retorna os dados em formato JSON
    });
});

module.exports = router;
