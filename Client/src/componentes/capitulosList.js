import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';

const CapitulosList = () => {
    const { bookId } = useParams();
    const [chapters, setChapters] = useState([]);
    const navigate = useNavigate();

    // Efeito para buscar os capítulos do livro
    useEffect(() => {
        const fetchChapters = async () => {
            try {
                const chaptersSnapshot = await getDocs(collection(db, 'books', bookId, 'chapters'));
                setChapters(chaptersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error('Erro ao buscar capítulos:', error.message);
            }
        };
        fetchChapters();
    }, [bookId]);

    // Função para excluir um capítulo
    const handleDelete = async (chapterId) => {
        if (window.confirm('Tem certeza que deseja excluir este capítulo?')) {
            try {
                await deleteDoc(doc(db, 'books', bookId, 'chapters', chapterId));
                setChapters(chapters.filter(chapter => chapter.id !== chapterId));
                alert('Capítulo excluído com sucesso!');
            } catch (error) {
                console.error('Erro ao excluir capítulo:', error.message);
                alert('Erro ao excluir o capítulo.');
            }
        }
    };


    // Função para voltar à página do livro
    const handleBack = () => {
        navigate(`/livro/${bookId}`);
    };

    return (
        <div className="container mt-5 pt-3">
            <h2>Capítulos do Livro</h2>
            <Link to={`/livro/${bookId}/capitulo/novo`} className="btn btn-primary mb-3">Adicionar Capítulo</Link>
            <ul className="list-group">
                {chapters.map(chapter => (
                    <li key={chapter.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <Link to={`/livro/${bookId}/capitulo/${chapter.id}`}>{chapter.title}</Link>
                        <button 
                            className="btn btn-danger btn-sm ms-2" 
                            onClick={() => handleDelete(chapter.id)}
                        >
                            Excluir
                        </button>
                    </li>
                ))}
            </ul>
            <button onClick={handleBack} className="btn btn-secondary mt-3">Voltar</button>
        </div>
    );
};

export default CapitulosList;
