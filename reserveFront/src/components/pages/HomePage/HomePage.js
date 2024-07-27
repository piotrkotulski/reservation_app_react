import React, { useState, useEffect } from 'react';
import styles from "./HomePage.module.scss";
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Autocomplete from '@mui/material/Autocomplete';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import TodayIcon from '@mui/icons-material/Today';

const HomePage = ({
    API_URL,
    courtHeaders,
    timeSlots,
    selectedSlot,
    selectedReservation,
    confirmReservation,
    updateReservation,
    handleCloseModal,
    confirmDelete,
    selectedDate,
    setSelectedDate,
    userGroups
}) => {
    const [duration, setDuration] = useState(30);
    const [multiSportCard, setMultiSportCard] = useState(false);
    const [clientName, setClientName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [notes, setNotes] = useState('');
    const [userData, setUserData] = useState({});
    const [userList, setUserList] = useState([]);
    const [filteredUserList, setFilteredUserList] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [courtId, setCourtId] = useState('');
    const [pickedHour, setPickedHour] = useState('');
    const [price, setPrice] = useState(0);
    const [paymentStatus, setPaymentStatus] = useState(false);
    const [changePrice, setChangePrice] = useState(false);
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [trainers, setTrainers] = useState([]);
    const [fetchedUserGroups, setFetchedUserGroups] = useState([]); // Stan dla pobranych grup użytkowników

    useEffect(() => {
        if (selectedReservation) {
            setDuration(
                (new Date(`1970-01-01T${selectedReservation.EndTime}`).getTime() - new Date(`1970-01-01T${selectedReservation.StartTime}`).getTime()) / 60000
            );
            setClientName(selectedReservation.ClientName);
            setPhoneNumber(selectedReservation.PhoneNumber);
            setEmail(selectedReservation.Email);
            setNotes(selectedReservation.Notes);
            setMultiSportCard(selectedReservation.MultiSportCard);
            setSelectedGroup(selectedReservation.GroupName || '');
            setCourtId(selectedReservation.CourtId);
            setPickedHour(selectedReservation.StartTime);
            setPrice(selectedReservation.Price || 0);
            setPaymentStatus(selectedReservation.PaymentStatus || false);
            setSelectedTrainer(selectedReservation.TrainerId || null);
        }
    }, [selectedReservation]);

    useEffect(() => {
        if (selectedSlot) {
            setPickedHour(selectedSlot.time);
            setCourtId(selectedSlot.courtId);
        }
    }, [selectedSlot]);

    useEffect(() => {
        fetchUsers();
        fetchTrainers();
        fetchUserGroups(); // Pobranie grup użytkowników z API
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${API_URL}api/ReserveApp/GetUsers`);
            const users = await response.json();
            setUserList(users);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const fetchTrainers = async () => {
        try {
            const response = await fetch(`${API_URL}api/ReserveApp/GetAllTrainers`);
            const trainers = await response.json();
            setTrainers(trainers);
        } catch (error) {
            console.error("Error fetching trainers:", error);
        }
    };

    const fetchUserGroups = async () => {
        try {
            const response = await fetch(`${API_URL}api/ReserveApp/GetUserGroups`);
            const groups = await response.json();
            setFetchedUserGroups(groups);
        } catch (error) {
            console.error("Error fetching user groups:", error);
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
            setEmail(user.Email);
            setUserData(user);
            setSelectedGroup(user.GroupName || '');
        }
    };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    const handleNextDay = () => {
        setSelectedDate(new Date(new Date(selectedDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    };

    const handlePreviousDay = () => {
        setSelectedDate(new Date(new Date(selectedDate).getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    };

    const handleToday = () => {
        setSelectedDate(new Date().toISOString().split('T')[0]);
    };

    const handleConfirmReservation = () => {
        confirmReservation(courtId, pickedHour, clientName, phoneNumber, notes, multiSportCard, duration, selectedGroup, selectedTrainer, price, paymentStatus);
    };

    const handleUpdateReservation = () => {
        updateReservation(courtId, pickedHour, selectedReservation.ReservationId, clientName, phoneNumber, notes, multiSportCard, duration, selectedGroup, selectedTrainer, price, paymentStatus);
    };

    return (
        <div>
            <div className={styles.header}>
                <div className={styles.datePickerSection}>
                    <IconButton onClick={handlePreviousDay}>
                        <RemoveIcon />
                    </IconButton>
                    <TextField
                        label="Wybierz datę"
                        type="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        margin="normal"
                    />
                    <IconButton onClick={handleNextDay}>
                        <AddIcon />
                    </IconButton>
                </div>
                <div className={styles.quickActions}>
                    <Button variant="contained" color="primary" onClick={handleToday} startIcon={<TodayIcon />}>
                        Dzisiaj
                    </Button>
                </div>
            </div>

            <div className={styles.legend}>
                <ul><span>Grupy:</span>
                    {fetchedUserGroups.map((group, index) => (
                        <li key={index} className={styles.legendItem}>
                            <span className={styles.legendCircle} style={{ backgroundColor: group.GroupColor }}></span>
                            {group.GroupName}
                        </li>
                    ))}
                </ul>
            </div>

            <table className="reservation-calendar">
                <thead>
                    <tr>
                        <th className={styles.hourCell}>Godzina</th>
                        {courtHeaders}
                    </tr>
                </thead>
                <tbody>{timeSlots}</tbody>
            </table>

            {/* MODAL */}

            {selectedSlot && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>Potwierdź rezerwację</h2>
                        <p>
                            <TextField
                                label="Kort"
                                value={courtId}
                                onChange={(e) => setCourtId(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Godzina"
                                value={pickedHour}
                                onChange={(e) => setPickedHour(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                        </p>

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

                        <TextField
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                                {fetchedUserGroups.map((group, index) => (
                                    <MenuItem key={index} value={group.GroupName}>
                                        {group.GroupName}
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

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={changePrice}
                                    onChange={(e) => setChangePrice(e.target.checked)}
                                />
                            }
                            label="Zmień cenę"
                        />

                        {changePrice && (
                            <TextField
                                label="Cena"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                fullWidth
                                margin="normal"
                                type="number"
                            />
                        )}

                        <p>Status płatności: {paymentStatus ? 'Opłacone' : 'Nieopłacone'}</p>

                        <FormControl fullWidth margin="normal">
                            <InputLabel id="trainer-select-label">Trener</InputLabel>
                            <Select
                                labelId="trainer-select-label"
                                id="trainer-select"
                                value={selectedTrainer}
                                label="Trener"
                                onChange={(e) => setSelectedTrainer(e.target.value)}
                            >
                                {trainers.map((trainer, index) => (
                                    <MenuItem key={index} value={trainer.TrainerId}>
                                        {trainer.FirstName} {trainer.LastName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Button className={styles.successBtt} onClick={handleConfirmReservation}>Potwierdź</Button>

                        <Button className={styles.deleteBtt} onClick={handleCloseModal}>Anuluj</Button>
                    </div>
                </div>
            )}

            {selectedReservation && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>Edytuj Rezerwację</h2>
                        <TextField
                            label="Kort"
                            value={courtId}
                            onChange={(e) => setCourtId(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <p> Godzina: {selectedReservation.StartTime} </p>

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

                        <TextField
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                                {fetchedUserGroups.map((group, index) => (
                                    <MenuItem key={index} value={group.GroupName}>
                                        {group.GroupName}
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

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={changePrice}
                                    onChange={(e) => setChangePrice(e.target.checked)}
                                />
                            }
                            label="Zmień cenę"
                        />

                        {changePrice && (
                            <TextField
                                label="Cena"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                fullWidth
                                margin="normal"
                                type="number"
                            />
                        )}

                        <p>Status płatności: {paymentStatus ? 'Opłacone' : 'Nieopłacone'}</p>

                        <FormControl fullWidth margin="normal">
                            <InputLabel id="trainer-select-label">Trener</InputLabel>
                            <Select
                                labelId="trainer-select-label"
                                id="trainer-select"
                                value={selectedTrainer}
                                label="Trener"
                                onChange={(e) => setSelectedTrainer(e.target.value)}
                            >
                                {trainers.map((trainer, index) => (
                                    <MenuItem key={index} value={trainer.TrainerId}>
                                        {trainer.FirstName} {trainer.LastName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Button className={styles.successBtt} onClick={handleUpdateReservation}>Zaktualizuj</Button>

                        <Button className={styles.deleteBtt} onClick={() => confirmDelete(selectedReservation)}>Usuń Rezerwację</Button>

                        <Button className={styles.deleteBtt} onClick={handleCloseModal}>Anuluj</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
