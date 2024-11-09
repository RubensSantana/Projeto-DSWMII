import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, setDoc, getDoc, collection, addDoc } from 'firebase/firestore';

const CapituloEditor = () => {
    const { bookId, chapterId } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Hook para navegação entre páginas

    // Para carregar os dados o capítulo
    useEffect(() => {
        const fetchChapter = async () => {
            if (chapterId) {
                try {
                    const chapterRef = doc(db, 'books', bookId, 'chapters', chapterId);
                    const chapterDoc = await getDoc(chapterRef);
                    if (chapterDoc.exists()) {
                        setTitle(chapterDoc.data().title);
                        setContent(chapterDoc.data().content);
                    }
                } catch (error) {
                    setError('Erro ao carregar capítulo.');
                    console.error('Erro ao carregar capítulo:', error.message);
                }
            }
        };
        fetchChapter();
    }, [bookId, chapterId]);

    // Função para salvar (adicionar ou editar) o capítulo
    const handleSave = async () => {
        if (!title || !content) {
            setError('Título e conteúdo são obrigatórios.');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            if (chapterId) {
                // Atualizar capítulo existente
                const chapterRef = doc(db, 'books', bookId, 'chapters', chapterId);
                await setDoc(chapterRef, { title, content, createdAt: new Date() });
            } else {
                // Adicionar novo capítulo
                const chaptersCollection = collection(db, 'books', bookId, 'chapters');
                await addDoc(chaptersCollection, { title, content, createdAt: new Date() });
            }
            navigate(`/livro/${bookId}/capitulos`);
        } catch (error) {
            setError('Erro ao salvar capítulo. Tente novamente mais tarde.');
            console.error('Erro ao salvar capítulo:', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Função para voltar à página de capítulos sem salvar
    const handleBack = () => {
        navigate(`/livro/${bookId}/capitulos`);
    };

    return (
        <div className="container mt-5 pt-3">
            <h2 className="mb-4 text-dark">{chapterId ? 'Editar Capítulo' : 'Adicionar Capítulo'}</h2>
            
            {error && <div className="alert alert-danger mb-3">{error}</div>}

            <div className="form-group mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Título do Capítulo"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div className="form-group mb-4">
                <textarea
                    className="form-control"
                    placeholder="Conteúdo do Capítulo"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows="10"
                />
            </div>

            <div className="d-flex justify-content-between mt-4">
                <button
                    className="btn btn-success shadow-sm px-4"
                    onClick={handleSave}
                    disabled={isLoading}
                >
                    {isLoading ? 'Salvando...' : 'Salvar Capítulo'}
                </button>

                <button
                    onClick={handleBack}
                    className="btn btn-secondary shadow-sm px-4"
                >
                    Voltar
                </button>
            </div>
        </div>
    );
};

export default CapituloEditor;
