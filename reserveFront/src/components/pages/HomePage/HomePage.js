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
                      userGroups // make sure this is passed as a prop
                  }) => {
    const [duration, setDuration] = useState(30);
    const [multiSportCard, setMultiSportCard] = useState(false);
    const [clientName, setClientName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [notes, setNotes] = useState('');
    const [userData, setUserData] = useState({});
    const [userList, setUserList] = useState([]);
    const [filteredUserList, setFilteredUserList] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('');

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

    useEffect(() => {
        fetchUsers();
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

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    const handleConfirmReservation = () => {
        console.log("Confirming Reservation with Group: ", selectedGroup);
        confirmReservation(clientName, phoneNumber, notes, multiSportCard, duration, selectedGroup);
    };

    const handleUpdateReservation = () => {
        console.log("Updating Reservation with Group: ", selectedGroup);
        updateReservation(selectedReservation.ReservationId, clientName, phoneNumber, notes, multiSportCard, duration, selectedGroup);
    };

    return (
        <div>
            <TextField
                label="Wybierz datę"
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                margin="normal"
            />

            <table className="reservation-calendar">
                <thead>
                <tr>
                    <th className={styles.hourCell}>Godzina</th>
                    {courtHeaders}
                </tr>
                </thead>
                <tbody>{timeSlots}</tbody>
            </table>

            {selectedSlot && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>Potwierdź rezerwację</h2>
                        <p>Kort: {selectedSlot.court}, Godzina: {selectedSlot.time}</p>

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

                        <Button className={styles.successBtt} onClick={handleConfirmReservation}>Potwierdź</Button>

                        <Button className={styles.deleteBtt} onClick={handleCloseModal}>Anuluj</Button>
                    </div>
                </div>
            )}

            {selectedReservation && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>Edytuj Rezerwację</h2>
                        <p>Kort: {selectedReservation.CourtId}, Godzina: {selectedReservation.StartTime}</p>

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

                        <Button className={styles.deleteBtt} onClick={() => confirmDelete(selectedReservation)}>Usuń Rezerwację</Button>

                        <Button className={styles.deleteBtt} onClick={handleCloseModal}>Anuluj</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
