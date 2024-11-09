const express = require('express');
const router = express.Router();

module.exports = (db) => {
    // Rota para adicionar um capítulo ao livro
    router.post('/:bookId/capitulos', async (req, res) => {
        const { bookId } = req.params;
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).send({ message: 'Título e conteúdo são obrigatórios.' });
        }

        try {
            const chapterRef = await db.collection('books').doc(bookId).collection('chapters').add({
                title,
                content,
                createdAt: new Date(),
            });
            res.status(201).send({ id: chapterRef.id });
        } catch (error) {
            res.status(500).send({ message: 'Erro ao adicionar capítulo.', error: error.message });
        }
    });

    // Rota para obter todos os capítulos de um livro
    router.get('/:bookId/capitulos', async (req, res) => {
        const { bookId } = req.params;
        try {
            const chaptersSnapshot = await db.collection('books').doc(bookId).collection('chapters').get();
            const chapters = chaptersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            res.status(200).send(chapters);
        } catch (error) {
            res.status(500).send({ message: 'Erro ao buscar capítulos.', error: error.message });
        }
    });

    // Rota para atualizar um capítulo específico
    router.put('/:bookId/capitulos/:chapterId', async (req, res) => {
        const { bookId, chapterId } = req.params;
        const { title, content } = req.body;

        try {
            const chapterRef = db.collection('books').doc(bookId).collection('chapters').doc(chapterId);
            await chapterRef.update({ title, content });
            res.status(200).send({ message: 'Capítulo atualizado com sucesso!' });
        } catch (error) {
            res.status(500).send({ message: 'Erro ao atualizar capítulo.', error: error.message });
        }
    });

    // Rota para deletar um capítulo específico
    router.delete('/:bookId/capitulos/:chapterId', async (req, res) => {
        const { bookId, chapterId } = req.params;

        try {
            const chapterRef = db.collection('books').doc(bookId).collection('chapters').doc(chapterId);
            await chapterRef.delete();
            res.status(200).send({ message: 'Capítulo deletado com sucesso!' });
        } catch (error) {
            res.status(500).send({ message: 'Erro ao deletar capítulo.', error: error.message });
        }
    });

    return router;
};
