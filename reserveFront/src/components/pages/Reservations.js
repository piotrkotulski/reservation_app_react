import React, { useState, useEffect, useReducer } from 'react';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button, Grid, Paper } from '@mui/material';
import { debounce } from 'lodash';

// Definicja reducera do obsługi stanu filtrów
const filterReducer = (state, action) => {
    switch (action.type) {
        case 'SET_COURT_ID':
            return { ...state, courtId: action.courtId };
        case 'SET_USER_ID':
            return { ...state, userId: action.userId };
        case 'SET_DATE':
            return { ...state, date: action.date };
        case 'CLEAR':
            return { courtId: '', userId: '', date: '' };
        default:
            return state;
    }
};

const Reservations = () => {
    const [reservations, setReservations] = useState([]);
    const [filteredReservations, setFilteredReservations] = useState([]);
    const [filter, dispatch] = useReducer(filterReducer, { courtId: '', userId: '', date: '' });

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await fetch('http://localhost:5160/api/ReserveApp/GetReservations');
                const data = await response.json();
                setReservations(data);
                setFilteredReservations(data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchReservations();
    }, []);

    const debounceFilterChange = debounce((name, value) => {
        dispatch({ type: name.toUpperCase(), [name]: value });
        applyFilter({ ...filter, [name]: value });
    }, 500);

    const handleFilterChange = (e) => {
        debounceFilterChange(e.target.name, e.target.value);
    };

    const applyFilter = (filters) => {
        let filtered = reservations;

        if (filters.courtId) {
            filtered = filtered.filter(reservation => reservation.CourtId.toString() === filters.courtId);
        }

        if (filters.userId) {
            filtered = filtered.filter(reservation => reservation.UserId.toString() === filters.userId);
        }

        if (filters.date) {
            filtered = filtered.filter(reservation => new Date(reservation.Date).toLocaleDateString() === new Date(filters.date).toLocaleDateString());
        }

        setFilteredReservations(filtered);
    };

    const clearFilters = () => {
        dispatch({ type: 'CLEAR' });
        setFilteredReservations(reservations);
    };

    return (
        <Container className="mt-5">
            <h1>Rezerwacje</h1>
            <Grid container spacing={3} className="mb-4">
                <Grid item md={4}>
                    <TextField
                        fullWidth
                        type="text"
                        placeholder="ID Kortu"
                        name="courtId"
                        variant="outlined"
                        onChange={handleFilterChange}
                    />
                </Grid>
                <Grid item md={4}>
                    <TextField
                        fullWidth
                        type="text"
                        placeholder="ID Użytkownika"
                        name="userId"
                        variant="outlined"
                        onChange={handleFilterChange}
                    />
                </Grid>
                <Grid item md={4}>
                    <TextField
                        fullWidth
                        type="date"
                        name="date"
                        variant="outlined"
                        onChange={handleFilterChange}
                    />
                </Grid>
            </Grid>
            <Button variant="outlined" color="primary" onClick={clearFilters}>Wyczyść filtry</Button>
            <TableContainer component={Paper} className="mt-4">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID Rezerwacji</TableCell>
                            <TableCell>ID Kortu</TableCell>
                            <TableCell>ID Użytkownika</TableCell>
                            <TableCell>Data</TableCell>
                            <TableCell>Godzina Rozpoczęcia</TableCell>
                            <TableCell>Godzina Zakończenia</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredReservations.map((reservation) => (
                            <TableRow key={reservation.ReservationId}>
                                <TableCell>{reservation.ReservationId}</TableCell>
                                <TableCell>{reservation.CourtId}</TableCell>
                                <TableCell>{reservation.UserId}</TableCell>
                                <TableCell>{new Date(reservation.Date).toLocaleDateString()}</TableCell>
                                <TableCell>{reservation.StartTime}</TableCell>
                                <TableCell>{reservation.EndTime}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

export default Reservations;



