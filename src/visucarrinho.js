import React, { useState, useEffect } from 'react';
import Logosite from './assets/logosite.png';
import { useParams, useNavigate } from 'react-router-dom'; // Adicione useNavigate
import {
    Card,
    CardContent,
    Typography,
    Box,
    Avatar,
    CircularProgress,
    Button
} from '@mui/material';

const VisuCarrinho = () => {
    const { tipo, id } = useParams();
    const navigate = useNavigate(); // Inicialize o useNavigate
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                let url;
                if (tipo === 'placa') {
                    url = `http://localhost:8000/api/placas/${id}`;
                } else if (tipo === 'kit') {
                    url = `http://localhost:8000/api/kits/${id}`;
                } else if (tipo === 'gerador') {
                    url = `http://localhost:8000/api/geradores/${id}`;
                } else {
                    throw new Error('Tipo de produto inválido.');
                }

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Produto não encontrado.');
                }

                const data = await response.json();
                setProduct(data);
                setLoading(false);
            } catch (error) {
                console.error('Erro ao buscar produto:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [tipo, id]);

    if (loading) {
        return <CircularProgress />;
    }
    
    if (error) {
        return <Typography variant="h6" color="error">Erro: {error}</Typography>;
    }
    
    if (!product) {
        return <Typography variant="h6">Produto não encontrado.</Typography>;
    }

    // Função para lidar com o clique no botão "Comprar"
    const handleBuyClick = () => {
        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        
        // Verifica se o produto já está no carrinho
        const produtoExistente = carrinho.find(item => item.id === product.id);
        
        if (produtoExistente) {
            // Se o produto já existe no carrinho, aumenta a quantidade
            produtoExistente.quantidade += 1;
        } else {
            // Se o produto não existe no carrinho, adiciona-o
            carrinho.push({ ...product, quantidade: 1, tipo });
        }

        // Armazena o carrinho atualizado no localStorage
        localStorage.setItem('carrinho', JSON.stringify(carrinho));

        // Redireciona para a página de carrinho
        navigate('/carrinho');
    };
    
    // Renderiza o produto encontrado
    return (
        <div className='visuContainer'>
            <header className="header-container">
                <div className="logo-container">
                    <img src={Logosite} alt="EnerSol logo" className="logo" />
                    <h1>EnerSol</h1>
                </div>
            </header>
            <Box sx={{ padding: '20px' }}>
                <Card style={{ maxWidth: '1000px', height: '500px', margin: 'auto', marginTop: '50px' }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                            <div className='boxCompra'>
                                <div className='boxImagem'>
                                    <Avatar src={product.img} style={{ width: '100px', height: '100%', borderRadius: '0px'}}/>
                                </div>
                                <div className='boxCont'>
                                    <Typography variant="h2">{product.nome}</Typography>
                                    <Typography variant="h6" style={{marginBottom: '20px'}}>{product.potencia} W</Typography>
                                    <Typography variant="h6">Descrição: {product.descricao}</Typography>
                                    <Typography variant="h4">Valor: R$ {product.valor}</Typography>
                                </div>
                            </div>
                            {/* Botão Comprar */}
                            <Button 
                                variant="contained"
                                onClick={handleBuyClick} // Adicione o manipulador de clique
                                sx={{ marginTop: '20px', width: '180px', height: '50px', backgroundColor: '#0033A0', borderRadius: '15px' }}
                            >
                                Comprar
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </div>
    );
};

export default VisuCarrinho;
