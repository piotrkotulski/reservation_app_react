import React, { useState, useEffect, useReducer } from 'react';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button, Grid, Paper, Modal, Box, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel } from '@mui/material';
import { debounce } from 'lodash';
import Autocomplete from '@mui/material/Autocomplete';
import styles from "././HomePage/HomePage.module.scss";


const filterReducer = (state, action) => {
    switch (action.type) {
        case 'SET_COURT_ID':
            return { ...state, courtId: action.courtId };
        case 'SET_USER_ID':
            return { ...state, userId: action.userId };
        case 'SET_DATE':
            return { ...state, date: action.date };
        // Add new cases for new columns
        case 'SET_START_TIME':
            return { ...state, startTime: action.startTime };
        case 'SET_END_TIME':
            return { ...state, endTime: action.endTime };
        case 'SET_CLIENT_NAME':
            return { ...state, clientName: action.clientName };
        case 'SET_PHONE_NUMBER':
            return { ...state, phoneNumber: action.phoneNumber };
        case 'SET_NOTES':
            return { ...state, notes: action.notes };
        case 'SET_MULTISPORT_CARD':
            return { ...state, multiSportCard: action.multiSportCard };
        case 'CLEAR':
            return { courtId: '', userId: '', date: '', startTime: '', endTime: '', clientName: '', phoneNumber: '', notes: '', multiSportCard: '' };
        default:
            return state;
    }
};

