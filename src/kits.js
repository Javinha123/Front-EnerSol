import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Paper, Dialog, DialogTitle,
  DialogContent, TextField, DialogActions, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const Kits = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [formData, setFormData] = useState({ nome: '', valor: '', quantidade: '', geradorId: '', placaId: '', img: null });
  const [editId, setEditId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [generators, setGenerators] = useState([]);
  const [panels, setPanels] = useState([]);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Load kit data
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/kits');
        const data = await response.json();
        setItems(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching kits:', error);
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Load generators and panels data
  useEffect(() => {
    const fetchGeneratorsAndPanels = async () => {
      try {
        const [generatorsResponse, panelsResponse] = await Promise.all([
          fetch('http://localhost:8000/api/geradores'),
          fetch('http://localhost:8000/api/placas')
        ]);

        const generatorsData = await generatorsResponse.json();
        const panelsData = await panelsResponse.json();

        setGenerators(generatorsData);
        setPanels(panelsData);
      } catch (error) {
        console.error('Error fetching generators and panels:', error);
      }
    };

    fetchGeneratorsAndPanels();
  }, []);

  const handleViewInfo = (item) => {
    setSelectedItem(item);
    setOpenInfo(true);
  };

  const handleClickOpen = (item = null) => {
    setOpen(true);
    if (item) {
      setFormData({ ...item, img: null });
      setEditId(item.id);
    } else {
      setFormData({ nome: '', valor: '', quantidade: '', geradorId: '', placaId: '', img: null });
      setEditId(null);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setOpenInfo(false);
    setOpenConfirmDelete(false);
  };

  const handleSave = async () => {
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `http://localhost:8000/api/kits/${editId}` : 'http://localhost:8000/api/kits';

    const formDataToSend = new FormData();
    formDataToSend.append('nome', formData.nome);
    formDataToSend.append('valor', formData.valor);
    formDataToSend.append('quantidade', formData.quantidade);
    formDataToSend.append('gerador_id', formData.geradorId);
    formDataToSend.append('placa_id', formData.placaId);
    if (formData.img) {
      formDataToSend.append('img', formData.img);
    }

    try {
      const response = await fetch(url, {
        method: method,
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Error in request');
      }

      const savedItem = await response.json();

      if (method === 'POST') {
        setItems([...items, savedItem]);
      } else {
        setItems(items.map(item => item.id === editId ? savedItem : item));
      }

      handleClose();
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleDelete = (id) => {
    setItemToDelete(id);
    setOpenConfirmDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await fetch(`http://localhost:8000/api/kits/${itemToDelete}`, {
        method: 'DELETE',
      });
      setItems(items.filter(item => item.id !== itemToDelete));
      handleClose();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className='containerProd'>
      <div className='contProd'>
        <div className="header">
          <h1 className='tus'>Dashboard - Kits</h1>
          <Button variant="contained" backgroundColor='#0033A0' onClick={() => handleClickOpen()}>
            Adicionar novo kit
          </Button>
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <TableContainer component={Paper} style={{ maxHeight: 500, width: '100%', borderRadius: '15px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell>Valor</TableCell>
                  <TableCell>Quantidade</TableCell>
                  <TableCell>GeradorID</TableCell>
                  <TableCell>PlacaID</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.nome}</TableCell>
                    <TableCell>{item.valor}</TableCell>
                    <TableCell>{item.quantidade}</TableCell>
                    <TableCell>{item.gerador_id}</TableCell>
                    <TableCell>{item.placa_id}</TableCell>
                    <TableCell>
                      <IconButton
                        style={{ backgroundColor: 'green', color: 'white', borderRadius: '8px', width: '45px', height: '35px' }}
                        onClick={() => handleViewInfo(item)}
                      >
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

        {/* Modal for creating/editing */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle sx={{ backgroundColor: '#0033A0', textAlign: 'center', color: 'white' }}>{editId ? 'Editar Kit' : 'Novo Kit'}</DialogTitle>
          <DialogContent sx={{ backgroundColor: '#EDF1FD' }}>
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
              label="Quantidade"
              type="number"
              fullWidth
              value={formData.quantidade}
              onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="gerador-label">Gerador</InputLabel>
              <Select
                labelId="gerador-label"
                value={formData.geradorId}
                onChange={(e) => setFormData({ ...formData, geradorId: e.target.value })}
              >
                {generators.map((generator) => (
                  <MenuItem key={generator.id} value={generator.id}>
                    {generator.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel id="placa-label">Placa</InputLabel>
              <Select
                labelId="placa-label"
                value={formData.placaId}
                onChange={(e) => setFormData({ ...formData, placaId: e.target.value })}
              >
                {panels.map((panel) => (
                  <MenuItem key={panel.id} value={panel.id}>
                    {panel.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
            margin="dense"
            type="file"
            fullWidth
            inputProps={{ accept: 'image/*' }}
            onChange={(e) => setFormData({ ...formData, img: e.target.files[0] })}
            />
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', backgroundColor: '#EDF1FD' }}>
            <Button onClick={handleClose} sx={{ backgroundColor: 'red', color: 'white' }}>Cancelar</Button>
            <Button onClick={handleSave} sx={{ backgroundColor: '#0033A0', color: 'white' }}>Salvar</Button>
          </DialogActions>
        </Dialog>

        {/* Modal to view kit information */}
        <Dialog open={openInfo} onClose={handleClose}>
          <DialogTitle sx={{ backgroundColor: '#527EDD', textAlign: 'center', color: 'white' }}>Informações do Kit</DialogTitle>
          <DialogContent>
            {selectedItem && (
              <div className='info'>
                <h1>ID: {selectedItem.id}</h1>
                <h1>Nome: {selectedItem.nome}</h1>
                <h1>Valor: {selectedItem.valor}</h1>
                <h1>Quantidade: {selectedItem.quantidade}</h1>
                <h1>GeradorID: {selectedItem.gerador_id}</h1>
                <h1>PlacaID: {selectedItem.placa_id}</h1>
                {selectedItem.img && <img src={selectedItem.img} alt="Kit" style={{ maxWidth: '100%', maxHeight: '200px' }} />}
              </div>
            )}
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button onClick={handleClose} sx={{ backgroundColor: 'red', color: 'white' }}>Fechar</Button>
          </DialogActions>
        </Dialog>

        {/* Confirmation delete modal */}
        <Dialog open={openConfirmDelete} onClose={handleClose}>
          <DialogTitle sx={{ backgroundColor: '#527EDD', textAlign: 'center', color: 'white' }}>Confirmar Exclusão</DialogTitle>
          <DialogContent sx={{ backgroundColor: '#527EDD', color: 'white' }}>
            <p>Você tem certeza que deseja excluir este item?</p>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', backgroundColor: '#527EDD' }}>
            <Button onClick={handleClose} sx={{ backgroundColor: 'red', color: 'white' }}>Cancelar</Button>
            <Button onClick={confirmDelete} sx={{ backgroundColor: '#0033A0', color: 'white' }}>Confirmar</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Kits;
