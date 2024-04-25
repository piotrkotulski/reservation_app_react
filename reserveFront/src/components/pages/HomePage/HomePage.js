import React, { useState } from 'react';
import styles from "./HomePage.module.scss";
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';



const HomePage = ({   API_URL,
                      courtHeaders,
                      timeSlots,
                      selectedSlot,
                      selectedReservation,
                      confirmReservation,
                      handleCloseModal,
                      confirmDelete,
                  }) => {
    const [duration, setDuration] = useState(30); // Domyślna długość rezerwacji
    const [multiSportCard, setMultiSportCard] = useState(false);
    const [clientName, setClientName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [notes, setNotes] = useState('');
    const [trainer, setTrainer] = useState('');
    const [userData, setUserData] = useState({});
    const [userList, setUserList] = useState([]);



    const handleNameChange = async (event) => {
        const name = event.target.value;
        setClientName(name);
    
        if (name.length >= 3) {
            try {
                const response = await fetch(`${API_URL}api/ReserveApp/SearchUsers?searchTerm=${name}`);
                const users = await response.json();
                setUserList(users); // Tutaj przychodzi lista użytkowników
            } catch (error) {
                console.error("Error fetching user data:", error);
                setUserList([]); // W razie błędu czyścimy listę
            }
        } else {
            setUserList([]); // Wyczyść listę, jeśli jest mniej niż 3 znaki
        }
    };

    const handleUserSelect = (user) => {
    // Uzupełnij pola danymi wybranego użytkownika
    setClientName(`${user.FirstName} ${user.LastName}`);
    setPhoneNumber(user.PhoneNumber);
    setUserData(user);
    setUserList([]); // Wyczyść listę po wyborze
    };

    return (
        <div>
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

                        <TextField
                            label="Imię i nazwisko"
                            value={clientName}
                            onChange={handleNameChange}
                            fullWidth
                            margin="normal"
                            autoComplete="off" // Wyłącz autouzupełnianie
                        />
                        {userList.length > 0 && (
                            <ul className={styles.userList}>
                            {userList.map((user) => (
                                <li
                                key={user.UserId}
                                onClick={() => handleUserSelect(user)}
                                className={styles.userListItem}
                                >
                                {`${user.FirstName} ${user.LastName}`}
                                </li>
                            ))}
                            </ul>
                        )}

                        <TextField
                            label="Telefon"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            fullWidth
                            margin="normal"
                        />

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

                        <Button className={styles.successBtt} onClick={() => confirmReservation(clientName, phoneNumber, notes, multiSportCard, duration)}>Potwierdź</Button>


                        <Button className={styles.deleteBtt} onClick={handleCloseModal}>Anuluj</Button>
                    </div>
                </div>
            )}

            {selectedReservation && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>Usuń Rezerwację</h2>
                        <p>Kort: {selectedReservation.CourtId}, Godzina: {selectedReservation.StartTime}</p>
                        <Button className={styles.trashBtt} onClick={() => confirmDelete(selectedReservation)}>Usuń</Button>
                        <Button className={styles.deleteBtt} onClick={handleCloseModal}>Anuluj</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;