const Reservations = () => {
    const API_URL = "http://localhost:5160/";
    const [reservations, setReservations] = useState([]);
    const [filteredReservations, setFilteredReservations] = useState([]);
    const [filter, dispatch] = useReducer(filterReducer, { courtId: '', userId: '', date: '', startTime: '', endTime: '', clientName: '', phoneNumber: '', notes: '', multiSportCard: '' });
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [userGroups, setUserGroups] = useState(JSON.parse(localStorage.getItem('userGroups')) || []);
    const [duration, setDuration] = useState(30);
    const [multiSportCard, setMultiSportCard] = useState(false);
    const [clientName, setClientName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [notes, setNotes] = useState('');
    const [userData, setUserData] = useState({});
    const [userList, setUserList] = useState([]);
    const [filteredUserList, setFilteredUserList] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await fetch(`${API_URL}api/ReserveApp/GetReservations`);
                const data = await response.json();
                setReservations(data);
                setFilteredReservations(data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchReservations();
        fetchUsers();
    }, []);

    useEffect(() => {
        if (selectedReservation) {
            console.log("Selected Reservation: ", selectedReservation);
            setDuration(
                (new Date(`1970-01-01T${selectedReservation.EndTime}`).getTime() - new Date(`1970-01-01T${selectedReservation.StartTime}`).getTime()) / 60000
            );
            setClientName(selectedReservation.ClientName);
            setPhoneNumber(selectedReservation.PhoneNumber);
            setNotes(selectedReservation.Notes);
            setMultiSportCard(selectedReservation.MultiSportCard);
            setSelectedGroup(selectedReservation.GroupName || '');
        }
    }, [selectedReservation]);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${API_URL}api/ReserveApp/GetUsers`);
            const users = await response.json();
            setUserList(users);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const handleNameChange = (event, value) => {
        const name = typeof value === 'string' ? value : value?.name || '';
        setClientName(name);

        if (name.length >= 3) {
            const filtered = userList.filter(user =>
                `${user.FirstName} ${user.LastName}`.toLowerCase().includes(name.toLowerCase())
            );
            setFilteredUserList(filtered);
        } else {
            setFilteredUserList([]);
        }
    };

    const handleUserSelect = (event, user) => {
        if (user) {
            setClientName(`${user.FirstName} ${user.LastName}`);
            setPhoneNumber(user.PhoneNumber);
            setUserData(user);
            setSelectedGroup(user.GroupName || '');
        }
    };

    const debounceFilterChange = debounce((name, value) => {
        dispatch({ type: `SET_${name.toUpperCase()}`, [name]: value });
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

    const handleOpenEditModal = (reservation) => {
        setSelectedReservation(reservation);
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
        setSelectedReservation(null);
    };

    const handleUpdateReservation = async () => {
        const startTime = new Date(`${selectedReservation.Date}T${selectedReservation.StartTime}`);
        const endTime = new Date(startTime);
        endTime.setMinutes(startTime.getMinutes() + duration);

        const reservationData = {
            CourtId: selectedReservation.CourtId,
            UserId: selectedReservation.UserId,
            Date: selectedReservation.Date,
            StartTime: selectedReservation.StartTime,
            EndTime: selectedReservation.EndTime,
            ClientName: clientName,
            PhoneNumber: phoneNumber,
            Notes: notes,
            MultiSportCard: multiSportCard,
            GroupName: selectedGroup
        };

        try {
            const response = await fetch(`${API_URL}api/ReserveApp/UpdateReservation/${selectedReservation.ReservationId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reservationData),
            });

            if (response.ok) {
                console.log("Reservation updated successfully with group: ", selectedGroup);
                const updatedReservations = reservations.map(reservation =>
                    reservation.ReservationId === selectedReservation.ReservationId ? { ...reservation, ...reservationData } : reservation
                );
                setReservations(updatedReservations);
                setFilteredReservations(updatedReservations);
                alert("Reservation Updated Successfully");
                handleCloseModal();
            } else {
                alert('Failed to update reservation');
            }
        } catch (error) {
            console.error("Error during reservation update:", error);
        }
    };

    const handleDeleteReservation = async (reservationId) => {
        try {
            const response = await fetch(`${API_URL}api/ReserveApp/DeleteReservation/${reservationId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                const updatedReservations = reservations.filter(reservation => reservation.ReservationId !== reservationId);
                setReservations(updatedReservations);
                setFilteredReservations(updatedReservations);
            } else {
                console.error('Failed to delete reservation');
            }
        } catch (error) {
            console.error('Error deleting reservation:', error);
        }
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
                            <TableCell>Imię i nazwisko klienta</TableCell>
                            <TableCell>Numer telefonu</TableCell>
                            <TableCell>Notatki</TableCell>
                            <TableCell>Karta MultiSport</TableCell>
                            <TableCell>Akcje</TableCell>
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
                                <TableCell>{reservation.ClientName}</TableCell>
                                <TableCell>{reservation.PhoneNumber}</TableCell>
                                <TableCell>{reservation.Notes}</TableCell>
                                <TableCell>{reservation.MultiSportCard ? 'Tak' : 'Nie'}</TableCell>
                                <TableCell>
                                    <Grid container spacing={1}>
                                        <Grid item>
                                            <Button variant="contained" color="primary" onClick={() => handleOpenEditModal(reservation)}>Edytuj</Button>
                                        </Grid>
                                        <Grid item>
                                            <Button variant="contained" color="secondary" onClick={() => handleDeleteReservation(reservation.ReservationId)}>Usuń</Button>
                                        </Grid>
                                    </Grid>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Modal open={open} onClose={handleCloseModal}>
                <Box className={styles.modalContent}>
                    <h2>Edytuj Rezerwację</h2>
                    <p>Kort: {selectedReservation?.CourtId}, Godzina: {selectedReservation?.StartTime}</p>

                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <InputLabel id="duration-select-label">Czas trwania</InputLabel>
                        <Select
                            className={styles.durationSelect}
                            labelId="duration-select-label"
                            id="duration-select"
                            value={duration.toString()}
                            label="Czas trwania"
                            onChange={e => setDuration(Number(e.target.value))}
                        >
                            <MenuItem value={30}>30 minut</MenuItem>
                            <MenuItem value={60}>1 godzina</MenuItem>
                            <MenuItem value={90}>1 godzina 30 minut</MenuItem>
                            <MenuItem value={120}>2 godziny</MenuItem>
                        </Select>
                    </FormControl>

                    <Autocomplete
                        freeSolo
                        options={filteredUserList}
                        getOptionLabel={(option) => `${option.FirstName} ${option.LastName}`}
                        onChange={handleUserSelect}
                        inputValue={clientName}
                        onInputChange={handleNameChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Imię i nazwisko"
                                fullWidth
                                margin="normal"
                                autoComplete="off"
                            />
                        )}
                    />

                    <TextField
                        label="Telefon"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        fullWidth
                        margin="normal"
                    />

                    <FormControl fullWidth margin="normal">
                        <InputLabel id="group-select-label">Grupa</InputLabel>
                        <Select
                            labelId="group-select-label"
                            id="group-select"
                            value={selectedGroup}
                            label="Grupa"
                            onChange={(e) => setSelectedGroup(e.target.value)}
                        >
                            {userGroups.map((group, index) => (
                                <MenuItem key={index} value={group.name}>
                                    {group.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Uwagi"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        fullWidth
                        margin="normal"
                        multiline
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={multiSportCard}
                                onChange={(e) => setMultiSportCard(e.target.checked)}
                            />
                        }
                        label="Karta Multisport"
                    />

                    <Button className={styles.successBtt} onClick={handleUpdateReservation}>Zaktualizuj</Button>

                    <Button className={styles.deleteBtt} onClick={handleCloseModal}>Anuluj</Button>
                </Box>
            </Modal>
        </Container>
    );
}

export default Reservations;