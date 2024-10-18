import React, { useState } from 'react';
import { Box, Typography, TextField, Button, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

const Finalizar = () => {
    const location = useLocation();
    const total = location.state?.total || 0;
    const [paymentMethod, setPaymentMethod] = useState('cartao');
    const [pixCode, setPixCode] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [errors, setErrors] = useState({}); // Estado para armazenar os erros de validação

    const chavePix = 'seu-email@example.com';

    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
        if (event.target.value === 'pix') {
            const generatedPixCode = `00020101021126870014${chavePix}5204000053039865405${total.toFixed(2)}5802BR5925Nome do Recebedor6009Nome do Banco62070503***6304${Math.random().toString().slice(2, 10)}`;
            setPixCode(generatedPixCode);
        } else {
            setPixCode('');
        }
    };

    const validateCard = () => {
        let validationErrors = {};
        const cardNumberRegex = /^[0-9]{13,19}$/;
        const cvvRegex = /^[0-9]{3,4}$/;
        const expiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;

        // Validação do número do cartão
        if (!cardNumber || !cardNumberRegex.test(cardNumber)) {
            validationErrors.cardNumber = 'Número do cartão inválido';
        }

        // Validação do nome no cartão
        if (!cardName) {
            validationErrors.cardName = 'Nome no cartão é obrigatório';
        }

        // Validação da data de vencimento
        if (!expiryDate || !expiryRegex.test(expiryDate)) {
            validationErrors.expiryDate = 'Data de vencimento inválida';
        } else {
            const [month, year] = expiryDate.split('/');
            const currentDate = new Date();
            const currentYear = parseInt(currentDate.getFullYear().toString().slice(-2));
            const currentMonth = currentDate.getMonth() + 1;

            if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
                validationErrors.expiryDate = 'Data de vencimento expirada';
            }
        }

        // Validação do CVV
        if (!cvv || !cvvRegex.test(cvv)) {
            validationErrors.cvv = 'CVV inválido';
        }

        return validationErrors;
    };

    const handleFinalizarCompra = () => {
        if (paymentMethod === 'cartao') {
            const validationErrors = validateCard();
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }
        }
        // Lógica para finalizar a compra
        alert('Compra finalizada!');
    };

    return (
        <div className="finalizarContainer">
            <Box className="finalizarBox">
                <Typography variant="h4" className="finalizarTitle">
                    R$ {total.toFixed(2)}
                </Typography>
                <RadioGroup defaultValue="cartao" onChange={handlePaymentMethodChange}>
                    <FormControlLabel
                        value="cartao"
                        control={<Radio />}
                        label="Cartão de Crédito/Débito"
                    />
                    {paymentMethod === 'cartao' && (
                        <Box sx={{ marginBottom: '20px', paddingLeft: '30px' }}>
                            <TextField
                                label="Número do cartão"
                                fullWidth
                                type='number'
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                error={!!errors.cardNumber}
                                helperText={errors.cardNumber}
                                sx={{ marginBottom: '10px' }}
                            />
                            <TextField
                                label="Nome no cartão"
                                fullWidth
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value)}
                                error={!!errors.cardName}
                                helperText={errors.cardName}
                                sx={{ marginBottom: '10px' }}
                            />
                            <Box sx={{ display: 'flex', gap: '10px' }}>
                            <TextField
                                
                                type="date" // Define o tipo como 'month'
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                                error={!!errors.expiryDate}
                                helperText={errors.expiryDate}
                            />

                                <TextField
                                    label="CVV"
                                    value={cvv}
                                    type='number'
                                    onChange={(e) => setCvv(e.target.value)}
                                    error={!!errors.cvv}
                                    helperText={errors.cvv}
                                />
                            </Box>
                        </Box>
                    )}
                    <FormControlLabel
                        value="pix"
                        control={<Radio />}
                        label="Pix"
                    />
                </RadioGroup>
                
                {paymentMethod === 'pix' && (
                    <Box className="qrCodeContainer">
                        <Typography variant="h6" className="qrCodeTitle">QR Code para pagamento via Pix</Typography>
                        <QRCodeSVG value={pixCode} size={128} />
                    </Box>
                )}
                
                <Button
                    className="finalizarButton"
                    onClick={handleFinalizarCompra}
                >
                    Finalizar compra
                </Button>
            </Box>
        </div>
    );
};

export default Finalizar;
