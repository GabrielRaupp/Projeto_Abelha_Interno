const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config();

// Configurações do banco de dados
const DB_HOST = process.env.DB_HOST || '194.195.213.74';
const DB_USER = process.env.DB_USER || 'ifc';
const DB_PASSWORD = process.env.DB_PASSWORD || 'ifcs0mbrio';
const DB_NAME = process.env.DB_NAME || 'abelhas';
const PORT = process.env.PORT || 3000;

// Conexão com o banco de dados
const db = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
        return;
    }
    console.log('Conectado ao banco de dados com sucesso!');
});

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));  // Caminho ajustado para pasta 'frontend'

// Rota para dados de telemetria
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

// Rota para servir o arquivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'Index.html'));  // Caminho ajustado
});

app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}`);
});
