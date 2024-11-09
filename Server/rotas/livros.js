const express = require('express');
const router = express.Router();

module.exports = (db) => {
    // Rota para criar um novo livro
    router.post('/', async (req, res) => {
        const { title, authorId, content, tags } = req.body;
        try {
            const bookRef = await db.collection('books').add({ title, authorId, content, tags });
            res.status(201).send({ id: bookRef.id });
        } catch (error) {
            res.status(400).send(error);
        }
    });

    // Rota para obter um livro específico
    router.get('/:id', async (req, res) => {
        const bookId = req.params.id;
        const uid = req.cookies.session;

        try {
            const book = await db.collection('books').doc(bookId).get();
            if (!book.exists || book.data().authorId !== uid) {
                return res.status(403).send({ message: 'Acesso negado' });
            }
            res.status(200).send({ id: book.id, ...book.data() });
        } catch (error) {
            res.status(404).send(error);
        }
    });

    // Rota para atualizar um livro existente
    router.put('/:id', async (req, res) => {
        const bookId = req.params.id;
        const { title, authorId, content, tags } = req.body;
        try {
            const bookRef = db.collection('books').doc(bookId);
            const bookDoc = await bookRef.get();

            if (!bookDoc.exists) {
                return res.status(404).send({ message: 'Livro não encontrado' });
            }

            await bookRef.update({ title, authorId, content, tags });
            res.status(200).send({ message: 'Livro atualizado com sucesso!' });
        } catch (error) {
            res.status(400).send(error);
        }
    });

    // Rota para deletar um livro
    router.delete('/:id', async (req, res) => {
        const bookId = req.params.id;
        try {
            const bookRef = db.collection('books').doc(bookId);
            const bookDoc = await bookRef.get();

            if (!bookDoc.exists) {
                return res.status(404).send({ message: 'Livro não encontrado' });
            }

            await bookRef.delete();
            res.status(200).send({ message: 'Livro deletado com sucesso' });
        } catch (error) {
            res.status(400).send(error);
        }
    });

    return router;
};
