import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from './firebase';

// Criando o contexto de autenticação
const AuthContext = createContext();

// Componente AuthProvider irá envolver a aplicação, fornecendo o contexto de autenticação
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Função para observar as mudanças no estado de autenticação
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                const token = await currentUser.getIdToken();
                setUser({ uid: currentUser.uid, email: currentUser.email, token });
            } else {
                setUser(null);
            }
        });
        // Cleanup function que cancela o observador quando o componente for desmontado
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
