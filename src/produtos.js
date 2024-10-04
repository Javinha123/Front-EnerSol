import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const Produtos = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [formData, setFormData] = useState({ nome: '', valor: '', potencia: '', tamanho: '', quantidade: '' });
  const [editId, setEditId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/geradores');
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
      setFormData({ nome: '', valor: '', potencia: '', tamanho: '', quantidade: '' });
      setEditId(null);
    }
  };

  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `http://localhost:8000/api/geradores/${editId}` : 'http://localhost:8000/api/geradores';
    
    try {
      const response = await fetch(url, {
        method,
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

  const handleViewInfo = (item) => {
    setSelectedItem(item);
    setOpenInfo(true);
  };

  const handleCloseInfo = () => setOpenInfo(false);

  return (
    <div className='containerProd'>
      <div className='contProd'>
        <div className="header">
          <h1 className='tprod'>Dashboard - Geradores</h1>
          <Button variant="contained" onClick={() => handleClickOpen()}>
            Cadastrar Gerador
          </Button>
        </div>
        <div className='tabelaProd'>
          {loading ? (
            <p>Carregando...</p>
          ) : (
            <TableContainer component={Paper} style={{ maxHeight: 500, width: '100%', borderRadius: '15px' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: '800', fontSize: '15px' }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: '800', fontSize: '15px' }}>Nome</TableCell>
                    <TableCell sx={{ fontWeight: '800', fontSize: '15px' }}>Valor</TableCell>
                    <TableCell sx={{ fontWeight: '800', fontSize: '15px' }}>Quantidade</TableCell>
                    <TableCell sx={{ fontWeight: '800', fontSize: '15px' }}>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.nome}</TableCell>
                      <TableCell>{item.valor}</TableCell>
                      <TableCell>{item.quantidade}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleViewInfo(item)} style={{ backgroundColor: 'green', color: 'white', borderRadius: '8px', width: '45px', height: '35px', marginLeft: '5px' }}>
                          <AddIcon />
                        </IconButton>
                        <IconButton onClick={() => handleClickOpen(item)} style={{ backgroundColor: '#F3A30A', color: 'white', borderRadius: '8px', width: '45px', height: '35px', marginLeft: '5px' }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(item.id)} style={{ backgroundColor: 'red', color: 'white', borderRadius: '8px', width: '45px', height: '35px', marginLeft: '5px' }}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>

        {/* Modal para criar/editar */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle sx={{ backgroundColor: '#0033A0', textAlign: 'center', color: 'white' }}>
            {editId ? 'Editar Gerador' : 'Novo Gerador'}
          </DialogTitle>
          <DialogContent sx={{ backgroundColor: '#EDF1FD' }}>
            <TextField margin="dense" label="Nome" type="text" fullWidth value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} />
            <TextField margin="dense" label="Valor" type="number" fullWidth value={formData.valor} onChange={(e) => setFormData({ ...formData, valor: e.target.value })} />
            <TextField margin="dense" label="Potência" type="number" fullWidth value={formData.potencia} onChange={(e) => setFormData({ ...formData, potencia: e.target.value })} />
            <TextField margin="dense" label="Tamanho" type="number" fullWidth value={formData.tamanho} onChange={(e) => setFormData({ ...formData, tamanho: e.target.value })} />
            <TextField margin="dense" label="Quantidade" type="number" fullWidth value={formData.quantidade} onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })} />
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', backgroundColor: '#EDF1FD' }}>
            <Button onClick={handleClose} sx={{ backgroundColor: 'red', color: 'white', borderRadius: '10px', width: '100px' }}>Cancelar</Button>
            <Button onClick={handleSave} sx={{ backgroundColor: '#0033A0', color: 'white', borderRadius: '10px', width: '100px' }}>Salvar</Button>
          </DialogActions>
        </Dialog>

        {/* Modal para exibir informações */}
        <Dialog open={openInfo} onClose={handleCloseInfo}>
          <DialogTitle>Informações do Gerador</DialogTitle>
          <DialogContent>
            {selectedItem && (
              <>
                <p><strong>ID:</strong> {selectedItem.id}</p>
                <p><strong>Nome:</strong> {selectedItem.nome}</p>
                <p><strong>Valor:</strong> {selectedItem.valor}</p>
                <p><strong>Potência:</strong> {selectedItem.potencia}</p>
                <p><strong>Tamanho:</strong> {selectedItem.tamanho}</p>
                <p><strong>Quantidade:</strong> {selectedItem.quantidade}</p>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseInfo}>Fechar</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Produtos;
