import React, { useState, useEffect } from 'react';
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Button,
    Paper,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Pricing = ({ API_URL }) => {
    const [pricing, setPricing] = useState([]);
    const [newPrice, setNewPrice] = useState({
        startTime: '',
        endTime: '',
        price: ''
    });

    useEffect(() => {
        fetchPricing();
    }, []);

    const fetchPricing = async () => {
        try {
            const response = await fetch(`${API_URL}api/ReserveApp/GetPricing`);
            const data = await response.json();
            setPricing(data);
        } catch (error) {
            console.error('Błąd podczas pobierania cennika:', error);
        }
    };

    const handleInputChange = (e) => {
        setNewPrice({ ...newPrice, [e.target.name]: e.target.value });
    };

    const handleAddPrice = async () => {
        if (!newPrice.startTime || !newPrice.endTime || !newPrice.price) {
            toast.error("Proszę uzupełnić wszystkie pola!");
            return;
        }

        try {
            const response = await fetch(`${API_URL}api/ReserveApp/CreatePricing`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPrice)
            });

            if (response.ok) {
                toast.success('Cena dodana pomyślnie');
                fetchPricing();
                setNewPrice({ startTime: '', endTime: '', price: '' });
            } else {
                const errorData = await response.json();
                toast.error(`Nie udało się dodać ceny: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Błąd:', error);
            toast.error('Wystąpił błąd podczas dodawania ceny');
        }
    };

    const handleDeletePrice = async (id) => {
        try {
            const response = await fetch(`${API_URL}api/ReserveApp/DeletePricing/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                toast.success('Cena usunięta pomyślnie');
                fetchPricing();
            } else {
                const errorData = await response.json();
                toast.error(`Nie udało się usunąć ceny: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Błąd podczas usuwania ceny:', error);
            toast.error('Wystąpił błąd podczas usuwania ceny');
        }
    };

    return (
        <Container>
            <ToastContainer position="top-right" autoClose={1000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <h1>Cennik</h1>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Od Godziny</TableCell>
                            <TableCell>Do Godziny</TableCell>
                            <TableCell>Cena</TableCell>
                            <TableCell>Akcje</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pricing.map((price, index) => (
                            <TableRow key={index}>
                                <TableCell>{price.startTime}</TableCell>
                                <TableCell>{price.endTime}</TableCell>
                                <TableCell>{price.price} zł</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleDeletePrice(price.id)}
                                    >
                                        Usuń
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <h2>Dodaj nową cenę</h2>
            <TextField
                label="Od Godziny"
                type="time"
                name="startTime"
                value={newPrice.startTime}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }} // 5 min
            />
            <TextField
                label="Do Godziny"
                type="time"
                name="endTime"
                value={newPrice.endTime}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }} // 5 min
            />
            <TextField
                label="Cena"
                type="number"
                name="price"
                value={newPrice.price}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleAddPrice}
            >
                Dodaj
            </Button>
        </Container>
    );
};

export default Pricing;