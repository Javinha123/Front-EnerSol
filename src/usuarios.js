import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Paper, Dialog, DialogTitle,
  DialogContent, TextField, DialogActions, Select, MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add'; 
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom'; 




const Usuarios = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', tipo: '', cep: '', bairro: '',
    numero: '', cidade: '', rua: '', cpf: '', documento: ''
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [editId, setEditId] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

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

  const handleClose = () => setOpen(false);

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

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Erro na requisição: ${errorMessage}`);
      }

      if (method === 'POST') {
        const usersResponse = await fetch('http://localhost:8000/api/usuarios');
        const updatedUsers = await usersResponse.json();
        setUsers(updatedUsers);
      } else {
        const savedUser = await response.json();
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === editId ? savedUser : user))
        );
      }

      handleClose();
    } catch (error) {
      console.error('Erro ao salvar dados:', error.message);
    }
  };

  const handleDelete = (id) => {
    setUserToDelete(id);
    setOpenConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await fetch(`http://localhost:8000/api/usuarios/${userToDelete}`, { method: 'DELETE' });
      setUsers(users.filter(user => user.id !== userToDelete));
      setUserToDelete(null);
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
    } finally {
      setOpenConfirmDelete(false);
    }
  };

  const handleViewInfo = (user) => {
    setSelectedUser(user);
    setOpenInfo(true);
  };

  const handleCloseInfo = () => setOpenInfo(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className='containerProd'>
      <div>
        <div className='contProd'>
          <div className="header">
            <h1 className='tus'>Dashboard - Usuários</h1>
            <Button variant="contained" backgroundColor='#0033A0' onClick={() => handleClickOpen()}>
              Cadastrar Usuários
            </Button>
          </div>
          <div>
            {loading ? (
              <p>Carregando...</p>
            ) : (
              <TableContainer component={Paper} style={{ maxHeight: 500, width: '100%', borderRadius: '15px'}}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: '800', fontSize: '15px' }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: '800', fontSize: '15px' }}>Nome</TableCell>
                      <TableCell sx={{ fontWeight: '800', fontSize: '15px' }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: '800', fontSize: '15px' }}>Tipo</TableCell>
                      <TableCell sx={{ fontWeight: '800', fontSize: '15px' }}>Cidade</TableCell>
                      <TableCell sx={{ fontWeight: '800', fontSize: '15px' }}>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.tipo}</TableCell>
                        <TableCell>{user.cidade}</TableCell>
                        <TableCell>
                          <IconButton
                            style={{ backgroundColor: 'green', color: 'white', borderRadius: '8px', width: '45px', height: '35px' }}
                            onClick={() => handleViewInfo(user)}
                          >
                            <AddIcon />
                          </IconButton>
                          <IconButton
                            style={{ backgroundColor: '#F3A30A', color: 'white', borderRadius: '8px', width: '45px', height: '35px', marginLeft: '5px' }}
                            onClick={() => handleClickOpen(user)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            style={{ backgroundColor: 'red', color: 'white', borderRadius: '8px', width: '45px', height: '35px', marginLeft: '5px' }}
                            onClick={() => handleDelete(user.id)}
                          >
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
            <DialogTitle sx={{ backgroundColor: '#0033A0', textAlign:'center', textDecoration:'bold', color:'white'}}>{editId ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
            <DialogContent sx={{ backgroundColor: '#EDF1FD' }}>
              <TextField label="Nome" name="name" value={formData.name} onChange={handleChange} fullWidth margin="dense" />
              <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth margin="dense" />
              <TextField label="Senha" name="password" type="password" value={formData.password} onChange={handleChange} fullWidth margin="dense" />
              <Select label="Tipo" name="tipo" value={formData.tipo} onChange={handleChange} fullWidth margin="dense">
                <MenuItem value="pessoa comum">Pessoa física</MenuItem>
                <MenuItem value="produtor rural">Produtor rural</MenuItem>
              </Select>
              <TextField label="Cidade" name="cidade" value={formData.cidade} onChange={handleChange} fullWidth margin="dense" />
              <TextField label="Rua" name="rua" value={formData.rua} onChange={handleChange} fullWidth margin="dense" />
              <TextField label="Bairro" name="bairro" value={formData.bairro} onChange={handleChange} fullWidth margin="dense" />
              <TextField label="Número" name="numero" value={formData.numero} onChange={handleChange} fullWidth margin="dense" />
              <TextField label="CEP" name="cep" value={formData.cep} onChange={handleChange} fullWidth margin="dense" />
              <TextField label="CPF" name="cpf" value={formData.cpf} onChange={handleChange} fullWidth margin="dense" />
              {formData.tipo === 'produtor rural' && (
                <TextField label="Documento" name="documento" value={formData.documento} onChange={handleChange} fullWidth margin="dense" />
              )}
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', backgroundColor:'#EDF1FD' }}>
              <Button onClick={handleClose} sx={{backgroundColor:'red', color:'white', borderRadius:'10px', width:'100px'}}>Cancelar</Button>
              <Button onClick={handleSave} sx={{backgroundColor:'#0033A0', color:'white', borderRadius:'10px', width:'100px'}}>Salvar</Button>
            </DialogActions>
          </Dialog>

          {/* Modal para exibir informações */}
          <Dialog open={openInfo} onClose={handleCloseInfo}>
            <DialogTitle sx={{ backgroundColor: '#0033A0', textAlign:'center', textDecoration:'bold', color:'white'}}>Informações do Usuário</DialogTitle>
            <DialogContent sx={{ backgroundColor: '#EDF1FD' }}>
              {selectedUser && (
                <>
                  <TextField label="Senha" fullWidth margin="dense" value={selectedUser.password || ''} disabled />
                  <TextField label="Rua" fullWidth margin="dense" value={selectedUser.rua || ''} disabled />
                  <TextField label="CPF" fullWidth margin="dense" value={selectedUser.cpf || ''} disabled />
                  <TextField label="CEP" fullWidth margin="dense" value={selectedUser.cep || ''} disabled />
                  <TextField label="Documento" fullWidth margin="dense" value={selectedUser.documento || ''} disabled />
                  <TextField label="Número" fullWidth margin="dense" value={selectedUser.numero || ''} disabled />
                  <TextField label="Bairro" fullWidth margin="dense" value={selectedUser.bairro || ''} disabled />
                  <TextField label="Cidade" fullWidth margin="dense" value={selectedUser.cidade || ''} disabled />
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseInfo} color="primary">Fechar</Button>
            </DialogActions>
          </Dialog>

          {/* Modal de confirmação de exclusão */}
          <Dialog open={openConfirmDelete} onClose={() => setOpenConfirmDelete(false)}>
            <DialogTitle sx={{ backgroundColor: '#527EDD', textAlign:'center', textDecoration:'bold', color:'white'}}>Confirmar Exclusão</DialogTitle>
            <DialogContent sx={{ backgroundColor: '#527EDD', color:'white' }}>
              <h2>Tem certeza de que deseja excluir este usuário?</h2>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', backgroundColor:'#527EDD' }}>
              <Button onClick={() => setOpenConfirmDelete(false)} sx={{backgroundColor:'red', color:'white', borderRadius:'10px', width:'100px'}}>Cancelar</Button>
              <Button onClick={handleConfirmDelete} sx={{backgroundColor:'#0033A0', color:'white', borderRadius:'10px', width:'100px'}}>Excluir</Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Usuarios;
