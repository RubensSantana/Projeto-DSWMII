import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, deleteDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import '../css/estilo.css';

const LivroDetalhado = () => {
    const [book, setBook] = useState(null);
    const [chapters, setChapters] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        // Função para buscar o livro com o id fornecido
        const fetchBook = async () => {
            try {
                const bookRef = doc(db, 'books', id);
                const bookDoc = await getDoc(bookRef);
                if (bookDoc.exists()) {
                    setBook(bookDoc.data());
                }
            } catch (error) {
                console.error('Erro ao carregar o livro:', error);
            }
        };

        // Função para buscar os capítulos do livro
        const fetchChapters = async () => {
            try {
                const chaptersQuery = query(
                    collection(db, 'books', id, 'chapters'),
                    orderBy('createdAt') // Ordenar por createdAt para garantir a ordem de criação
                );
                const chaptersSnapshot = await getDocs(chaptersQuery);
                setChapters(chaptersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error('Erro ao carregar capítulos:', error.message);
            }
        };

        fetchBook();
        fetchChapters();
    }, [id]);

    // Função para excluir o livros
    const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, 'books', id));
            navigate('/painel');
        } catch (error) {
            console.error('Erro ao excluir o livro:', error);
        }
    };

    // Função para voltar para a página do painel
    const handleBack = () => {
        navigate('/painel');
    };

    return (
        <div className="container mt-5 pt-3">
            <h2 className="mb-4 text-dark">Visualização Completa do Livro</h2>
            {book ? (
                <>
                    <h3 className="mt-3 text-primary">{book.title}</h3>
                    <p className="fs-5 text-muted">{book.content}</p>
                    
                    {/* Exibir conteúdo dos capítulos */}
                    {chapters.length > 0 ? (
                        <div className="mt-4">
                            <h4 className="text-primary">Capítulos</h4>
                            {chapters.map((chapter, index) => (
                                <div key={chapter.id} className="mb-4 p-3 bg-light rounded shadow-sm">
                                    <h5 className="text-info">Capítulo {index + 1}: {chapter.title}</h5>
                                    <p>{chapter.content}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted">Nenhum capítulo disponível.</p>
                    )}
                </>
            ) : (
                <div className="alert alert-info mt-4">Carregando...</div>
            )}

            {/* Botões fixos no canto superior direito */}
            <div className="fixed-buttons">
                <button onClick={handleDelete} className="btn btn-danger shadow-sm">
                    Excluir Livro
                </button>
                <button onClick={handleBack} className="btn btn-secondary shadow-sm ms-2">
                    Voltar
                </button>
            </div>
        </div>
    );
};

export default LivroDetalhado;
