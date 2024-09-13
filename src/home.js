import React, { useState } from 'react';
import axios from 'axios';

const UserRegistrationForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tipo, setType] = useState('');
  const [cep, setCep] = useState('');
  const [bairro, setBairro] = useState('');
  const [numero, setNumero] = useState('');
  const [cidade, setCidade] = useState('');
  const [rua, setRua] = useState('');
  const [cpf, setCpf] = useState('');
  const [documento, setDocumento] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Obtém o token CSRF do meta tag
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (!csrfToken) {
      console.error('CSRF token não encontrado');
      return;
    }

    // Monta o objeto dos dados de cadastro
    const dadosCadastro = {
      name,
      email,
      password,
      tipo,
      ...(tipo === 'pessoa comum' && cpf ? { cpf } : {}),
      ...(tipo === 'produtor rural' && documento ? { documento } : {}),
      ...(cep ? { cep } : {}),
      ...(bairro ? { bairro } : {}),
      ...(numero ? { numero } : {}),
      ...(cidade ? { cidade } : {}),
      ...(rua ? { rua } : {}),
    };

    try {
      const response = await axios.post('http://localhost:8000/api/usuarios', dadosCadastro, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken, // Envia o token CSRF no cabeçalho
        },
        withCredentials: true,  // Permite o envio de cookies
      });

      console.log('Cadastro realizado com sucesso:', response.data);
    } catch (error) {
      console.error('Erro ao cadastrar:', error.response ? error.response.data : error.message);
    }
  };

  return (

    
    <div className="container">

      
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nome</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Senha</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Tipo</label>
          <select
            className="form-control"
            value={tipo}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="">Selecione o tipo</option>
            <option value="pessoa comum">Pessoa Comum</option>
            <option value="produtor rural">Produtor Rural</option>
          </select>
        </div>

        {tipo === 'pessoa comum' && (
          <div className="mb-3">
            <label className="form-label">CPF</label>
            <input
              type="text"
              className="form-control"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              required
            />
          </div>
        )}

        {tipo === 'produtor rural' && (
          <div className="mb-3">
            <label className="form-label">Documento Produtor Rural</label>
            <input
              type="text"
              className="form-control"
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              required
            />
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">CEP</label>
          <input
            type="text"
            className="form-control"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Bairro</label>
          <input
            type="text"
            className="form-control"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Número</label>
          <input
            type="text"
            className="form-control"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Cidade</label>
          <input
            type="text"
            className="form-control"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Rua</label>
          <input
            type="text"
            className="form-control"
            value={rua}
            onChange={(e) => setRua(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Registrar
        </button>
      </form>
    </div>
  );
};

export default UserRegistrationForm;