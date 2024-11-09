import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';  // Função de login
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';  // Importa o auth para criar um novo usuário

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);  // Controle para mostrar tela de login ou cadastro
    const navigate = useNavigate();

    // Função de Login
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Por favor, preencha o email e a senha.');
            return;
        }
    
        try {
            // Login usando Firebase Authentication
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const idToken = await userCredential.user.getIdToken();  // Gera o idToken
    
            // Enviar o idToken para o servidor
            const response = await fetch('http://localhost:8000/autenticacao/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idToken }),  // Envia o idToken no corpo da requisição
            });
    
            if (!response.ok) {
                throw new Error('Erro ao autenticar no servidor');
            }
    
            const data = await response.json();
            console.log('Usuário autenticado com UID:', data.uid);  // Exibe o UID no console após o login
            navigate('/painel');  // Redireciona para o painel
    
        } catch (error) {
            setError('Erro ao autenticar. Tente novamente.');
            console.error(error.message);
        }
    };

    // Função de registro de novo usuário
    const handleRegister = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Por favor, preencha o email e a senha.');
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate('/painel');
        } catch (error) {
            setError('Erro ao registrar. Tente novamente.');
            console.error(error.message);
        }
    };
    

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
                <div className="card-body p-4">
                    <h2 className="text-center mb-4">{isRegistering ? 'Cadastro' : 'Login'}</h2>
                    {error && <p className="text-danger text-center">{error}</p>}
                    <form onSubmit={isRegistering ? handleRegister : handleLogin}>
                        <div className="mb-3">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                            {isRegistering ? 'Cadastrar' : 'Entrar'}
                        </button>
                    </form>
                    <div className="mt-3 text-center">
                        {isRegistering ? (
                            <p>
                                Já tem uma conta? <span className="text-primary" style={{ cursor: 'pointer' }} onClick={() => setIsRegistering(false)}>Faça login</span>
                            </p>
                        ) : (
                            <p>
                                Ainda não tem uma conta? <span className="text-primary" style={{ cursor: 'pointer' }} onClick={() => setIsRegistering(true)}>Cadastre-se</span>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
