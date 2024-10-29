const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, '../frontend'))); 

const db = mysql.createConnection({
    host: '194.195.213.74',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados com sucesso!');
});

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

// Rota para a raiz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/Index.html'));
});

app.listen(3000, () => {
    console.log('Servidor iniciado na porta 3000');
});
