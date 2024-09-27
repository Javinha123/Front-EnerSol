import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Paper, Dialog, DialogTitle,
  DialogContent, TextField, DialogActions, Select, MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Kits = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ nome: '', valor: '', quantidade: '', geradorId: '', placaId: '' });
  const [editId, setEditId] = useState(null);
  const [generators, setGenerators] = useState([]);  // Estado para armazenar os geradores
  const [panels, setPanels] = useState([]);  // Estado para armazenar as placas

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
          fetch('http://localhost:8000/api/geradores'), // URL dos geradores
          fetch('http://localhost:8000/api/placas')     // URL das placas
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

  // Abre o modal para criar ou editar
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

  // Fecha o modal
  const handleClose = () => {
    setOpen(false);
  };

  // Salva (cria ou edita) o item
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
            gerador_id: formData.geradorId,  // Enviando gerador_id
            placa_id: formData.placaId        // Enviando placa_id
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

  // Exclui o item
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8000/api/kits/${id}`, {
        method: 'DELETE',
      });
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Erro ao deletar item:', error);
    }
  };

  return (
    <div>
      <h1>Dashboard - Kits</h1>
      <Button variant="contained" color="primary" style={{ marginBottom: '20px' }} onClick={() => handleClickOpen()}>
        Adicionar Kits
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
        <DialogTitle>{editId ? 'Editar Kit' : 'Novo Kit'}</DialogTitle>
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
            label="Quantidade"
            type="number"
            fullWidth
            value={formData.quantidade}
            onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
          />

          {/* Select para Gerador */}
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

          {/* Select para Placa */}
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

export default Kits;
