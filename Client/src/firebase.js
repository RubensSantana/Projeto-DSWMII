import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyALBccIK81ynPZ0uzbO6v2RtBSbzyJ9PLE",
    authDomain: "letras-e-lendas.firebaseapp.com",
    projectId: "letras-e-lendas",
    storageBucket: "letras-e-lendas.firebasestorage.app",
    messagingSenderId: "416502395803",
    appId: "1:416502395803:web:b336818d513e595ee4e73e"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);  
const auth = getAuth(app);  // Inicializa a autenticação
const db = getFirestore(app);  // Inicializa o Firestore

// Função de login
const login = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCredential.user.getIdToken();

        console.log('idToken gerado:', idToken);  // Verifica se o token está correto

        // Enviar o idToken para o servidor
        const response = await fetch('http://localhost:8000/autenticacao/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken }),
        });

        if (!response.ok) {
            throw new Error('Erro ao autenticar no servidor');
        }

        const data = await response.json();
        console.log('Usuário autenticado com UID:', data.uid);
    } catch (error) {
        console.error('Erro no login:', error.message);
        throw error; // Lançar o erro para ser tratado no componente
    }
};

// Função de logout
const logout = async () => {
    try {
        await signOut(auth);
        console.log('Usuário deslogado com sucesso');
        localStorage.removeItem('uid');  // Remove o UID após logout
    } catch (error) {
        console.error('Erro ao deslogar:', error.message);
    }
};

// Exportando funções de login, logout e Firebase
export { app, auth, db, login, logout };

