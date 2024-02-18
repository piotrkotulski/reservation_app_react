import React, { useState, useEffect, useReducer } from 'react';
import { Container, Table, Form, Button, Row, Col } from 'react-bootstrap';
import { debounce } from 'lodash';

// Definicja reducera do obsługi stanu filtrów
const filterReducer = (state, action) => {
  switch (action.type) {
    case 'SET_COURT_ID':
      return { ...state, courtId: action.courtId };
    case 'SET_USER_ID':
      return { ...state, userId: action.userId };
    case 'SET_DATE':
      return { ...state, date: action.date };
    case 'CLEAR':
      return { courtId: '', userId: '', date: '' };
    default:
      return state;
  }
};

const Reservations = () => {
    const [reservations, setReservations] = useState([]);
    const [filteredReservations, setFilteredReservations] = useState([]);
    const [filter, dispatch] = useReducer(filterReducer, { courtId: '', userId: '', date: '' });

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await fetch('http://localhost:5160/api/ReserveApp/GetReservations');
                const data = await response.json();
                setReservations(data);
                setFilteredReservations(data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchReservations();
    }, []);

    const debounceFilterChange = debounce((name, value) => {
        dispatch({ type: name.toUpperCase(), [name]: value });
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

    return (
        <Container className="mt-5">
            <h1>Rezerwacje</h1>
            <Row className="mb-4">
                <Col md={4}>
                    <Form.Control
                        type="text"
                        placeholder="ID Kortu"
                        name="courtId"
                        onChange={handleFilterChange}
                    />
                </Col>
                <Col md={4}>
                    <Form.Control
                        type="text"
                        placeholder="ID Użytkownika"
                        name="userId"
                        onChange={handleFilterChange}
                    />
                </Col>
                <Col md={4}>
                    <Form.Control
                        type="date"
                        name="date"
                        onChange={handleFilterChange}
                    />
                </Col>
            </Row>
            <Button variant="secondary" onClick={clearFilters}>Wyczyść filtry</Button>
            <Table striped bordered hover className="mt-4">
                <thead>
                    <tr>
                        <th>ID Rezerwacji</th>
                        <th>ID Kortu</th>
                        <th>ID Użytkownika</th>
                        <th>Data</th>
                        <th>Godzina Rozpoczęcia</th>
                        <th>Godzina Zakończenia</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredReservations.map((reservation) => (
                        <tr key={reservation.ReservationId}>
                            <td>{reservation.ReservationId}</td>
                            <td>{reservation.CourtId}</td>
                            <td>{reservation.UserId}</td>
                            <td>{new Date(reservation.Date).toLocaleDateString()}</td>
                            <td>{reservation.StartTime}</td>
                            <td>{reservation.EndTime}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}

export default Reservations;



