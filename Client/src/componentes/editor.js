import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const Editor = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Função para salvar o livro no Firestore
    const handleSave = async () => {
        if (!title) {
            setError('O Título é obrigatório.');
            return;
        }

        // Reseta o erro e ativa o estado de carregamento
        setError('');
        setIsLoading(true);

        try {
            // // Adiciona o livro no Firestore
            await addDoc(collection(db, 'books'), {
                title,
                content,
                authorId: auth.currentUser.uid,
                createdAt: new Date(),
            });

            // Reseta os campos de entrada após salvar o livro
            setTitle('');
            setContent('');

            navigate('/painel');

        } catch (error) {
            setError('Erro ao salvar o livro. Tente novamente mais tarde.');
            console.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Função para navegar de volta à página anterior
    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="container mt-5 pt-3">
            <h2 className="mb-4 text-dark">Crie o seu Livro</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="form-group mb-3">
                <input
                    type="text"
                    placeholder="Título"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="form-control"
                />
            </div>

            <div className="form-group mb-3">
                <textarea
                    placeholder="Resumo do Livro (Opcional)"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="form-control"
                    rows="5"
                />
            </div>

            <div className="d-flex justify-content-between mt-4">
                <button
                    className="btn btn-success shadow-sm px-4"
                    onClick={handleSave}
                    disabled={isLoading}
                >
                    {isLoading ? 'Salvando...' : 'Salvar Livro'}
                </button>

                <button
                    className="btn btn-secondary shadow-sm px-4"
                    onClick={handleBack}
                >
                    Voltar
                </button>
            </div>
        </div>
    );
};

export default Editor;