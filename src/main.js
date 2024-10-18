import React, { useState } from 'react';
import axios from 'axios';
import Logosite from './assets/logosite.png';
import raio from './assets/raio.png';
import dinheiro from './assets/dinheiro.png';
import planta from './assets/planta.png';
import painel from './assets/painel.png';
import foto1 from './assets/card1.png';
import foto2 from './assets/card2.png';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const UserRegistrationForm = () => {
  // States for registration
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

  // States for login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');

  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
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
          'X-CSRF-TOKEN': csrfToken,
        },
        withCredentials: true,
      });
      console.log('Cadastro realizado com sucesso:', response.data);
    } catch (error) {
      console.error('Erro ao cadastrar:', error.response ? error.response.data : error.message);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/usuarios/login', {
        email: loginEmail,
        password: loginPassword,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        setLoginMessage('Login realizado com sucesso!');
      } else {
        setLoginMessage('Email ou senha inválidos.');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error.response ? error.response.data : error.message);
      setLoginMessage('Erro ao fazer login. Tente novamente.');
    }
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
  };

  return (
    <div>
      <header className="header-container">
        <div className="logo-container">
          <img src={Logosite} alt="EnerSol logo" className="logo" />
          <h1>EnerSol</h1>
        </div>
        <button className="buy-button">Quero comprar!</button>
      </header>

      <div className="container">
        <div className='containerazul'>
          <h2>|EnerSol</h2>
          <p className='p1'>Seja bem vindo!</p>
          <p className='p2'>Acesse sua conta agora mesmo.</p>
          <button className='btn-login'>ENTRAR</button>
        </div>

        <div className='login-box'>
          {/* Registration Form */}
          <div className="mb-3">
            <label className='tipo'>Tipo</label>
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
          <form onSubmit={handleRegisterSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder='Nome'
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder='E-mail'
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder='Senha'
              />
            </div>
            {tipo === 'pessoa comum' && (
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  required
                  placeholder='CPF'
                />
              </div>
            )}
            {tipo === 'produtor rural' && (
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  value={documento}
                  onChange={(e) => setDocumento(e.target.value)}
                  required
                  placeholder='Documento de produtor'
                />
              </div>
            )}
            <button type="submit" className="btn-register">
              Registrar
            </button>
          </form>
        </div>

        {/* Login Form */}
        <div className='login-box'>
          <h2>Login</h2>
          <form onSubmit={handleLoginSubmit}>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                placeholder='E-mail'
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                placeholder='Senha'
              />
            </div>
            <button type="submit" className="btn-login">
              Entrar
            </button>
            {loginMessage && <p>{loginMessage}</p>}
          </form>
        </div>

      </div>

      <div className='icones'>
        <img src={raio} alt="Ícone Raio" />
        <img src={dinheiro} alt="Ícone Dinheiro" />
        <img src={planta} alt="Ícone Planta" />
        <img src={painel} alt="Ícone Painel" />
      </div>

      <div className='sobreNos'>
        <h1>Saiba mais sobre nós</h1>
      </div>

      <div className="carrossel">
        <Slider {...settings}>
          {data.map((d, index) => (
            <div className="cards" key={index}>
              <div className='imgCard'>
                <img src={d.img} alt="" />
              </div>
              <div className="contCard">
                <h2>{d.name}</h2>
                <p>{d.review}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-contact">
            <p>enersol@gmail.com</p>
            <p>@enersol</p>
          </div>
          <div className="footer-brand">
            <h2>ENERSOL</h2>
            <p>Transformando o potencial do sol em energia acessível e sustentável para todos os lares.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const data = [
  {
    name: 'Sustentabilidade',
    img: foto1,
    review: 'Placas solares geram energia limpa, reduzindo emissões e dependência de fósseis. São duráveis, recicláveis e sustentáveis.',
  },
  {
    name: 'Manutenção',
    img: foto2,
    review: 'A manutenção regular de placas solares garante eficiência energética máxima e prolonga a vida útil do sistema.',
  },
  {
    name: 'Sustentabilidade',
    img: foto1,
    review: 'Placas solares geram energia limpa, reduzindo emissões e dependência de fósseis. São duráveis, recicláveis e sustentáveis.',
  },
  {
    name: 'Manutenção',
    img: foto2,
    review: 'A manutenção regular de placas solares garante eficiência energética máxima e prolonga a vida útil do sistema.',
  },
];

export default UserRegistrationForm;
