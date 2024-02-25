import React, { useState, useEffect } from 'react';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button, Modal, Box, Paper } from '@mui/material';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [newUser, setNewUser] = useState({
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
            if (response.ok) {
                const data = await response.json();
                console.log(data); // Dodaj to, aby zobaczyć dane w konsoli
                setUsers(data);
            } else {
                console.error('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    

    const handleInputChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleAddUser = async () => {
        try {
            const response = await fetch('http://localhost:5160/api/ReserveApp/CreateUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    email: newUser.email,
                    phoneNumber: newUser.phoneNumber
                }),
            });
            if (response.ok) {
                setNewUser({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phoneNumber: ''
                });
                fetchUsers();
                handleClose();
            } else {
                console.error('Failed to add user');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Container className="mt-5">
            <h1>Użytkownicy</h1>
            <Button variant="contained" color="primary" onClick={handleOpen}>Dodaj Użytkownika</Button>
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
                        {users.map((user) => (
                            <TableRow key={user.UserId}>
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
            <Modal open={open} onClose={handleClose}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4
                }}>
                    <h2>Dodaj nowego użytkownika</h2>
                    <TextField fullWidth label="Imię" name="firstName" value={newUser.firstName} onChange={handleInputChange} margin="normal" />
                    <TextField fullWidth label="Nazwisko" name="lastName" value={newUser.lastName} onChange={handleInputChange} margin="normal" />
                    <TextField fullWidth label="Email" name="email" type="email" value={newUser.email} onChange={handleInputChange} margin="normal" />
                    <TextField fullWidth label="Numer Telefonu" name="phoneNumber" type="tel" value={newUser.phoneNumber} onChange={handleInputChange} margin="normal" />
                    <Button variant="contained" color="primary" onClick={handleAddUser}>Dodaj</Button>
                </Box>
            </Modal>
        </Container>
    );
};

export default Users;
