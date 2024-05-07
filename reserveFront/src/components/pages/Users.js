import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button, Modal, Box, Paper } from '@mui/material';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState({
        userId: null,
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: ''
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:5160/api/ReserveApp/GetUsers');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchUserDetails = async (userId) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5160/api/ReserveApp/GetUser/${userId}`);
            if (response.ok) {
                const result = await response.json();
                const user = result.Table[0];
                setCurrentUser({
                    userId: user.UserId,
                    firstName: user.FirstName,
                    lastName: user.LastName,
                    email: user.Email,
                    phoneNumber: user.PhoneNumber
                });
            } else {
                console.error('Failed to fetch user details');
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setCurrentUser({ ...currentUser, [e.target.name]: e.target.value });
    };

    const handleOpen = (user) => {
        if (user) {
            fetchUserDetails(user.UserId);
        } else {
            setCurrentUser({
                userId: null, // Reset userId for new user
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: ''
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAddOrUpdateUser = async () => {
        if (!currentUser.firstName || !currentUser.lastName || !currentUser.email || !currentUser.phoneNumber) {
            toast.error("Proszę uzupełnić wszystkie pola!");
            return;
        }
    
        const url = currentUser.userId
            ? `http://localhost:5160/api/ReserveApp/UpdateUser/${currentUser.userId}`
            : 'http://localhost:5160/api/ReserveApp/CreateUser';
        const method = currentUser.userId ? 'PUT' : 'POST';
    
        const body = { ...currentUser };
        if (!body.userId) {
            delete body.userId; // Usuwamy klucz userId, gdy dodajemy nowego użytkownika
        }
    
        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (response.ok) {
                toast.success(`Użytkownik ${currentUser.userId ? 'zaktualizowany' : 'dodany'} pomyślnie`);
                fetchUsers();  // Odświeżanie listy użytkowników
                handleClose();
            } else {
                const errorData = await response.json();
                toast.error(`Nie udało się ${currentUser.userId ? 'zaktualizować' : 'dodać'} użytkownika: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Wystąpił błąd podczas operacji dodawania/aktualizacji');
        }
    };
    
    
    
    

    const handleDeleteUser = async (userId) => {
        const response = await fetch(`http://localhost:5160/api/ReserveApp/DeleteUser/${userId}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            toast.success('Użytkownik usunięty pomyślnie');
            fetchUsers();  // Ponowne ładowanie listy użytkowników
            handleClose();
        } else {
            toast.error('Błąd w usuwaniu użytkownika');
        }
    };
    
    

    return (
        <Container className="mt-5">
            <ToastContainer position="top-right" autoClose={1000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <h1>Użytkownicy</h1>
            <Button variant="contained" color="primary" onClick={() => handleOpen(null)}>Dodaj Użytkownika</Button>
            <TableContainer component={Paper} className="mt-4">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Imię</TableCell>
                            <TableCell>Nazwisko</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Numer Telefonu</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.UserId} onClick={() => handleOpen(user)} style={{ cursor: 'pointer' }}>
                                <TableCell>{user.UserId}</TableCell>
                                <TableCell>{user.FirstName}</TableCell>
                                <TableCell>{user.LastName}</TableCell>
                                <TableCell>{user.Email}</TableCell>
                                <TableCell>{user.PhoneNumber}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Modal open={open && !loading} onClose={handleClose}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
                    <h2>{currentUser.userId ? 'Edytuj użytkownika' : 'Dodaj nowego użytkownika'}</h2>
                    <TextField fullWidth label="Imię" name="firstName" value={currentUser.firstName} onChange={handleInputChange} margin="normal" />
                    <TextField fullWidth label="Nazwisko" name="lastName" value={currentUser.lastName} onChange={handleInputChange} margin="normal" />
                    <TextField fullWidth label="Email" name="email" type="email" value={currentUser.email} onChange={handleInputChange} margin="normal" />
                    <TextField fullWidth label="Numer Telefonu" name="phoneNumber" type="tel" value={currentUser.phoneNumber} onChange={handleInputChange} margin="normal" />
                    <Button variant="contained" color="primary" onClick={handleAddOrUpdateUser}>{currentUser.userId ? 'Zaktualizuj' : 'Dodaj'}</Button>
                    <Button variant="contained" color="secondary" onClick={() => handleDeleteUser(currentUser.userId)} style={{ marginLeft: '10px' }}>Usuń</Button>

                </Box>
            </Modal>
        </Container>
    );
};

export default Users;
