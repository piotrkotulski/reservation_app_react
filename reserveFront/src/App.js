import React, { useState, useEffect } from 'react';
import './App.css';
import Button from '@mui/material/Button';
import { format } from 'date-fns';

function App() {
  const API_URL = "http://localhost:5160/";
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await fetch(`${API_URL}api/ReserveApp/GetReservations`);
      if (response.ok) {
        const data = await response.json();
        setReservations(data);
      } else {
        console.error("Failed to fetch reservations");
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const handleSlotClick = (court, time) => {
    const isSlotReserved = reservations.some(res => res.court === court && res.time === time);
    if (!isSlotReserved) {
      setSelectedSlot({ court, time });
    }
  };

  const handleCloseModal = () => {
    setSelectedSlot(null);
  };

  const confirmReservation = async () => {
    const today = new Date();
    const startTime = new Date(`${format(today, 'yyyy-MM-dd')}T${selectedSlot.time}`);
    const endTime = new Date(startTime);
    endTime.setMinutes(startTime.getMinutes() + 30);
  
    const reservationData = {
      CourtId: selectedSlot.court,
      UserId: 1,
      Date: format(today, "yyyy-MM-dd"),
      StartTime: format(startTime, "HH:mm:ss"),
      EndTime: format(endTime, "HH:mm:ss")
    };

    try {
      const response = await fetch(`${API_URL}api/ReserveApp/CreateReservation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservationData),
      });

      if (response.ok) {
        alert("Reservation Created Successfully");
        fetchReservations();
      } else {
        alert('Failed to create reservation');
      }
    } catch (error) {
      console.error("Error during reservation:", error);
    }
    handleCloseModal();
  };

  const TimeSlot = ({ time, courtId }) => {
    const reserved = isReserved(courtId, time);
  
    const slotClass = reserved ? 'slot-reserved' : 'slot-available';
  
    return (
      <div className={slotClass} onClick={() => !reserved && handleSlotClick(courtId, time)}>
        {time}
      </div>
    );
  };

  
  

  // Generate time slots from 8:00 to 20:00 every 30 minutes
  const times = [];
  for (let hour = 8; hour <= 20; hour++) {
    times.push(`${hour < 10 ? '0' + hour : hour}:00`);
    times.push(`${hour < 10 ? '0' + hour : hour}:30`);
  }
  
  {times.map(time => (
    <TimeSlot
      key={time}
      time={time}
      courtId={1} // lub inny identyfikator kortu
    />
  ))}
  
  const isReserved = (court, time) => {
    return reservations.some(res => res.court === court && res.time === time);
  };

  return (
    <div className="App">
      <table className="reservation-calendar">
        <thead>
          <tr>
            <th>Godzina</th>
            <th>Kort 1</th>
            <th>Kort 2</th>
          </tr>
        </thead>
        <tbody>
          {times.map(time => (
            <tr key={time}>
              <td>{time}</td>
              <td
                className={isReserved(1, time) ? 'reserved' : 'available'}
                onClick={() => handleSlotClick(1, time)}
              >
                {isReserved(1, time) ? 'Reserved' : 'Available'}
              </td>
              <td
                className={isReserved(2, time) ? 'reserved' : 'available'}
                onClick={() => handleSlotClick(2, time)}
              >
                {isReserved(2, time) ? 'Reserved' : 'Available'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedSlot && (
        <div className="modal">
          <div className="modal-content">
            <h2>Potwierdź rezerwację</h2>
            <p>Kort: {selectedSlot.court}, Godzina: {selectedSlot.time}</p>
            <Button onClick={confirmReservation}>Potwierdź</Button>
            <Button onClick={handleCloseModal}>Anuluj</Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
