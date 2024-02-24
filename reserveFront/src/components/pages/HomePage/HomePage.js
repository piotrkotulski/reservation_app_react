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

const HomePage = ({
                      numCourts,
                      setNumCourts,
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

    return (
        <div>
            <label>
                Liczba kortów:
                <input
                    type="number"
                    value={numCourts}
                    onChange={e => setNumCourts(Number(e.target.value))}
                    min="1"
                    max="5"
                />
            </label>

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
                            onChange={(e) => setClientName(e.target.value)}
                            fullWidth
                            margin="normal"
                        />

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

                        <Button className={styles.successBtt} onClick={() => confirmReservation(duration)}>Potwierdź</Button>

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



