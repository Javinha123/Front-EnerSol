import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Box,
    Avatar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { green, red } from '@mui/material/colors';

const Dashboard = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [detailOpen, setDetailOpen] = useState(false);
    const [formData, setFormData] = useState({ nome: '', valor: '', potencia: '', tamanho: '', quantidade: '', img: '' });
    const [editId, setEditId] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/placas');
                const data = await response.json();
                setItems(data);
                setLoading(false);
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    const handleClickOpen = (item = null) => {
        setOpen(true);
        if (item) {
            setFormData(item);
            setEditId(item.id);
        } else {
            setFormData({ nome: '', valor: '', potencia: '', tamanho: '', quantidade: '', img: '' });
            setEditId(null);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setDetailOpen(false);
    };

    const handleDetailOpen = (item) => {
        setSelectedItem(item);
        setDetailOpen(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, img: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        const formDataToSend = new FormData();
        formDataToSend.append('nome', formData.nome);
        formDataToSend.append('valor', formData.valor);
        formDataToSend.append('potencia', formData.potencia);
        formDataToSend.append('tamanho', formData.tamanho);
        formDataToSend.append('quantidade', formData.quantidade);
        
        if (formData.img) {
            const blob = await fetch(formData.img).then(res => res.blob());
            formDataToSend.append('img', blob, 'image.png'); // Altere 'image.png' para o nome que você deseja
        }
    
        const method = editId ? 'PUT' : 'POST';
        const url = editId ? `http://localhost:8000/api/placas/${editId}` : 'http://localhost:8000/api/placas';
        
        try {
            const response = await fetch(url, {
                method: method,
                body: formDataToSend,
            });
            if (!response.ok) {
                throw new Error('Erro na requisição');
            }
            const savedItem = await response.json();
            if (method === 'POST') {
                setItems([...items, savedItem]);
            } else {
                setItems(items.map(item => item.id === editId ? savedItem : item));
            }
            handleClose();
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/api/placas/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('Erro ao excluir a placa');
            }
            setItems(items.filter(item => item.id !== id)); // Atualiza a lista local
        } catch (error) {
            console.error('Erro ao excluir item:', error);
        }
    };
    

    return (
        <div className='containerProd'>
            <div style={{ padding: '20px' }}>
                <div className='contProd'>
                    <h1 className='tdash'>Adicionar Placas</h1>
                    <Box sx={{ maxHeight: '70vh', overflowY: 'auto'}}>
                        <Grid container spacing={2}>
                            {loading ? (
                                <p>Carregando...</p>
                            ) : (
                                items.map((item) => (
                                    <Grid item xs={12} key={item.id}>
                                        <Card style={{ borderRadius: '10px', boxShadow: '0 3px 6px rgba(0,0,0,0.1)', marginRight: '20px' }} onClick={() => handleDetailOpen(item)}>
                                            <CardContent style={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar src={item.img} style={{ width: 50, height: 50, marginRight: '15px' }} />
                                                <div style={{ flexGrow: 1 }}>
                                                    <Typography variant="h6">{item.nome}</Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {item.potencia}w
                                                    </Typography>
                                                    <Typography variant="body2" style={{ color: item.valor > 0 ? green[500] : red[500], fontWeight: 'bold' }}>
                                                        {item.valor > 0 ? 'ATIVO' : 'INATIVO'}
                                                    </Typography>
                                                </div>
                                                <Typography variant="h6" style={{ marginLeft: '15px' }}>
                                                    {item.valor}/{item.potencia}w
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))
                            )}
                            <Grid item xs={12}>
                                <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px', border: '2px dashed #527EDD', borderRadius: '10px', marginRight: '20px' }} onClick={() => handleClickOpen()}>
                                    <IconButton style={{ color: '#527EDD', fontSize: '35px' }}>
                                        <AddIcon />
                                    </IconButton>
                                    <Typography variant="h6" style={{ color: '#527EDD' }}> Nova Placa </Typography>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                    <Dialog open={open} onClose={handleClose} sx={{ borderRadius: '10px' }}>
                        <DialogTitle sx={{ backgroundColor: '#0033A0', textAlign: 'center', fontWeight: 'bold', color: 'white' }}>
                            {editId ? 'Editar Placa' : 'Nova Placa'}
                        </DialogTitle>
                        <DialogContent sx={{ backgroundColor: '#EDF1FD' }}>
                            <TextField margin="dense" label="Nome" placeholder='Digite seu nome' fullWidth value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} />
                            <TextField margin="dense" label="Valor" placeholder='Digite o valor' type="number" fullWidth value={formData.valor} onChange={(e) => setFormData({ ...formData, valor: e.target.value })} />
                            <TextField margin="dense" label="Potência" placeholder='Digite a potência' type="number" fullWidth value={formData.potencia} onChange={(e) => setFormData({ ...formData, potencia: e.target.value })} />
                            <TextField margin="dense" label="Tamanho" placeholder='Digite o tamanho' type="number" fullWidth value={formData.tamanho} onChange={(e) => setFormData({ ...formData, tamanho: e.target.value })} />
                            <TextField margin="dense" label="Quantidade" type="number" placeholder='Digite a quantidade' fullWidth value={formData.quantidade} onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })} />
                            <input type="file" accept="image/*" onChange={handleFileChange} />
                        </DialogContent>
                        <DialogActions sx={{ justifyContent: 'center', backgroundColor: '#EDF1FD' }}>
                            <Button onClick={handleClose} sx={{ backgroundColor: 'red', color: 'white', borderRadius: '10px', width: '100px' }}>Cancelar</Button>
                            <Button onClick={handleSave} sx={{ backgroundColor: '#0033A0', color: 'white', borderRadius: '10px', width: '100px' }}>Salvar</Button>
                        </DialogActions>
                    </Dialog>
                    {/* Novo Dialog para exibir detalhes da placa */}
                    <Dialog open={detailOpen} onClose={handleClose} sx={{ borderRadius: '10px' }}>
                        <DialogTitle sx={{ backgroundColor: '#0033A0', textAlign: 'center', fontWeight: 'bold', color: 'white' }}>
                            Detalhes da Placa
                        </DialogTitle>
                        <DialogContent sx={{ backgroundColor: '#EDF1FD' }}>
                            {selectedItem && (
                                <>
                                    <Avatar src={selectedItem.img} style={{ width: 100, height: 100, marginBottom: '10px' }} />
                                    <Typography variant="h6">Nome: {selectedItem.nome}</Typography>
                                    <Typography variant="body2">Potência: {selectedItem.potencia}</Typography>
                                    <Typography variant="body2">Valor: {selectedItem.valor}</Typography>
                                    <Typography variant="body2">Tamanho: {selectedItem.tamanho}</Typography>
                                    <Typography variant="body2">Quantidade: {selectedItem.quantidade}</Typography>
                                    <Typography variant="body2" style={{ color: selectedItem.valor > 0 ? green[500] : red[500], fontWeight: 'bold' }}>
                                        Status: {selectedItem.valor > 0 ? 'ATIVO' : 'INATIVO'}
                                    </Typography>
                                </>
                            )}
                        </DialogContent>
                        <DialogActions sx={{ justifyContent: 'center', backgroundColor: '#EDF1FD' }}>
                            <Button 
                                onClick={() => {
                                    handleDelete(selectedItem.id); // Chama a função de exclusão
                                    handleClose(); // Fecha o diálogo após a exclusão
                                }} 
                                sx={{ backgroundColor: 'red', color: 'white', borderRadius: '10px', width: '100px' }}
                            >
                                Excluir
                            </Button>
                            <Button onClick={handleClose} sx={{ backgroundColor: 'red', color: 'white', borderRadius: '10px', width: '100px' }}>
                                Fechar
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
