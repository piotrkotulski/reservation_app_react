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
    const [priceTypes, setPriceTypes] = useState([]);
    const [priceSeasons, setPriceSeasons] = useState([]);
    const [priceDayTypes, setPriceDayTypes] = useState([]);

    const [newPrice, setNewPrice] = useState({
        priceTypeId: '',
        priceSeasonId: '',
        priceDayTypeId: '',
        startTime: '',
        endTime: '',
        price: ''
    });

    const [newPriceType, setNewPriceType] = useState({ name: '' });
    const [newPriceSeason, setNewPriceSeason] = useState({ name: '' });
    const [newPriceDayType, setNewPriceDayType] = useState({ name: '' });

    useEffect(() => {
        fetchPricing();
        fetchPriceTypes();
        fetchPriceSeasons();
        fetchPriceDayTypes();
    }, []);

    const fetchPricing = async () => {
        try {
            const response = await fetch(`${API_URL}api/ReserveApp/GetPriceDetails`);
            const data = await response.json();
            console.log('Pricing data:', data); // Logowanie danych
            setPricing(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Błąd podczas pobierania cennika:', error);
        }
    };

    const fetchPriceTypes = async () => {
        try {
            const response = await fetch(`${API_URL}api/ReserveApp/GetPriceTypes`);
            const data = await response.json();
            console.log('Price types data:', data); // Logowanie danych
            setPriceTypes(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Błąd podczas pobierania typów cenników:', error);
        }
    };

    const fetchPriceSeasons = async () => {
        try {
            const response = await fetch(`${API_URL}api/ReserveApp/GetPriceSeasons`);
            const data = await response.json();
            console.log('Price seasons data:', data); // Logowanie danych
            setPriceSeasons(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Błąd podczas pobierania sezonów cenników:', error);
        }
    };

    const fetchPriceDayTypes = async () => {
        try {
            const response = await fetch(`${API_URL}api/ReserveApp/GetPriceDayTypes`);
            const data = await response.json();
            console.log('Price day types data:', data); // Logowanie danych
            setPriceDayTypes(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Błąd podczas pobierania typów dni cenników:', error);
        }
    };

    const handleInputChange = (e) => {
        setNewPrice({ ...newPrice, [e.target.name]: e.target.value });
    };

    const handleAddPrice = async () => {
        if (!newPrice.priceTypeId || !newPrice.priceSeasonId || !newPrice.priceDayTypeId || !newPrice.startTime || !newPrice.endTime || !newPrice.price) {
            toast.error("Proszę uzupełnić wszystkie pola!");
            return;
        }

        try {
            const response = await fetch(`${API_URL}api/ReserveApp/CreatePriceDetail`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPrice)
            });

            if (response.ok) {
                toast.success('Cena dodana pomyślnie');
                fetchPricing();
                setNewPrice({
                    priceTypeId: '',
                    priceSeasonId: '',
                    priceDayTypeId: '',
                    startTime: '',
                    endTime: '',
                    price: ''
                });
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
            const response = await fetch(`${API_URL}api/ReserveApp/DeletePriceDetail/${id}`, {
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

    const handleAddPriceType = async () => {
        if (!newPriceType.name) {
            toast.error("Proszę podać nazwę typu cennika!");
            return;
        }

        try {
            const response = await fetch(`${API_URL}api/ReserveApp/CreatePriceType`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPriceType)
            });

            if (response.ok) {
                toast.success('Typ cennika dodany pomyślnie');
                fetchPriceTypes();
                setNewPriceType({ name: '' });
            } else {
                const errorData = await response.json();
                toast.error(`Nie udało się dodać typu cennika: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Błąd:', error);
            toast.error('Wystąpił błąd podczas dodawania typu cennika');
        }
    };

    const handleDeletePriceType = async (id) => {
        try {
            const response = await fetch(`${API_URL}api/ReserveApp/DeletePriceType/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                toast.success('Typ cennika usunięty pomyślnie');
                fetchPriceTypes();
            } else {
                const errorData = await response.json();
                toast.error(`Nie udało się usunąć typu cennika: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Błąd podczas usuwania typu cennika:', error);
            toast.error('Wystąpił błąd podczas usuwania typu cennika');
        }
    };

    const handleAddPriceSeason = async () => {
        if (!newPriceSeason.name) {
            toast.error("Proszę podać nazwę sezonu!");
            return;
        }

        try {
            const response = await fetch(`${API_URL}api/ReserveApp/CreatePriceSeason`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPriceSeason)
            });

            if (response.ok) {
                toast.success('Sezon dodany pomyślnie');
                fetchPriceSeasons();
                setNewPriceSeason({ name: '' });
            } else {
                const errorData = await response.json();
                toast.error(`Nie udało się dodać sezonu: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Błąd:', error);
            toast.error('Wystąpił błąd podczas dodawania sezonu');
        }
    };

    const handleDeletePriceSeason = async (id) => {
        try {
            const response = await fetch(`${API_URL}api/ReserveApp/DeletePriceSeason/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                toast.success('Sezon usunięty pomyślnie');
                fetchPriceSeasons();
            } else {
                const errorData = await response.json();
                toast.error(`Nie udało się usunąć sezonu: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Błąd podczas usuwania sezonu:', error);
            toast.error('Wystąpił błąd podczas usuwania sezonu');
        }
    };

    const handleAddPriceDayType = async () => {
        if (!newPriceDayType.name) {
            toast.error("Proszę podać nazwę typu dnia!");
            return;
        }

        try {
            const response = await fetch(`${API_URL}api/ReserveApp/CreatePriceDayType`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPriceDayType)
            });

            if (response.ok) {
                toast.success('Typ dnia dodany pomyślnie');
                fetchPriceDayTypes();
                setNewPriceDayType({ name: '' });
            } else {
                const errorData = await response.json();
                toast.error(`Nie udało się dodać typu dnia: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Błąd:', error);
            toast.error('Wystąpił błąd podczas dodawania typu dnia');
        }
    };

    const handleDeletePriceDayType = async (id) => {
        try {
            const response = await fetch(`${API_URL}api/ReserveApp/DeletePriceDayType/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                toast.success('Typ dnia usunięty pomyślnie');
                fetchPriceDayTypes();
            } else {
                const errorData = await response.json();
                toast.error(`Nie udało się usunąć typu dnia: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Błąd podczas usuwania typu dnia:', error);
            toast.error('Wystąpił błąd podczas usuwania typu dnia');
        }
    };

    const getNameById = (id, list, key) => {
        const item = list.find(el => el[key] === id);
        return item ? item.name : 'Nieznany';
    };

    return (
        <Container>
            <ToastContainer position="top-right" autoClose={1000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <h1>Cennik</h1>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Typ Cennika</TableCell>
                            <TableCell>Sezon</TableCell>
                            <TableCell>Typ Dnia</TableCell>
                            <TableCell>Od Godziny</TableCell>
                            <TableCell>Do Godziny</TableCell>
                            <TableCell>Cena</TableCell>
                            <TableCell>Akcje</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(pricing) && pricing.map((price, index) => (
                            <TableRow key={index}>
                                <TableCell>{getNameById(price.priceTypeId, priceTypes, 'priceTypeId')}</TableCell>
                                <TableCell>{getNameById(price.priceSeasonId, priceSeasons, 'priceSeasonId')}</TableCell>
                                <TableCell>{getNameById(price.priceDayTypeId, priceDayTypes, 'priceDayTypeId')}</TableCell>
                                <TableCell>{price.startTime}</TableCell>
                                <TableCell>{price.endTime}</TableCell>
                                <TableCell>{price.price} zł</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleDeletePrice(price.priceDetailId)}
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
                label="Typ Cennika"
                select
                name="priceTypeId"
                value={newPrice.priceTypeId}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                SelectProps={{ native: true }}
            >
                <option value="">Wybierz typ cennika</option>
                {priceTypes.map((type) => (
                    <option key={type.priceTypeId} value={type.priceTypeId}>
                        {type.name}
                    </option>
                ))}
            </TextField>
            <TextField
                label="Sezon"
                select
                name="priceSeasonId"
                value={newPrice.priceSeasonId}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                SelectProps={{ native: true }}
            >
                <option value="">Wybierz sezon</option>
                {priceSeasons.map((season) => (
                    <option key={season.priceSeasonId} value={season.priceSeasonId}>
                        {season.name}
                    </option>
                ))}
            </TextField>
            <TextField
                label="Typ Dnia"
                select
                name="priceDayTypeId"
                value={newPrice.priceDayTypeId}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                SelectProps={{ native: true }}
            >
                <option value="">Wybierz typ dnia</option>
                {priceDayTypes.map((dayType) => (
                    <option key={dayType.priceDayTypeId} value={dayType.priceDayTypeId}>
                        {dayType.name}
                    </option>
                ))}
            </TextField>
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

            {/* Zarządzanie typami cenników */}
            <h2>Zarządzaj typami cenników</h2>
            <TextField
                label="Nowy Typ Cennika"
                name="name"
                value={newPriceType.name}
                onChange={(e) => setNewPriceType({ ...newPriceType, name: e.target.value })}
                fullWidth
                margin="normal"
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleAddPriceType}
            >
                Dodaj Typ Cennika
            </Button>
            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nazwa</TableCell>
                            <TableCell>Akcje</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(priceTypes) && priceTypes.map((type) => (
                            <TableRow key={type.priceTypeId}>
                                <TableCell>{type.name}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleDeletePriceType(type.priceTypeId)}
                                    >
                                        Usuń
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Zarządzanie sezonami cenników */}
            <h2>Zarządzaj sezonami cenników</h2>
            <TextField
                label="Nowy Sezon"
                name="name"
                value={newPriceSeason.name}
                onChange={(e) => setNewPriceSeason({ ...newPriceSeason, name: e.target.value })}
                fullWidth
                margin="normal"
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleAddPriceSeason}
            >
                Dodaj Sezon
            </Button>
            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nazwa</TableCell>
                            <TableCell>Akcje</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(priceSeasons) && priceSeasons.map((season) => (
                            <TableRow key={season.priceSeasonId}>
                                <TableCell>{season.name}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleDeletePriceSeason(season.priceSeasonId)}
                                    >
                                        Usuń
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Zarządzanie typami dni cenników */}
            <h2>Zarządzaj typami dni cenników</h2>
            <TextField
                label="Nowy Typ Dnia"
                name="name"
                value={newPriceDayType.name}
                onChange={(e) => setNewPriceDayType({ ...newPriceDayType, name: e.target.value })}
                fullWidth
                margin="normal"
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleAddPriceDayType}
            >
                Dodaj Typ Dnia
            </Button>
            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nazwa</TableCell>
                            <TableCell>Akcje</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(priceDayTypes) && priceDayTypes.map((dayType) => (
                            <TableRow key={dayType.priceDayTypeId}>
                                <TableCell>{dayType.name}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleDeletePriceDayType(dayType.priceDayTypeId)}
                                    >
                                        Usuń
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default Pricing;