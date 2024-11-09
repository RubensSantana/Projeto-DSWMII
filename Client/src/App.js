import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext'; // Importar o contexto
import Login from './componentes/login';
import Registro from './componentes/registro';
import Painel from './componentes/painel';
import Editor from './componentes/editor';
import LivroDetalhado from './componentes/livroDetalhado';
import BarraMenu from './componentes/barraMenu';
import CapitulosList from './componentes/capitulosList';
import CapituloEditor from './componentes/capituloEditor';

const App = () => {
    return (
        <AuthProvider> {/* Envolver a aplicação no AuthProvider */}
            <Router>
                <div>
                    <BarraMenu />
                    <div className="content">
                        <Routes>
                            <Route path="/" element={<Login />} />
                            <Route path="/registro" element={<Registro />} />
                            <Route path="/painel" element={<Painel />} />
                            <Route path="/editor" element={<Editor />} />
                            <Route path="/livro/:id" element={<LivroDetalhado />} />
                            <Route path="/livro/:bookId/capitulos" element={<CapitulosList />} />
                            <Route path="/livro/:bookId/capitulo/novo" element={<CapituloEditor />} />
                            <Route path="/livro/:bookId/capitulo/:chapterId" element={<CapituloEditor />} />
                        </Routes>
                    </div>
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
