import React, { useState, useEffect } from 'react';
import './App.css';
import Button from '@mui/material/Button';
import { format, addMinutes } from 'date-fns';

// Główny komponent aplikacji, zarządza stanem i interfejsem użytkownika.
function App() {
  // Adres API serwera backendowego.
  const API_URL = "http://localhost:5160/";

  // Zmienne stanu do zarządzania wybranymi slotami, rezerwacjami i wybraną rezerwacją.
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [duration, setDuration] = useState(30); // Domyślna długość rezerwacji.
  const [numCourts, setNumCourts] = useState(2); // Domyślna liczba kortów do rezerwacji.
  const [displayedReservations, setDisplayedReservations] = useState(new Set());

  // Pobieranie rezerwacji z serwera przy montowaniu komponentu.
  useEffect(() => {
    fetchReservations();
  }, []);

  // Aktualizacja wyświetlanych rezerwacji po zmianie danych rezerwacji.
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

  // Przygotowanie nagłówków tabeli dla każdego kortu.
  const courtHeaders = [];
  for (let i = 1; i <= numCourts; i++) {
    courtHeaders.push(<th key={`court-${i}`}>Kort {i}</th>);
  }

  // Funkcja do pobierania rezerwacji z serwera.
  const fetchReservations = async () => {
    try {
      const response = await fetch(`${API_URL}api/ReserveApp/GetReservations`);
      if (response.ok) {
        const data = await response.json();
        // Formatowanie daty i czasu rezerwacji.
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

  // Obsługa kliknięcia w slot: wybranie rezerwacji lub przygotowanie do nowej rezerwacji.
  const handleSlotClick = (court, time) => {
    const reservation = isReserved(court, time);
    if (reservation) {
      setSelectedReservation(reservation);
    } else {
      setSelectedSlot({ court, time });
    }
  };

  // Zamknięcie modala i czyszczenie wybranego slotu lub rezerwacji.
  const handleCloseModal = () => {
    setSelectedSlot(null);
    setSelectedReservation(null);
  };

  // Potwierdzenie nowej rezerwacji i wysłanie jej do serwera.
  const confirmReservation = async () => {
    // Obliczanie końcowego czasu rezerwacji.
    const today = new Date();
    const startTime = new Date(`${format(today, 'yyyy-MM-dd')}T${selectedSlot.time}`);
    const endTime = new Date(startTime);
    endTime.setMinutes(startTime.getMinutes() + duration); // Użycie zmiennej 'duration'.
  
    // Przygotowanie danych rezerwacji do wysłania.
    const reservationData = {
      CourtId: selectedSlot.court,
      UserId: 1, // Tu powinna być dynamiczna wartość identyfikująca użytkownika.
      Date: format(today, "yyyy-MM-dd"),
      StartTime: format(startTime, "HH:mm:ss"),
      EndTime: format(endTime, "HH:mm:ss")
    };

    // Wysyłanie żądania do serwera.
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


  // Usunięcie rezerwacji 
  const confirmDelete = async (reservation) => {
    try {
      const response = await fetch(`${API_URL}api/ReserveApp/DeleteReservation/${reservation.id}`, {
        method: 'DELETE'
      });
  
      if (response.ok) {
        alert("Reservation Deleted Successfully");
        fetchReservations(); // Ponownie wczytaj rezerwacje, aby odświeżyć widok
      } else {
        const errorData = await response.json();
        alert(`Failed to delete reservation: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error during deletion:", error);
    }
    handleCloseModal();
  };
  
  // Sprawdzenie, czy dany slot jest zarezerwowany
  const isReserved = (court, time) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return reservations.find(res =>
      res.CourtId === court &&
      res.Date === today &&
      res.StartTime <= time &&
      res.EndTime > time
    );
  };

  // Generowanie slotów czasowych dla każdej godziny.
  const times = [];
  for (let hour = 8; hour <= 20; hour++) {
    times.push(`${hour < 10 ? '0' + hour : hour}:00`);
    times.push(`${hour < 10 ? '0' + hour : hour}:30`);
  }


  // Mapowanie slotów czasowych do wierszy tabeli.
  const timeSlots = times.map(time => (
    <tr key={time}>
      <td>{time}</td>
      {Array.from({ length: numCourts }, (_, i) => {
        const courtId = i + 1;
        const reservation = isReserved(courtId, time);
        const isTimeReserved = reservation != null;

        // Additional logic to display reservation details
        let displayDetails = null;
        if (reservation && isFirstSlotOfReservation(reservation, time)) {
          displayDetails = `${reservation.StartTime} - ${reservation.EndTime}`;
        }
        if (isTimeReserved) {
          // Sprawdź, czy ta rezerwacja jest już wyświetlana
          const reservationKey = `${reservation.Date}-${reservation.StartTime}-${reservation.CourtId}`;
          const isFirstSlotOfReservation = !displayedReservations.has(reservationKey);
    
          // Jeśli to pierwsze pole rezerwacji, dodaj szczegóły do wyświetlenia
          if (isFirstSlotOfReservation) {
            displayDetails = (
              <span className="reservation-details">
                {reservation.StartTime} - {reservation.EndTime}
              </span>
            );
            // Dodaj klucz rezerwacji do zbioru, aby nie wyświetlać go ponownie
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

  // Funkcja pomocnicza do sprawdzania, czy slot jest pierwszym slotem rezerwacji.
  function isFirstSlotOfReservation(reservation, time) {
    return reservation.StartTime === time;
  }


  
  
  
  // Renderowanie interfejsu użytkownika
  return (
    <div className="App">
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
          {/* Dodaj pole wyboru dla czasu trwania */}
          <label>
            Czas trwania:
            <select value={duration} onChange={e => setDuration(Number(e.target.value))}>
              <option value={30}>30 minut</option>
              <option value={60}>1 godzina</option>
              <option value={90}>1 godzina 30 minut</option>
              <option value={120}>2 godziny</option>
              {/* Możesz dodać więcej opcji w razie potrzeby */}
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
}

export default App;
