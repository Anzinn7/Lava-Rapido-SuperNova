const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir front-end
app.use(express.static(path.join(__dirname, 'docs')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs', 'index.html'));
});

// Conexão com MySQL usando variáveis de ambiente
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err.message);
        return;
    }
    console.log('Conectado ao MySQL ✅');
});

// Rota para agendar serviço
app.post('/agendar', (req, res) => {
    const { nomeCliente, modelo, placa, tipoVeiculo, servico, valor } = req.body;
    const sql = `
        INSERT INTO agendamentos
        (nome_cliente, modelo, placa, tipo_veiculo, servico, valor)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
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

// Porta do Render ou 3000 localmente
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT} 🚀`));
