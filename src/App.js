import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Compra from './compra';
import VisuCarrinho from './visucarrinho';
import Carrinho from './carrinho'; // Importando o componente Carrinho
import Finalizar from './finalizar'; // Importando o componente Finalizar
import Main from './main';
import Dashboard from './placas';
import Kits from './kits';
import Usuarios from './usuarios';
import Geradores from './geradores';

const Navegacao = () => {
    const [isScrolled, setIsScrolled] = useState(false); // Estado para verificar se a página foi rolada

    // Hook para monitorar o scroll da página
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) { // Altera a classe quando rolar mais de 50px
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll); // Remove o ouvinte ao desmontar
        };
    }, []);

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <Link to="/kits">Kits</Link> 
            <Link to="/main">Main</Link> 
            <Link to="/placas">Placas</Link>
            <Link to="/usuarios">Usuários</Link> 
            <Link to="/geradores">Geradores</Link>
            <Link to="/compra">Compra</Link>
            <Link to="/carrinho">Carrinho</Link>
            <Link to="/finalizar">Finalizar</Link>
        </nav>
            );
        };
        
        
    


const App = () => {
    return (
        <BrowserRouter>
            <Navegacao /> {/* Navegação exibida em todas as páginas */}
            <Routes>
                <Route path="/compra" element={<Compra />} />
                <Route path="/produto/:tipo/:id" element={<VisuCarrinho />} />
                <Route path="/carrinho" element={<Carrinho />} />
                <Route path="/finalizar" element={<Finalizar />} /> {/* Rota para Finalizar */}
                <Route path="/main" element={<Main />} />
                <Route path="/placas" element={<Dashboard />} />
                <Route path="/kits" element={<Kits />} />
                <Route path="/usuarios" element={<Usuarios />} />
                <Route path="/geradores" element={<Geradores />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
