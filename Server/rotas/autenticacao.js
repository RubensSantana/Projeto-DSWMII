const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

module.exports = (db) => {
    // Rota de registro de usuário
    router.post('/registro', async (req, res) => {
        const { email, password, name } = req.body;
        try {
            // Criação de usuário no Firebase Authentication
            const userRecord = await admin.auth().createUser({ email, password });

            // Armazenar informações adicionais do usuário no Firestore
            await db.collection('users').doc(userRecord.uid).set({ name, email });
            res.status(201).send({ uid: userRecord.uid }); // Retorna o UID do usuário
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            res.status(400).send(error); // Retorna erro se falhar
        }
    });

    // Rota de login de usuário
    router.post('/login', async (req, res) => {
        const { idToken } = req.body;
        try {
            // Verifica e decodifica o token do usuário
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            const uid = decodedToken.uid;

            // Configura um cookie de sessão com o UID do usuário
            res.cookie('session', uid, { httpOnly: true, secure: true, maxAge: 3600000 }); // 1 hora
            res.status(200).send({ uid });
        } catch (error) {
            res.status(401).send({ message: 'Erro ao autenticar' });
        }
    });

    // Rota de logout para limpar o cookie de sessão
    router.post('/logout', (req, res) => {
        res.clearCookie('session'); // Remove o cookie de sessão
        res.status(200).send({ message: 'Logout realizado com sucesso' });
    });

    return router;
};
