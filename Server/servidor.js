require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const admin = require('firebase-admin');
const authRoutes = require('./rotas/autenticacao');
const bookRoutes = require('./rotas/livros');
const chapterRoutes = require('./rotas/capitulos');

// Inicializando o aplicativo Express
const app = express();

// Configuração de CORS para permitir o envio de cookies
app.use(cors({
    origin: 'http://localhost:3000',  // Domínio do frontend
    credentials: true                 // Permite o envio de cookies
}));
app.use(bodyParser.json());           // Middleware para processar JSON
app.use(cookieParser());              // Middleware para manipulação de cookies

// Inicializando o Firebase Admin SDK com credenciais de serviço
const serviceAccount = require('./chaveFirebase.json');
if (admin.apps.length === 0) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}
const db = admin.firestore();

// Configuração das rotas, passando a referência do Firestore
app.use('/autenticacao', authRoutes(db));
app.use('/livros', bookRoutes(db));
app.use('/livros', chapterRoutes(db));

// Inicialização do servidor na porta especificada
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
