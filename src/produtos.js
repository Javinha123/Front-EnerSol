import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Paper, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ nome: '', valor: '', potencia: '', tamanho: '', quantidade: '' });
  const [editId, setEditId] = useState(null);

  // Carrega os dados da API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/geradores'); // URL correta
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

  // Abre o modal para criar ou editar
  const handleClickOpen = (item = null) => {
    setOpen(true);
    if (item) {
      setFormData(item);
      setEditId(item.id);
    } else {
      setFormData({ nome: '', valor: '', potencia: '', tamanho: '', quantidade: '' });
      setEditId(null);
    }
  };

  // Fecha o modal
  const handleClose = () => {
    setOpen(false);
  };

  // Salva (cria ou edita) o item
  const handleSave = async () => {
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `http://localhost:8000/api/geradores/${editId}` : 'http://localhost:8000/api/geradores';
    
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(formData),
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


  // Exclui o item
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8000/api/geradores/${id}`, {
        method: 'DELETE',
      });
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Erro ao deletar item:', error);
    }
  };

  return (
    <div>
      <h1>Dashboard - Geradores</h1>
      <Button variant="contained" color="primary" style={{ marginBottom: '20px' }} onClick={() => handleClickOpen()}>
        Adicionar Geradores
      </Button>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Potência</TableCell>
                <TableCell>Tamanho</TableCell>
                <TableCell>Quantidade</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.nome}</TableCell>
                  <TableCell>{item.valor}</TableCell>
                  <TableCell>{item.potencia}</TableCell>
                  <TableCell>{item.tamanho}</TableCell>
                  <TableCell>{item.quantidade}</TableCell>
                  <TableCell>
                    <IconButton color="warning" onClick={() => handleClickOpen(item)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal para criar/editar */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editId ? 'Editar Compra' : 'Nova Compra'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nome"
            type="text"
            fullWidth
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Valor"
            type="number"
            fullWidth
            value={formData.valor}
            onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
          />
          
          <TextField
            margin="dense"
            label="Potência"
            type="number"
            fullWidth
            value={formData.potencia}
            onChange={(e) => setFormData({ ...formData, potencia: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Tamanho"
            type="number"
            fullWidth
            value={formData.tamanho}
            onChange={(e) => setFormData({ ...formData, tamanho: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Quantidade"
            type="number"
            fullWidth
            value={formData.quantidade}
            onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSave} color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Dashboard;
