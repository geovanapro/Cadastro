const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const port = 8080; // Porta em que o servidor será executado

app.use(express.urlencoded({ extended: true }));

const con = mysql.createConnection({
    host: "localhost",
    user: "phpmyadmin",
    password: "aluno",
    database: "medical"
});

app.use(
    session({
        secret: 'sua_chave_secreta',
        resave: true,
        saveUninitialized: true,
    })
);

app.use(bodyParser.urlencoded({ extended: true }));

// Configurar EJS como o motor de visualização
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render(__dirname + '/login.ejs');
});

app.get('/login', (req, res) => {
    res.render(__dirname + '/login.ejs');
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

// Rota para exibir a página home.html
app.get('/home', (req, res) => {
    res.render(__dirname + '/home.ejs');
    //server.use(express.static(_dirname + '/'));
});

// Rota para exibir a página login.html
app.get('/login', (req, res) => {
    res.render(__dirname + '/login.ejs');
    // server.use(express.static(_dirname + '/'));
});

// Rota para exibir a página cadastro.html
app.get('/cadastro', (req, res) => {
    res.render(__dirname + '/cadastro.ejs');
    // server.use(express.static(_dirname + '/'));
});

// Rota para exibir a página consulta.html
app.get('/consulta', (req, res) => {
    res.render(__dirname + '/consulta.ejs');
    // server.use(express.static(_dirname + '/'));
});


// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor Express está rodando na porta ${port}`);
});
