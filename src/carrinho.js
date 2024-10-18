import React, { useReducer, useEffect, useState } from 'react';
import Logosite from './assets/logosite.png';
import {
    Box,
    Avatar,
    CircularProgress,
    Button,
    IconButton,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// Reducer para gerenciar o estado do carrinho
const cartReducer = (state, action) => {
    switch (action.type) {
        case 'SET_PRODUCTS':
            return { ...state, produtos: action.payload, loading: false, error: null };
        case 'UPDATE_QUANTITY':
            return { ...state, produtos: action.payload };
        case 'REMOVE_ITEM':
            return { ...state, produtos: action.payload };
        case 'ERROR':
            return { ...state, loading: false, error: action.payload };
        case 'LOADING':
            return { ...state, loading: true };
        default:
            return state;
    }
};

const initialState = {
    produtos: [],
    loading: true,
    error: null,
};

const Carrinho = () => {
    const navigate = useNavigate();
    const [state, dispatch] = useReducer(cartReducer, initialState);
    const { produtos, loading, error } = state;
    const [openModal, setOpenModal] = useState(false); // Estado para controle da modal

    useEffect(() => {
        const fetchProdutos = async () => {
            dispatch({ type: 'LOADING' });
            try {
                const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
                if (carrinho.length === 0) throw new Error('Carrinho vazio.');

                const produtosData = await Promise.all(carrinho.map(fetchProduto));
                dispatch({ type: 'SET_PRODUCTS', payload: produtosData });
            } catch (error) {
                dispatch({ type: 'ERROR', payload: error.message });
            }
        };

        fetchProdutos();
    }, []);

    const fetchProduto = async (item) => {
        const urls = {
            placa: `http://localhost:8000/api/placas/${item.id}`,
            kit: `http://localhost:8000/api/kits/${item.id}`,
            gerador: `http://localhost:8000/api/geradores/${item.id}`,
        };
        const response = await fetch(urls[item.tipo]);
        if (!response.ok) throw new Error('Produto não encontrado.');
        const data = await response.json();
        return { ...data, quantidade: item.quantidade };
    };

    const handleUpdateQuantity = (id, novaQuantidade) => {
        const quantidade = Number(novaQuantidade);
        if (quantidade < 1 || isNaN(quantidade)) return;

        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        const updatedCarrinho = carrinho.map(item =>
            item.id === id ? { ...item, quantidade } : item
        );

        localStorage.setItem('carrinho', JSON.stringify(updatedCarrinho));
        dispatch({ type: 'UPDATE_QUANTITY', payload: updatedCarrinho });

        // Recarregar a página
        window.location.reload(); // Recarrega a página após a atualização
    };

    const handleRemoveItem = (id) => {
        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        const updatedCarrinho = carrinho.filter(item => item.id !== id); // Remove o item com o id especificado

        localStorage.setItem('carrinho', JSON.stringify(updatedCarrinho));
        dispatch({ type: 'REMOVE_ITEM', payload: updatedCarrinho });

        // Recarregar a página
        window.location.reload(); // Recarrega a página após a remoção
    };

    const calcularTotal = () => {
        return produtos.reduce((acc, produto) => {
            const valor = parseFloat(produto.valor) || 0;
            const quantidade = parseFloat(produto.quantidade) || 0;
            const subTotal = valor * quantidade;
            return acc + (isNaN(subTotal) ? 0 : subTotal);
        }, 0);
    };

    const handleCheckout = () => {
        const endereco = localStorage.getItem('endereco'); // Verifica se o endereço está salvo
        if (!endereco) {
            setOpenModal(true); // Abre a modal se o endereço não estiver cadastrado
        } else {
            navigate('/finalizar', { state: { total: calcularTotal() } });
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false); // Fecha a modal
    };

    const handleCadastrarEndereco = () => {
        navigate('/cadastrar-endereco'); // Navega para a página de cadastro de endereço
    };

    const handleJaTenho = () => {
        setOpenModal(false); // Fecha a modal
        navigate('/finalizar', { state: { total: calcularTotal() } }); // Navega para a página de finalização
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography variant="h6" color="error">Erro: {error}</Typography>;
    }

    if (produtos.length === 0) {
        return <Typography variant="h6">Nenhum produto no carrinho.</Typography>;
    }

    return (
        <div className='carrinhoContainer'>
            <header className="header-container">
                <div className="logo-container">
                    <img src={Logosite} alt="EnerSol logo" className="logo" />
                    <h1>EnerSol</h1>
                </div>
            </header>
            <Box sx={{ padding: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <div className="cartContent">
                    <table className="cartTable">
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Preço</th>
                                <th>Quantidade</th>
                                <th>Sub-total</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {produtos.map(product => (
                                <ProductRow
                                    key={product.id}
                                    product={product}
                                    onUpdateQuantity={handleUpdateQuantity}
                                    onRemoveItem={handleRemoveItem} // Passa a função para excluir o item
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
                <OrderSummary total={calcularTotal()} onCheckout={handleCheckout} /> {/* Atualizado para usar o novo handler */}
            </Box>
            
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle sx={{ backgroundColor: '#527EDD', textAlign: 'center', color: 'white' }}>Endereço Não Cadastrado</DialogTitle>
                <DialogContent sx={{ backgroundColor: '#527EDD', color: 'white' }}>
                    <Typography variant="body1">
                        Querido cliente, você não possui um endereço cadastrado, por favor cadastre!
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', backgroundColor: '#527EDD' }}>
                    <Button onClick={handleCloseModal} sx={{ backgroundColor: '#0033A0', color: 'white' }}>
                        Ok
                    </Button>
                    <Button onClick={handleJaTenho} sx={{ backgroundColor: '#0033A0', color: 'white' }}>
                        Já tenho
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

const ProductRow = ({ product, onUpdateQuantity, onRemoveItem }) => (
    <tr>
        <td className="productInfo">
            <Avatar src={product.img || '/path/to/fallback/image.png'} style={{ width: '100px', height: '100px', borderRadius: '0px' }} />
            <Typography variant="h6">{product.nome}</Typography>
        </td>
        <td>R$ {parseFloat(product.valor).toFixed(2)}</td>
        <td>
            <input
                type="number"
                value={product.quantidade}
                min={1}
                onChange={(e) => onUpdateQuantity(product.id, e.target.value)}
                className="quantityInput"
            />
        </td>
        <td>R$ {(parseFloat(product.valor) * (product.quantidade || 0)).toFixed(2)}</td>
        <td>
            <IconButton onClick={() => onRemoveItem(product.id)}>
                <DeleteIcon />
            </IconButton>
        </td>
    </tr>
);

ProductRow.propTypes = {
    product: PropTypes.object.isRequired,
    onUpdateQuantity: PropTypes.func.isRequired,
    onRemoveItem: PropTypes.func.isRequired,
};

const OrderSummary = ({ total, onCheckout }) => (
    <div className="resumoPedido">
        <Box className="resumoBox">
            <Typography variant="h6" sx={{ marginBottom: '20px', color: 'white' }}>Resumo do pedido</Typography>
            <Typography variant="body1" sx={{ color: 'white' }}>
                Sub-total: R$ {total.toFixed(2)}
            </Typography>
            <Typography variant="h6" sx={{ marginTop: '10px', color: 'white' }} >
                Total: R$ {total.toFixed(2)}
            </Typography>
            <Button
                variant="contained"
                sx={{
                    marginTop: '20px',
                    backgroundColor: 'white',
                    color: '#0033A0',
                    width: '100%',
                    '&:hover': { backgroundColor: 'lightgray' }
                }}
                onClick={onCheckout}
            >
                Avançar
            </Button>
        </Box>
    </div>
);

OrderSummary.propTypes = {
    total: PropTypes.number.isRequired,
    onCheckout: PropTypes.func.isRequired,
};

export default Carrinho;
