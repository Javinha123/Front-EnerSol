import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Logosite from './assets/logosite.png';
import carrinho from './assets/carrinho.png';

const UserProductPage = () => {
    const [placas, setPlacas] = useState([]);
    const [kits, setKits] = useState([]);
    const [geradores, setGeradores] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const [placasResponse, geradoresResponse, kitsResponse ] = await Promise.all([
                    axios.get('http://localhost:8000/api/placas'),
                    axios.get('http://localhost:8000/api/geradores'),
                    axios.get('http://localhost:8000/api/kits')
                ]);

                setPlacas(placasResponse.data);

                setGeradores(geradoresResponse.data);

                setKits(kitsResponse.data);
            } catch (error) {
                console.error('Erro ao buscar produtos:', error);
                setError('Erro ao carregar produtos. Tente novamente mais tarde.');
            }
        };

        fetchProducts();
    }, []);

    const handleBuy = (id, tipo) => {
        window.location.href = `/produto/${tipo}/${id}`;
    };

    const settings = {
        dots: true,
        infinite: false,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 1
    };

    return (
        <div className='pgCompra'>
            <header className="header-container">
                <div className="logo-container">
                    <img src={Logosite} alt="EnerSol logo" className="logo" />
                    <h1>EnerSol</h1>
                </div>
            </header>

            <div className='contCompra'>
                <div className='fotoCompra'>
                    <h1>Estes são os nossos produtos!!!</h1>
                    <p>Bem-vindo(a) à nossa loja de soluções sustentáveis em energia! Aqui, acreditamos que o futuro é solar.</p>
                </div>

                <div className='cardsCompra'>
                    <h1>NOSSAS PLACAS:</h1>
                    <div className="carrossel">
                        <Slider {...settings}>
                            {placas.map((placa) => (
                                <div className="cardsComp" key={placa.id}>
                                    <div className='imgCardCompra'>
                                        <img src={placa.img} alt={placa.nome} />
                                    </div>
                                    <div className="contCardCompra">
                                        <h2>{placa.nome}</h2>
                                        <p>{placa.potencia} W</p>
                                        <p className='valorPlaca' style={{ fontWeight: 'bold' }}>R$ {placa.valor}</p>
                                    </div>
                                    <button className='comprarPlaca' onClick={() => handleBuy( placa.id, 'placa' )}>
                                        <img src={carrinho} alt="Carrinho" /> COMPRAR
                                    </button>
                                </div>
                            ))}
                        </Slider>
                    </div>

                    <h1>NOSSOS KITS:</h1>
                    <div className="carrossel">
                        <Slider {...settings}>
                            {kits.map((kit) => (
                                <div className="cardsComp" key={kit.id}>
                                    <div className='imgCardCompra'>
                                        <img src={kit.img} alt={kit.nome} />
                                    </div>
                                    <div className="contCardCompra">
                                        <h2>{kit.nome}</h2>
                                        <p>{kit.potencia}</p>
                                        <p className='valorPlaca' style={{ fontWeight: 'bold' }}>R$ {kit.valor}</p>
                                    </div>
                                    <button className='comprarPlaca' onClick={() => handleBuy( kit.id, 'kit' )}>
                                        <img src={carrinho} alt="Carrinho" /> Comprar
                                    </button>
                                </div>
                            ))}
                        </Slider>
                    </div>

                    <h1>NOSSOS GERADORES:</h1>
                    <div className="carrossel">
                        <Slider {...settings}>
                            {geradores.map((gerador) => (
                                <div className="cardsComp" key={gerador.id}>
                                    <div className='imgCardCompra'>
                                        <img src={gerador.img} alt={gerador.nome} />
                                    </div>
                                    <div className="contCardCompra">
                                        <h2>{gerador.nome}</h2>
                                        <p>{gerador.potencia} W</p>
                                        <p className='valorPlaca' style={{ fontWeight: 'bold' }}>R$ {gerador.valor}</p>
                                    </div>
                                    <button className='comprarPlaca' onClick={() => handleBuy(gerador.id, 'gerador')}>
                                        <img src={carrinho} alt="Carrinho" /> Comprar
                                    </button>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
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

export default UserProductPage;
