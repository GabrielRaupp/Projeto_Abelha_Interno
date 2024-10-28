const express = require('express');
const mysql = require('mysql2'); // Usando mysql2
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());

// Endpoint para a raiz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Serve o arquivo index.html
});

// Configuração da conexão com o banco de dados
const db = mysql.createConnection({
    host: '194.195.213.74',
    user: 'ifc',
    password: 'ifcs0mbrio',
    database: 'abelhas'
});

// Conectar ao banco de dados
db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados');
});

// Endpoint para buscar dados de telemetria
app.get('/telemetria', (req, res) => {
    // Buscar os dados de telemetria para cada caixa
    const queries = [
        // Ambiente
        'SELECT temperatura, pressao, umidade FROM telemetria WHERE localizacao = "Ambiente" ORDER BY data DESC LIMIT 100',
        // Caixa 9
        'SELECT temperatura, pressao, umidade FROM telemetria WHERE localizacao = "Caixa 9" ORDER BY data DESC LIMIT 100',
        // Caixa 10
        'SELECT temperatura, pressao, umidade FROM telemetria WHERE localizacao = "Caixa 10" ORDER BY data DESC LIMIT 100',
        // Caixa 12
        'SELECT temperatura, pressao, umidade FROM telemetria WHERE localizacao = "Caixa 12" ORDER BY data DESC LIMIT 100'
    ];

    Promise.all(queries.map(query => new Promise((resolve, reject) => {
        db.query(query, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    }))).then(results => {
 const data = {
            Ambiente: results[0],
            'Caixa 9': results[1],
            'Caixa 10': results[2],
            'Caixa 12': results[3]
        };
        res.json(data);
    }).catch(err => {
        res.status(500).send(err);
    });
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});