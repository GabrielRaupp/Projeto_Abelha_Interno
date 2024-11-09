const express = require('express');
const cors = require('cors');
const db = require('../db'); // Ou a configuração do banco de dados

const app = express();

// Habilita o CORS para permitir requisições de outros domínios
app.use(cors({
    origin: 'https://teste-projeto-gdaj.onrender.com',  // Substitua pela URL do seu frontend hospedado
}));

// A rota da API
app.get('/api/telemetria', (req, res) => {
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

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
