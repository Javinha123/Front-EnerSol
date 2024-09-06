import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import Logosite from './assets/logosite.png'
import testee from '../src/assets/testee.png'
import card1 from '../src/assets/card1.png'
import raio from './assets/raio.png'
import dinheiro from './assets/dinheiro.png'
import planta from './assets/planta.png'
import painel from './assets/painel.png'
import card2 from './assets/card2.png'

import Carousel from 'react-bootstrap/Carousel';

import React, { useState } from "react";
import foto3 from '../src/assets/foto3.jpg'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'






function App() {
  const card = [card1]
  const fundo = [testee]
  const foto = [foto3]
  

  return (
    <div>
      <header className="header-container">
      <div className="logo-container">
        <img src={Logosite} alt="EnerSol logo" className="logo" />
        <h1>EnerSol</h1>
      </div>
      <button className="buy-button">Quero comprar!</button>
      
      </header>
      <div className='container'>

        {/* Parte de baixo */}
   
        <div className='loginGeral'>
          <div className='containerazul'>
            <h2>|EnerSol</h2>
            <p className='p1'>Seja bem-vindo!</p>
            <p className='p2'>Acesse sua conta agora mesmo.</p>
            <button className="btn-login">ENTRAR</button>
          </div>
       
          <div className="login-box">
            <form>
              <h3>Crie sua conta</h3>
              <div className="input-group">
                <button className="active">Pessoa física</button>
                <button className='pRural'>Produtor rural</button>
              </div>
              <input type="text" placeholder="Nome" />
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Senha" />
              <button className="btn-register">CADASTRAR</button>
            </form>
      
          </div>
        </div>

      </div>
      <div className='icones'>

        <img src={raio} />
        <img src={dinheiro} />
        <img src={planta} />
        <img src={painel} />
      </div>

      <h1 className='sobre'>SAIBA MAIS SOBRE NÓS</h1>


      
         <div className='carrossel'>
     
       

      
            <div className='cards'>
              <div className='imgCard'>
              </div>
              <div className='contCard'>
                <h3>Sustentabilidade</h3>
                <p>Placas solares geram energia limpa, reduzindo emissões e dependência de fósseis. São duráveis, recicláveis e sustentáveis.</p>
              </div>
            </div>
     
            <div className='cards'>
              <div className='imgCard2'>
              </div>
              <div className='contCard'>
                <h3>Manutenção</h3>
                <p>A manutenção regular de placas solares garante eficiência energética máxima e prolonga a vida útil do sistema. </p>
              </div>
            </div>
            
            <div className='cards'>
              <div className='imgCard'>
              </div>
              <div className='contCard'>
                <h3>Sustentabilidade</h3>
                <p>Placas solares geram energia limpa, reduzindo emissões e dependência de fósseis. São duráveis, recicláveis e sustentáveis.</p>
              </div>
            </div>
           
            <div className='cards'>
              <div className='imgCard2'>
              </div>
              <div className='contCard'>
                <h3>Manutenção</h3>
                <p>A manutenção regular de placas solares garante eficiência energética máxima e prolonga a vida útil do sistema. </p>
              </div>
            </div>
            </div>

   

    
    
    </div>
    
    
   
    
    

    
   
  );

  
}

export default App;
