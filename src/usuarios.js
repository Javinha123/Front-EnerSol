import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Paper, Dialog, DialogTitle,
  DialogContent, TextField, DialogActions, Select, MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Usuarios = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [openInfo, setOpenInfo] = useState(false); // Modal de informações
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', tipo: '', cep: '', bairro: '',
    numero: '', cidade: '', rua: '', cpf: '', documento: ''
  });
  const [selectedUser, setSelectedUser] = useState(null); // Armazena o usuário selecionado para exibir informações
  const [editId, setEditId] = useState(null);

  // Função para carregar os dados dos usuários da API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/usuarios');
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Abre o modal para criar ou editar
  const handleClickOpen = (user = null) => {
    setOpen(true);
    if (user) {
      setFormData(user);
      setEditId(user.id);
    } else {
      setFormData({
        name: '', email: '', password: '', tipo: '', cep: '', bairro: '',
        numero: '', cidade: '', rua: '', cpf: '', documento: ''
      });
      setEditId(null);
    }
  };

  // Fecha o modal
  const handleClose = () => setOpen(false);

  // Salva (cria ou edita) o usuário
  const handleSave = async () => {
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `http://localhost:8000/api/usuarios/${editId}` : 'http://localhost:8000/api/usuarios';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Erro na requisição');

      const savedUser = await response.json();

      setUsers(editId 
        ? users.map(user => user.id === editId ? savedUser : user) 
        : [...users, savedUser]
      );
      handleClose();
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    }
  };

  // Exclui o usuário
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8000/api/usuarios/${id}`, { method: 'DELETE' });
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
    }
  };

  // Abre o modal com as informações do usuário
  const handleViewInfo = (user) => {
    setSelectedUser(user);
    setOpenInfo(true);
  };

  // Fecha o modal de informações
  const handleCloseInfo = () => setOpenInfo(false);

  return (
    <div>
      <h1>Dashboard - Usuários</h1>
      <Button 
        variant="contained" 
        color="primary" 
        style={{ marginBottom: '20px' }} 
        onClick={() => handleClickOpen()}
      >
        Novo Usuário
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
                <TableCell>Email</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Cidade</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={user.id || index}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.tipo}</TableCell>
                  <TableCell>{user.cidade}</TableCell>
                  <TableCell>
                    <IconButton color="warning" onClick={() => handleClickOpen(user)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(user.id)}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton color="info" onClick={() => handleViewInfo(user)}>
                      <VisibilityIcon />
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
        <DialogTitle>{editId ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
        <DialogContent>
          {/* ... Conteúdo do formulário de edição ... */}
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

      {/* Modal para exibir informações */}
      <Dialog open={openInfo} onClose={handleCloseInfo}>
        <DialogTitle>Informações do Usuário</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <>
              <TextField label="Senha" fullWidth margin="dense" value={selectedUser.password || ''} disabled />
              <TextField label="Rua" fullWidth margin="dense" value={selectedUser.rua || ''} disabled />
              <TextField label="CPF" fullWidth margin="dense" value={selectedUser.cpf || ''} disabled />
              <TextField label="CEP" fullWidth margin="dense" value={selectedUser.cep || ''} disabled />
              <TextField label="Documento" fullWidth margin="dense" value={selectedUser.documento || ''} disabled />
              <TextField label="Número" fullWidth margin="dense" value={selectedUser.numero || ''} disabled />
              <TextField label="Bairro" fullWidth margin="dense" value={selectedUser.bairro || ''} disabled />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInfo} color="secondary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Usuarios;
