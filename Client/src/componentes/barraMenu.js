import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useLocation } from 'react-router-dom';


const BarraMenu = () => {
    const [usuarioEmail, setUsuarioEmail] = useState(null);
    const location = useLocation(); // Hook para pegar a URL atual da aplicação

    // Verifica se o usuário está logado e atualiza o estado
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setUsuarioEmail(user.email);
            } else {
                setUsuarioEmail(null);
            }
        });

        return () => unsubscribe();
    }, []); 

    // Função para desconectar o usuário
    const handleLogout = async () => {
        try {
            await signOut(auth); // Desconecta o usuário usando o Firebase Authentication
            console.log('Usuário desconectado'); 
            window.location.href = '/';  
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    // Verifica se a página atual é a tela de login ("/")
    const isLoginPage = location.pathname === '/';

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow-sm">
            <div className="container-fluid">
                {/* Logo e Nome do Site */}
                <div className="d-flex align-items-center">
                    <img 
                        src={`${process.env.PUBLIC_URL}logo.png`} 
                        alt="Logo" 
                        className="logo img-fluid" 
                        style={{ width: '40px', height: 'auto' }} 
                    />
                    <span className="navbar-brand ms-2 text-white fw-bold pl-4">Letras & Lendas</span>
                </div>

                {/* Nome do Usuário e Botão de Logout */}
                {!isLoginPage && usuarioEmail && ( // Exibe o e-mail do usuário e o botão "Sair" somente se NÃO estiver na página de login e o usuário estiver logado
                    <div className="d-flex align-items-center ms-auto">
                        <span className="text-white me-4 pr-3 fw-normal">{usuarioEmail}</span> {/* Espaço adicionado entre e-mail e botão */}
                        <button 
                            className="btn btn-outline-light btn-sm rounded-3" 
                            onClick={handleLogout}
                        >
                            Sair
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default BarraMenu;

