import React, { useState, useEffect } from 'react';
//import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.scss';
import NavigationBar from './components/views/Navbar';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // zmiana importu na Routes
import HomePage from "./components/pages/HomePage/HomePage";
import Reports from './components/pages/Reports';
import Reservations from './components/pages/Reservations';
import Users from './components/pages/Users';
import { format, addMinutes } from 'date-fns';

function App() {
  const API_URL = "http://localhost:5160/";

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [duration, setDuration] = useState(30);
  const [numCourts, setNumCourts] = useState(2);
  const [displayedReservations, setDisplayedReservations] = useState(new Set());

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    if (reservations.length > 0) {
      const newDisplayedReservations = new Set();

      reservations.forEach(reservation => {
        const reservationKey = `${reservation.Date}-${reservation.StartTime}-${reservation.CourtId}`;
        newDisplayedReservations.add(reservationKey);
      });

      setDisplayedReservations(newDisplayedReservations);
    }
  }, [reservations]);

  const courtHeaders = [];
  for (let i = 1; i <= numCourts; i++) {
    courtHeaders.push(<th key={`court-${i}`}>Kort {i}</th>);
  }

  const fetchReservations = async () => {
    try {
      const response = await fetch(`${API_URL}api/ReserveApp/GetReservations`);
      if (response.ok) {
        const data = await response.json();
        const formattedData = data.map(reservation => ({
          ...reservation,
          id: reservation.ReservationId,
          Date: format(new Date(reservation.Date), 'yyyy-MM-dd'),
          StartTime: format(new Date('1970-01-01T' + reservation.StartTime), 'HH:mm'),
          EndTime: format(new Date('1970-01-01T' + reservation.EndTime), 'HH:mm')
        }));
        setReservations(formattedData);
      } else {
        console.error("Failed to fetch reservations");
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const handleSlotClick = (court, time) => {
    const reservation = isReserved(court, time);
    if (reservation) {
      setSelectedReservation(reservation);
    } else {
      setSelectedSlot({ court, time });
    }
  };

  const handleCloseModal = () => {
    setSelectedSlot(null);
    setSelectedReservation(null);
  };

  const confirmReservation = async () => {
    const today = new Date();
    const startTime = new Date(`${format(today, 'yyyy-MM-dd')}T${selectedSlot.time}`);
    const endTime = new Date(startTime);
    endTime.setMinutes(startTime.getMinutes() + duration);

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

  const confirmDelete = async (reservation) => {
    try {
      const response = await fetch(`${API_URL}api/ReserveApp/DeleteReservation/${reservation.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert("Reservation Deleted Successfully");
        fetchReservations();
      } else {
        const errorData = await response.json();
        alert(`Failed to delete reservation: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error during deletion:", error);
    }
    handleCloseModal();
  };

  const isReserved = (court, time) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return reservations.find(res =>
        res.CourtId === court &&
        res.Date === today &&
        res.StartTime <= time &&
        res.EndTime > time
    );
  };

  const times = [];
  for (let hour = 8; hour <= 20; hour++) {
    times.push(`${hour < 10 ? '0' + hour : hour}:00`);
    times.push(`${hour < 10 ? '0' + hour : hour}:30`);
  }

  const timeSlots = times.map(time => (
      <tr key={time}>
        <td>{time}</td>
        {Array.from({ length: numCourts }, (_, i) => {
          const courtId = i + 1;
          const reservation = isReserved(courtId, time);
          const isTimeReserved = reservation != null;

          let displayDetails = null;
          if (reservation && isFirstSlotOfReservation(reservation, time)) {
            displayDetails = `${reservation.StartTime} - ${reservation.EndTime}`;
          }
          if (isTimeReserved) {
            const reservationKey = `${reservation.Date}-${reservation.StartTime}-${reservation.CourtId}`;
            const isFirstSlotOfReservation = !displayedReservations.has(reservationKey);

            if (isFirstSlotOfReservation) {
              displayDetails = (
                  <span className="reservation-details">
                {reservation.StartTime} - {reservation.EndTime}
              </span>
              );
              setDisplayedReservations(prev => new Set(prev.add(reservationKey)));
            }
          }
          let reservationClass = 'available';
          if (isTimeReserved) {
            reservationClass = 'reserved';
            if (reservation.StartTime === time) {
              reservationClass += ' reserved-start';
            } else if (format(addMinutes(new Date(`${reservation.Date}T${reservation.EndTime}`), -30), 'HH:mm') === time) {
              reservationClass += ' reserved-end';
            } else {
              reservationClass += ' reserved-middle';
            }
          }

          return (
              <td
                  key={`court-${courtId}-time-${time}`}
                  className={reservationClass}
                  onClick={() => handleSlotClick(courtId, time)}
              >
                {displayDetails && (
                    <span className="reservation-details">{displayDetails}</span>
                )}
              </td>
          );
        })}
      </tr>
  ));

  function isFirstSlotOfReservation(reservation, time) {
    return reservation.StartTime === time;
  }
    return (
        <Router>
          <div className="App">
            <NavigationBar />
            <Routes>
              <Route path="/" element={<HomePage numCourts={numCourts} setNumCourts={setNumCourts} courtHeaders={courtHeaders} timeSlots={timeSlots} selectedSlot={selectedSlot} selectedReservation={selectedReservation} confirmReservation={confirmReservation} handleCloseModal={handleCloseModal} confirmDelete={confirmDelete} />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/reservations" element={<Reservations />} />
              <Route path="/users" element={<Users />} />
            </Routes>
          </div>
        </Router>
    );
  }

export default App;
