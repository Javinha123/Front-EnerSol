
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import Produtos from './produtos'; 



ReactDOM.render(
  <React.StrictMode>
      <Produtos /> {/* Renderize diretamente a página Main */}
  </React.StrictMode>,
  document.getElementById('root')
);


