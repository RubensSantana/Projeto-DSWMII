import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useAuth } from '../AuthContext';

const Painel = () => {
    const [books, setBooks] = useState([]);
    const { user } = useAuth();

    // useEffect que é executado quando o componente é montado ou o usuário é alterado
    useEffect(() => {
        const fetchBooks = async () => {
            if (!user) return; // Se não houver usuário logado, não realiza a consulta

            try {
                // Criação da consulta no Firestore para buscar livros onde o autor é o usuário logado
                const booksQuery = query(
                    collection(db, 'books'),
                    where('authorId', '==', user.uid) // Filtra livros pelo UID do usuário
                );

                // Obtendo os livros do Firestore de acordo com a consulta criada
                const booksSnapshot = await getDocs(booksQuery);
                setBooks(booksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error('Erro ao buscar livros:', error.message);
            }
        };

        fetchBooks();
    }, [user]);

    return (
        <div className="container mt-5 pt-3">
            <h2 className="mb-4 text-dark">Lista de Livros</h2>
            <Link to="/editor" className="btn btn-primary mb-4 shadow-lg">Criar Novo Livro</Link>
            <ul className="list-group">
                {books.map(book => (
                    <li key={book.id} className="list-group-item d-flex justify-content-between align-items-center shadow-sm mb-3 border rounded">
                        <Link to={`/livro/${book.id}`} className="text-decoration-none text-dark fs-5">{book.title}</Link>
                        <div>
                            <Link to={`/livro/${book.id}/capitulos`} className="btn btn-outline-secondary btn-sm ms-2" style={{ borderRadius: '50px' }}>Capítulos</Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Painel;
