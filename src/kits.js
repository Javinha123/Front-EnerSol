import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Paper, Dialog, DialogTitle,
  DialogContent, TextField, DialogActions, Select, MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';

const Kits = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [formData, setFormData] = useState({ nome: '', valor: '', quantidade: '', geradorId: '', placaId: '' });
  const [editId, setEditId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [generators, setGenerators] = useState([]);
  const [panels, setPanels] = useState([]);
  const [itemToDelete, setItemToDelete] = useState(null); // ID do item a ser deletado

  // Carrega os dados dos kits
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/kits');
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

  // Carrega os dados dos geradores e placas
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
        console.error('Erro ao buscar geradores e placas:', error);
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
      setFormData(item);
      setEditId(item.id);
    } else {
      setFormData({ nome: '', quantidade: '', geradorId: '', placaId: '' });
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

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          nome: formData.nome,
          valor: formData.valor,
          quantidade: formData.quantidade,
          gerador_id: formData.geradorId,
          placa_id: formData.placaId
        }),
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

  const handleDelete = (id) => {
    setItemToDelete(id); // Armazena o ID do item a ser deletado
    setOpenConfirmDelete(true); // Abre a modal de confirmação
  };

  const confirmDelete = async () => {
    try {
      await fetch(`http://localhost:8000/api/kits/${itemToDelete}`, {
        method: 'DELETE',
      });
      setItems(items.filter(item => item.id !== itemToDelete));
      handleClose(); // Fecha a modal
    } catch (error) {
      console.error('Erro ao deletar item:', error);
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
                        className='iconeInfo'
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

        {/* Modal para criar/editar */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle sx={{ backgroundColor: '#0033A0', textAlign:'center', textDecoration:'bold', color:'white'}}>{editId ? 'Editar Kit' : 'Novo Kit'}</DialogTitle>
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
            <Select
              margin="dense"
              label="Gerador"
              fullWidth
              value={formData.geradorId}
              onChange={(e) => setFormData({ ...formData, geradorId: e.target.value })}
            >
              {generators.map((generator) => (
                <MenuItem key={generator.id} value={generator.id}>
                  {generator.nome}
                </MenuItem>
              ))}
            </Select>
            <Select
              margin="dense"
              label="Placa"
              fullWidth
              value={formData.placaId}
              onChange={(e) => setFormData({ ...formData, placaId: e.target.value })}
            >
              {panels.map((panel) => (
                <MenuItem key={panel.id} value={panel.id}>
                  {panel.nome}
                </MenuItem>
              ))}
            </Select>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', backgroundColor:'#EDF1FD' }}>
            <Button onClick={handleClose} sx={{backgroundColor:'red', color:'white', borderRadius:'10px', width:'100px'}}>Cancelar</Button>
            <Button onClick={handleSave} sx={{backgroundColor:'#0033A0', color:'white', borderRadius:'10px', width:'100px'}}>Salvar</Button>
          </DialogActions>
        </Dialog>

        {/* Modal para visualizar informações */}
        <Dialog open={openInfo} onClose={handleClose}>
          <DialogTitle sx={{ backgroundColor: '#527EDD', textAlign:'center', textDecoration:'bold', color:'white'}}>Informações do Kit</DialogTitle>
          <DialogContent>
            {selectedItem && (
              <div className='info'>
                <h1 className='id'>ID: {selectedItem.id}</h1>
                <h1>Nome: {selectedItem.nome}</h1>
                <h1>Valor: {selectedItem.valor}</h1>
                <h1>Quantidade: {selectedItem.quantidade}</h1>
                <h1>GeradorID: {selectedItem.gerador_id}</h1>
                <h1>PlacaID: {selectedItem.placa_id}</h1>
              </div>
            )}
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center'}}>
            <Button onClick={handleClose} sx={{backgroundColor:'red', color:'white', borderRadius:'10px', width:'100px'}}>
              Fechar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal de confirmação de exclusão */}
        <Dialog open={openConfirmDelete} onClose={handleClose}>
          <DialogTitle sx={{ backgroundColor: '#527EDD', textAlign:'center', textDecoration:'bold', color:'white'}}>Confirmar Exclusão</DialogTitle>
          <DialogContent sx={{ backgroundColor: '#527EDD', color:'white' }}>
            <p>Você tem certeza que deseja excluir este item?</p>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', backgroundColor:'#527EDD' }}>
            <Button onClick={handleClose} sx={{backgroundColor:'red', color:'white', borderRadius:'10px', width:'100px'}}>
              Cancelar
            </Button>
            <Button onClick={confirmDelete} sx={{backgroundColor:'#0033A0', color:'white', borderRadius:'10px', width:'100px'}}>
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Kits;
