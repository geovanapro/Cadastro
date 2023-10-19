const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

app.use(express.urlencoded({ extended: true }));

const con = mysql.createConnection({
  host: "localhost",
  user: "phpmyadmin",
  password: "phpmyadmin",
  database: "polarisdb"
});

app.use(
    session({
        secret: 'sua_chave_secreta',
        resave: true,
        saveUninitialized: true,
    })
);

app.use(bodyParser.urlencoded({ extended: true }));


app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

app.post('/login', (req, res) => {
    const username = req.body.nome;
    const password = req.body.senha;


    const sql = `SELECT * FROM users WHERE nome = ? AND senha = ?`;

    con.query(sql, [username, password], (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
            req.session.loggedin = true;
            req.session.username = username;
            res.redirect('/dashboard');
        } else {
            res.send('Credenciais inválidas. <a href="/login">Tente novamente</a>');
        }
    });
});

// Rota para a página do painel
app.get('/dashboard', (req, res) => {
//
if (req.session.loggedin) {
    res.sendFile(__dirname + '/index.html');
} else {
    res.send('Faça login para acessar esta página. <a href="/login">Login</a>');
}
});


app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});


app.get('/cadastro', (req, res) => {
    res.sendFile(__dirname + '/cadastro.html');
});

app.post('/cadastrar', (req, res) => {
    const nome = req.body.nome;
    const senha = req.body.senha;
    const CPF = req.body.CPF;
//
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");

        const sql = `INSERT INTO users (nome, senha) VALUES ('${nome}', '${senha}')`;

        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
            res.send('Usuário cadastrado com sucesso!');
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});