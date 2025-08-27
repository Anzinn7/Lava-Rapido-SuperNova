const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Conexão com MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',       // seu usuário MySQL
    password: '@Anzinnff135',       // sua senha MySQL
    database: 'lava_rapido'
});

db.connect(err => {
    if (err) throw err;
    console.log('Conectado ao MySQL ✅');
});

// Rota para agendar serviço
app.post('/agendar', (req, res) => {
    const { nomeCliente, modelo, placa, tipoVeiculo, servico, valor } = req.body;
    const sql = 'INSERT INTO agendamentos (nome_cliente, modelo, placa, tipo_veiculo, servico, valor) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [nomeCliente, modelo, placa, tipoVeiculo, servico, valor], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Agendamento salvo com sucesso!' });
    });
});

// Rota opcional para listar agendamentos
app.get('/agendamentos', (req, res) => {
    db.query('SELECT * FROM agendamentos ORDER BY data_agendamento DESC', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000 🚀'));
