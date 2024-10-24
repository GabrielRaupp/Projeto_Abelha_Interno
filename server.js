const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Configuração da conexão com o banco de dados
const connection = mysql.createConnection({
    host: '194.195.213.74',   // Substitua pelo seu host
    user: 'ifc',              // Usuário do banco
    password: 'ifcs0mbrio',    // Senha do banco
    database: 'abelhas'        // Nome do banco
});

app.use(express.static('public'));  // Serve arquivos estáticos da pasta public

// Rota para obter os dados de telemetria
app.get('/dados', (req, res) => {
    const query = 'SELECT * FROM telemetria';  // Ajuste a consulta conforme a tabela
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar dados no banco:', err);
            res.status(500).send('Erro ao buscar dados');
            return;
        }
        res.json(results);  // Retorna os dados como JSON
    });
});

// Verificar se a conexão com o banco de dados foi estabelecida corretamente
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL');
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
