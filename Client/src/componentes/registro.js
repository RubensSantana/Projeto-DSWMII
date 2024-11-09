import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Registro = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    // Função para lidar com o envio do formulário de registro
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('Usuário registrado:', userCredential.user);
            navigate('/painel');
        } catch (error) {
            setError('Erro ao registrar. Tente novamente.');
            console.error(error.message);
        }
    };

    // Função para voltar para a página anterior
    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2 className="text-center mb-4">Registrar Novo Usuário</h2>
                    {error && <div className="alert alert-danger" role="alert">{error}</div>}
                    <form onSubmit={handleRegister} className="p-4 border rounded">
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Digite seu email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Senha</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Digite sua senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Registrar</button>
                    </form>
                    <div className="text-center mt-3">
                        <small>Já possui uma conta? <a href="/">Faça login</a></small>
                    </div>
                    {/* Botão de voltar */}
                    <div className="mt-3">
                        <button className="btn btn-secondary w-100" onClick={handleGoBack}>Voltar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registro;
