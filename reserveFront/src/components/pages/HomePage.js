import React, { useState } from 'react';
import Button from '@mui/material/Button';

const HomePage = ({ numCourts, setNumCourts, courtHeaders, timeSlots, selectedSlot, selectedReservation, confirmReservation, handleCloseModal, confirmDelete }) => {
    const [duration, setDuration] = useState(30); // Domyślna długość rezerwacji

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
                    <th>Godzina</th>
                    {courtHeaders}
                </tr>
                </thead>
                <tbody>
                {timeSlots}
                </tbody>
            </table>

            {selectedSlot && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Potwierdź rezerwację</h2>
                        <p>Kort: {selectedSlot.court}, Godzina: {selectedSlot.time}</p>
                        <label>
                            Czas trwania:
                            <select value={duration} onChange={e => setDuration(Number(e.target.value))}>
                                <option value={30}>30 minut</option>
                                <option value={60}>1 godzina</option>
                                <option value={90}>1 godzina 30 minut</option>
                                <option value={120}>2 godziny</option>
                            </select>
                        </label>
                        <Button onClick={confirmReservation}>Potwierdź</Button>
                        <Button onClick={handleCloseModal}>Anuluj</Button>
                    </div>
                </div>
            )}

            {selectedReservation && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Usuń Rezerwację</h2>
                        <p>Kort: {selectedReservation.CourtId}, Godzina: {selectedReservation.StartTime}</p>
                        <Button onClick={() => confirmDelete(selectedReservation)}>Usuń</Button>
                        <Button onClick={handleCloseModal}>Anuluj</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;


