import React, {useState, useEffect} from 'react';
import './styles/global.scss';
import NavigationBar from './components/views/Navbar';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import HomePage from "./components/pages/HomePage/HomePage";
import Reports from './components/pages/Reports';
import Reservations from './components/pages/Reservations';
import Users from './components/pages/Users';
import Settings from './components/pages/Settings/Settings';
import Trainers from './components/pages/Trainers/Trainers';
import Pricing from './components/pages/Pricing/Pricing';
import {format, addMinutes} from 'date-fns';
import styles from "./components/pages/HomePage/HomePage.module.scss";

const App = () => {
    const API_URL = "http://localhost:5160/";

    const [selectedSlot, setSelectedSlot] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [duration, setDuration] = useState(30);
    const [numCourts, setNumCourts] = useState(2);
    const [displayedReservations, setDisplayedReservations] = useState(new Set());
    const [openingHour, setOpeningHour] = useState(8);
    const [closingHour, setClosingHour] = useState(22);
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [userGroups, setUserGroups] = useState(JSON.parse(localStorage.getItem('userGroups')) || []);
    const addUserGroup = (group) =>{
        setUserGroups((state) => [...state, group]);
    }

    const deleteGroup = (id) => {
        setUserGroups((state) => state.filter(group => group.id !== id));
    }

    const editGroup = (id, newName, newColor) => {
        setUserGroups((state) => state.map(group => group.id === id ? {id, name: newName, color: newColor} : group));
    }

    useEffect(() => {
        fetchReservations();
    }, [selectedDate]);

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
            const response = await fetch(`${API_URL}api/ReserveApp/GetReservations?date=${selectedDate}`);
            if (response.ok) {
                const data = await response.json();
                const formattedData = data.map(reservation => ({
                    ...reservation,
                    id: reservation.ReservationId,
                    Date: format(new Date(reservation.Date), 'yyyy-MM-dd'),
                    StartTime: format(new Date('1970-01-01T' + reservation.StartTime), 'HH:mm'),
                    EndTime: format(new Date('1970-01-01T' + reservation.EndTime), 'HH:mm')
                }));
                console.log(formattedData);
                setReservations(formattedData);
            } else {
                console.error("Failed to fetch reservations");
            }
        } catch (error) {
            console.error("Error fetching reservations:", error);
        }
    };

    const handleSlotClick = (courtId, time) => {
        const endTime = format(addMinutes(new Date(`1970-01-01T${time}`), duration), 'HH:mm');
        const reservation = isReserved(courtId, time, endTime);
        if (reservation) {
            setSelectedReservation(reservation);
        } else {
            setSelectedSlot({courtId, time, endTime});
        }
    };

    const handleCloseModal = () => {
        setSelectedSlot(null);
        setSelectedReservation(null);
    };

    const confirmReservation = async (courtId, pickedHour, clientName, phoneNumber, notes, multiSportCard, duration, groupName, userId) => {
        const isAvailable = (courtId, startTime, endTime) => {
            return reservations.every(res => {
                if (res.CourtId === courtId && res.Date === selectedDate) {
                    const resStartTime = new Date(`${selectedDate}T${res.StartTime}`);
                    const resEndTime = new Date(`${selectedDate}T${res.EndTime}`);
                    console.log("ABC",resStartTime, resEndTime, startTime, endTime);
                    return (endTime <= resStartTime || startTime >= resEndTime);

                }
                return true;
            });
        };

        console.log("Confirming Reservation with Group: ", groupName);
        const startTime = new Date(`${selectedDate}T${selectedSlot.time}`);
        const endTime = new Date(startTime);
        endTime.setMinutes(startTime.getMinutes() + duration);

        if (!isAvailable(selectedSlot.courtId, startTime, endTime)) {
            alert("Court is already reserved at this time");
            return;
        }

        const reservationData = {
            CourtId: courtId,
            PickedHour: pickedHour,
            UserId: userId || 1,
            Date: selectedDate,
            StartTime: format(startTime, "HH:mm:ss"),
            EndTime: format(endTime, "HH:mm:ss"),
            ClientName: clientName,
            PhoneNumber: phoneNumber,
            Notes: notes,
            MultiSportCard: multiSportCard,
            GroupName: groupName
        };

        try {
            const response = await fetch(`${API_URL}api/ReserveApp/CreateReservation`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(reservationData),
            });

            if (response.ok) {
                console.log("Reservation created successfully with group: ", groupName);
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


    const updateReservation = async (courtId, pickedHour, reservationId, clientName, phoneNumber, notes, multiSportCard, duration, groupName, userId) => {
        console.log("Updating Reservation with Group: ", groupName);
        const startTime = new Date(`${selectedDate}T${selectedSlot ? selectedSlot.time : selectedReservation.StartTime}`);
        const endTime = new Date(startTime);
        endTime.setMinutes(startTime.getMinutes() + duration);

        const reservationData = {
            //CourtId: selectedSlot ? selectedSlot.courtId : selectedReservation.CourtId,
            CourtId: courtId,
            PickedHour: pickedHour,
            UserId: userId || selectedReservation.UserId,
            Date: selectedDate,
            StartTime: format(startTime, "HH:mm:ss"),
            EndTime: format(endTime, "HH:mm:ss"),
            ClientName: clientName,
            PhoneNumber: phoneNumber,
            Notes: notes,
            MultiSportCard: multiSportCard,
            GroupName: groupName
        };

        try {
            const response = await fetch(`${API_URL}api/ReserveApp/UpdateReservation/${reservationId}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(reservationData),
            });

            if (response.ok) {
                console.log("Reservation updated successfully with group: ", groupName);
                alert("Reservation Updated Successfully");
                fetchReservations();
            } else {
                alert('Failed to update reservation');
            }
        } catch (error) {
            console.error("Error during reservation update:", error);
        }
        handleCloseModal();
    };

    const confirmDelete = async (reservation) => {
        try {
            console.log(reservation);
            const response = await fetch(`${API_URL}api/ReserveApp/DeleteReservation/${reservation.ReservationId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert("Reservation Deleted Successfully");
                fetchReservations();
            } else {
                const errorData = await response.json().catch(() => ({
                    message: 'Unknown error occurred'
                }));
                alert(`Failed to delete reservation: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error during deletion:", error);
        }
        handleCloseModal();
    };

    const isReserved = (courtId, startTime, endTime) => {
        return reservations.find(res =>
            res.CourtId === courtId &&
            res.Date === selectedDate &&
            res.StartTime <= startTime &&
            res.EndTime > startTime
            //((startTime > res.startTime && endTime >= res.endTime) || (startTime <= res.endTime && endTime < res.endTime))
        );
    };


    const times = [];
    for (let hour = openingHour; hour <= closingHour; hour++) {
        let currentTime = new Date();
        currentTime.setHours(hour, 0, 0, 0);

        for (let minute = 0; minute < 60; minute += 30) {
            let slotTime = addMinutes(currentTime, minute);
            times.push(format(slotTime, 'HH:mm'));
        }
    }

    const timeSlots = times.map(time => (
        <tr key={time}>
            <td className={styles.hourCell}>{time}</td>
            {Array.from({length: numCourts}, (_, i) => {
                const courtId = i + 1;
                const endTime = format(addMinutes(new Date(`1970-01-01T${time}`), duration), 'HH:mm');
                const reservation = isReserved(courtId, time, endTime);

                //const reservation = !isAvailable(courtId, time);
                const isTimeReserved = reservation != null;

                let displayDetails = null;
                if (reservation && isFirstSlotOfReservation(reservation, time)) {
                    displayDetails = `${reservation.StartTime} - ${reservation.EndTime} ${reservation.ClientName} ${reservation.PhoneNumber}`;
                }
                if (isTimeReserved) {
                    const reservationKey = `${reservation.Date}-${reservation.StartTime}-${reservation.CourtId}`;
                    const isFirstSlotOfReservation = !displayedReservations.has(reservationKey);

                    if (isFirstSlotOfReservation) {
                        displayDetails = (
                            <span className="reservation-details">
                {reservation.StartTime} - {reservation.EndTime} {reservation.ClientName} {reservation.PhoneNumber}
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

    const handleSaveGroups = (groups) => {
        setUserGroups(groups);
        localStorage.setItem('userGroups', JSON.stringify(groups));
    };

    return (
        <Router>
            <div className="App">
                <NavigationBar/>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <HomePage
                                API_URL={API_URL}
                                numCourts={numCourts}
                                setNumCourts={setNumCourts}
                                courtHeaders={courtHeaders}
                                timeSlots={timeSlots}
                                selectedSlot={selectedSlot}
                                selectedReservation={selectedReservation}
                                confirmReservation={confirmReservation}
                                updateReservation={updateReservation}
                                handleCloseModal={handleCloseModal}
                                confirmDelete={confirmDelete}
                                selectedDate={selectedDate}
                                setSelectedDate={setSelectedDate}
                                userGroups={userGroups}
                            />
                        }
                    />
                    <Route path="/reports" element={<Reports/>}/>
                    <Route path="/reservations" element={<Reservations
                        confirmDelete={confirmDelete}
                        selectedReservation={selectedReservation}
                    />}/>
                    <Route path="/users" element={<Users/>}/>
                    <Route
                        path="/settings"
                        element={
                            <Settings
                                numCourts={numCourts}
                                setNumCourts={setNumCourts}
                                openingHour={openingHour}
                                closingHour={closingHour}
                                setOpeningHour={setOpeningHour}
                                setClosingHour={setClosingHour}
                                userGroups={userGroups}
                                handleSaveGroups={handleSaveGroups}
                                adduserGroup={addUserGroup}
                                deleteGroup={deleteGroup}
                                editGroup={editGroup}
                            />
                        }
                    />
                    <Route path="/trainers" element={<Trainers API_URL={API_URL} />} />
                    <Route path="/pricing" element={<Pricing API_URL={API_URL} />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;