import React, { useState } from 'react';
import { db } from '../firebase';  // Corrigido: importando 'app' e 'db' como exportações nomeadas
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';  // Para navegação após salvar

const Livro = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Função para salvar o livro no Firestore
    const handleSave = async () => {
        if (!title || !content) {
            setError('Título e conteúdo são obrigatórios.');
            return;
        }

        // Reseta qualquer erro anterior
        setError('');
        try {
            // Adiciona um novo documento no Firestore
            await addDoc(collection(db, 'books'), {
                title,
                content,
                createdAt: new Date(),
            });
    
            // Limpar campos após salvar
            setTitle('');
            setContent('');
    
            // Redireciona para a página de livros
            navigate('/livros');
        } catch (error) {
            setError('Erro ao salvar o livro. Tente novamente mais tarde.');
            console.error('Erro ao salvar livro:', error.message);
        }
    };

    return (
        <div>
            <h2>Adicionar Livro</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                type="text"
                placeholder="Título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                placeholder="Conteúdo"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <button onClick={handleSave}>Salvar</button>
        </div>
    );
};

export default Livro;
