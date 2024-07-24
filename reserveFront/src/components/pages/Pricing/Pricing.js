import React, {useState, useEffect} from 'react';
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
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Pricing = ({API_URL}) => {
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

    const [newPriceType, setNewPriceType] = useState({Name: ''});
    const [newPriceSeason, setNewPriceSeason] = useState({Name: ''});
    const [newPriceDayType, setNewPriceDayType] = useState({Name: ''});

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
            setPricing(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Błąd podczas pobierania cennika:', error);
        }
    };

    const fetchPriceTypes = async () => {
        try {
            const response = await fetch(`${API_URL}api/ReserveApp/GetPriceTypes`);
            const data = await response.json();
            setPriceTypes(Array.isArray(data) ? data : []);
            console.log('Price types:', data);
        } catch (error) {
            console.error('Błąd podczas pobierania typów cenników:', error);
        }
    };

    const fetchPriceSeasons = async () => {
        try {
            const response = await fetch(`${API_URL}api/ReserveApp/GetPriceSeasons`);
            const data = await response.json();
            setPriceSeasons(Array.isArray(data) ? data : []);
            console.log('Price seasons:', data);
        } catch (error) {
            console.error('Błąd podczas pobierania sezonów cenników:', error);
        }
    };

    const fetchPriceDayTypes = async () => {
        try {
            const response = await fetch(`${API_URL}api/ReserveApp/GetPriceDayTypes`);
            const data = await response.json();
            setPriceDayTypes(Array.isArray(data) ? data : []);
            console.log('Price day types:', data);
        } catch (error) {
            console.error('Błąd podczas pobierania typów dni cenników:', error);
        }
    };

    const handleInputChange = (e) => {
        setNewPrice({...newPrice, [e.target.name]: e.target.value});
    };

    const handleAddPrice = async () => {
        if (!newPrice.priceTypeId || !newPrice.priceSeasonId || !newPrice.priceDayTypeId || !newPrice.startTime || !newPrice.endTime || !newPrice.price) {
            toast.error("Proszę uzupełnić wszystkie pola!");
            return;
        }

        try {
            const response = await fetch(`${API_URL}api/ReserveApp/CreatePriceDetail`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
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
                toast.error(`Nie udało się usunąć ceny: ${errorData.message || 'Wystąpił nieznany błąd'}`);
            }
        } catch (error) {
            console.error('Błąd podczas usuwania ceny:', error);
            toast.error('Wystąpił błąd podczas usuwania ceny');
        }
    };
    

    const handleAddPriceType = async () => {
        if (!newPriceType.Name) {
            toast.error("Proszę podać nazwę typu cennika!");
            return;
        }

        try {
            const response = await fetch(`${API_URL}api/ReserveApp/CreatePriceType`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(newPriceType)
            });

            if (response.ok) {
                toast.success('Typ cennika dodany pomyślnie');
                fetchPriceTypes();
                setNewPriceType({Name: ''});
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
                toast.error(`Nie udało się usunąć typu cennika: ${errorData.message || 'Wystąpił nieznany błąd'}`);
            }
        } catch (error) {
            console.error('Błąd podczas usuwania typu cennika:', error);
            toast.error('Wystąpił błąd podczas usuwania typu cennika');
        }
    };
    

    const handleAddPriceSeason = async () => {
        if (!newPriceSeason.Name) {
            toast.error("Proszę podać nazwę sezonu!");
            return;
        }

        try {
            const response = await fetch(`${API_URL}api/ReserveApp/CreatePriceSeason`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(newPriceSeason)
            });

            if (response.ok) {
                toast.success('Sezon dodany pomyślnie');
                fetchPriceSeasons();
                setNewPriceSeason({Name: ''});
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
                toast.error(`Nie udało się usunąć sezonu: ${errorData.message || 'Wystąpił nieznany błąd'}`);
            }
        } catch (error) {
            console.error('Błąd podczas usuwania sezonu:', error);
            toast.error('Wystąpił błąd podczas usuwania sezonu');
        }
    };
    

    const handleAddPriceDayType = async () => {
        if (!newPriceDayType.Name) {
            toast.error("Proszę podać nazwę typu dnia!");
            return;
        }

        try {
            const response = await fetch(`${API_URL}api/ReserveApp/CreatePriceDayType`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(newPriceDayType)
            });

            if (response.ok) {
                toast.success('Typ dnia dodany pomyślnie');
                fetchPriceDayTypes();
                setNewPriceDayType({Name: ''});
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
                toast.error(`Nie udało się usunąć typu dnia: ${errorData.message || 'Wystąpił nieznany błąd'}`);
            }
        } catch (error) {
            console.error('Błąd podczas usuwania typu dnia:', error);
            toast.error('Wystąpił błąd podczas usuwania typu dnia');
        }
    };
    

    const getNameById = (id, list, key) => {
        const item = list.find(el => el[key] === id);
        return item ? item.Name : 'Nieznany';
    };

    if (!pricing.length || !priceTypes.length || !priceSeasons.length || !priceDayTypes.length) {
        return <div>Ładowanie danych...</div>;
    }

    return (
        <Container>
            <ToastContainer position="top-right" autoClose={1000} hideProgressBar={false} newestOnTop={false}
                            closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover/>
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
                        {Array.isArray(pricing) && pricing.map((price, index) => {
                            console.log('Rendering price item:', price);
                            return (
                                <TableRow key={index}>
                                    <TableCell>{getNameById(price.PriceTypeId, priceTypes, 'PriceTypeId')}</TableCell>
                                    <TableCell>{getNameById(price.PriceSeasonId, priceSeasons, 'PriceSeasonId')}</TableCell>
                                    <TableCell>{getNameById(price.PriceDayTypeId, priceDayTypes, 'PriceDayTypeId')}</TableCell>
                                    <TableCell>{price.StartTime}</TableCell>
                                    <TableCell>{price.EndTime}</TableCell>
                                    <TableCell>{price.Price} zł</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleDeletePrice(price.PriceDetailId)}
                                        >
                                            Usuń
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
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
                SelectProps={{native: true}}
            >
                <option value="Wybierz"></option>
                {priceTypes.map((type) => {
                    console.log('Processing price type:', type);
                    return (
                        <option key={type.PriceTypeId} value={type.PriceTypeId}>
                            {type.Name}
                        </option>
                    );
                })}
            </TextField>
            <TextField
                label="Sezon"
                select
                name="priceSeasonId"
                value={newPrice.priceSeasonId}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                SelectProps={{native: true}}
            >
                <option value="Wybierz"></option>
                {priceSeasons.map((season) => {
                    console.log('Processing price season:', season);
                    return (
                        <option key={season.PriceSeasonId} value={season.PriceSeasonId}>
                            {season.Name}
                        </option>
                    );
                })}
            </TextField>
            <TextField
                label="Typ Dnia"
                select
                name="priceDayTypeId"
                value={newPrice.priceDayTypeId}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                SelectProps={{native: true}}
            >
                <option value="Wybierz typ dnia"></option>
                {priceDayTypes.map((dayType) => {
                    console.log('Processing price day type:', dayType);
                    return (
                        <option key={dayType.PriceDayTypeId} value={dayType.PriceDayTypeId}>
                            {dayType.Name}
                        </option>
                    );
                })}
            </TextField>
            <TextField
                label="Od Godziny"
                type="time"
                name="startTime"
                value={newPrice.startTime}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputLabelProps={{shrink: true}}
                inputProps={{step: 300}} // 5 min
            />
            <TextField
                label="Do Godziny"
                type="time"
                name="endTime"
                value={newPrice.endTime}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputLabelProps={{shrink: true}}
                inputProps={{step: 300}} // 5 min
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
                name="Name"
                value={newPriceType.Name}
                onChange={(e) => setNewPriceType({...newPriceType, Name: e.target.value})}
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
            <TableContainer component={Paper} style={{marginTop: '20px'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nazwa</TableCell>
                            <TableCell>Akcje</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(priceTypes) && priceTypes.map((type) => {
                            console.log('Rendering price type:', type);
                            return (
                                <TableRow key={type.PriceTypeId}>
                                    <TableCell>{type.Name}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleDeletePriceType(type.PriceTypeId)}
                                        >
                                            Usuń
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Zarządzanie sezonami cenników */}
            <h2>Zarządzaj sezonami cenników</h2>
            <TextField
                label="Nowy Sezon"
                name="Name"
                value={newPriceSeason.Name}
                onChange={(e) => setNewPriceSeason({...newPriceSeason, Name: e.target.value})}
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
            <TableContainer component={Paper} style={{marginTop: '20px'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nazwa</TableCell>
                            <TableCell>Akcje</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(priceSeasons) && priceSeasons.map((season) => {
                            console.log('Rendering price season:', season);
                            return (
                                <TableRow key={season.PriceSeasonId}>
                                    <TableCell>{season.Name}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleDeletePriceSeason(season.PriceSeasonId)}
                                        >
                                            Usuń
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Zarządzanie typami dni cenników */}
            <h2>Zarządzaj typami dni cenników</h2>
            <TextField
                label="Nowy Typ Dnia"
                name="Name"
                value={newPriceDayType.Name}
                onChange={(e) => setNewPriceDayType({...newPriceDayType, Name: e.target.value})}
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
            <TableContainer component={Paper} style={{marginTop: '20px'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nazwa</TableCell>
                            <TableCell>Akcje</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(priceDayTypes) && priceDayTypes.map((dayType) => {
                            console.log('Rendering price day type:', dayType);
                            return (
                                <TableRow key={dayType.PriceDayTypeId}>
                                    <TableCell>{dayType.Name}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleDeletePriceDayType(dayType.PriceDayTypeId)}
                                        >
                                            Usuń
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default Pricing;