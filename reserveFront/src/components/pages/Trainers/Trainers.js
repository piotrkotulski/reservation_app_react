import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Button,
    Modal,
    Box,
    Paper
} from '@mui/material';

const Trainers = ({ API_URL }) => {
    const [trainers, setTrainers] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentTrainer, setCurrentTrainer] = useState({
        id: null, 
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: ''
    });
    

    useEffect(() => {
        fetchTrainers();
    }, []);

    const fetchTrainers = async () => {
        try {
            const response = await fetch(`${API_URL}api/ReserveApp/GetAllTrainers`);
            if (!response.ok) {
                throw new Error('Błąd podczas pobierania trenerów');
            }
            const data = await response.json();
            setTrainers(data);
            console.log('Pobrani trenerzy:', data);
        } catch (error) {
            console.error('Błąd podczas pobierania trenerów:', error);
        }
    };
    

    const fetchTrainerDetails = async (trainerId) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}api/ReserveApp/GetTrainer/${trainerId}`);
            if (response.ok) {
                const result = await response.json();
                const trainer = result.Table[0];
                console.log("Pobrane szczegóły trenera: ", trainer);
                setCurrentTrainer({
                    trainerId: trainer.TrainerId,
                    firstName: trainer.FirstName,
                    lastName: trainer.LastName,
                    email: trainer.Email,
                    phoneNumber: trainer.PhoneNumber
                });
            } else {
                console.error('Nie udało się pobrać szczegółów trenera');
            }
        } catch (error) {
            console.error('Błąd podczas pobierania szczegółów trenera:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setCurrentTrainer({ ...currentTrainer, [e.target.name]: e.target.value });
    };

    const handleOpen = (trainer) => {
        if (trainer) {
            fetchTrainerDetails(trainer.TrainerId);
        } else {
            setCurrentTrainer({
                trainerId: null,
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

    const handleAddOrUpdateTrainer = async () => {
        if (!currentTrainer.firstName || !currentTrainer.lastName || !currentTrainer.email) {
            toast.error("Proszę uzupełnić wszystkie pola!");
            return;
        }
    
        const url = currentTrainer.id
            ? `${API_URL}api/ReserveApp/UpdateTrainer/${currentTrainer.id}`
            : `${API_URL}api/ReserveApp/AddTrainer`;
        const method = currentTrainer.id ? 'PUT' : 'POST';
    
        const body = {
            ID: currentTrainer.id,
            FirstName: currentTrainer.firstName,
            LastName: currentTrainer.lastName,
            Email: currentTrainer.email,
            PhoneNumber: currentTrainer.phoneNumber
        };
    
        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
    
            if (response.ok) {
                const result = response.status !== 204 ? await response.json() : {};
                if (!currentTrainer.id) {
                    setTrainers(prevTrainers => [...prevTrainers, result]);
                } else {
                    setTrainers(prevTrainers => prevTrainers.map(trainer => trainer.ID === currentTrainer.id ? result : trainer));
                }
                toast.success(`Trener ${currentTrainer.id ? 'zaktualizowany' : 'dodany'} pomyślnie`);
                fetchTrainers();
                handleClose();
            } else {
                const errorData = await response.json();
                toast.error(`Nie udało się ${currentTrainer.id ? 'zaktualizować' : 'dodać'} trenera: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Błąd:', error);
            toast.error('Wystąpił błąd podczas operacji dodawania/aktualizacji');
        }
    };
    
    

    const handleDeleteTrainer = async (trainerId) => {
        const response = await fetch(`${API_URL}api/ReserveApp/DeleteTrainer/${trainerId}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            toast.success('Trener usunięty pomyślnie');
            fetchTrainers();
            handleClose();
        } else {
            toast.error('Błąd w usuwaniu trenera');
        }
    };

    return (
        <Container className="mt-5">
            <ToastContainer position="top-right" autoClose={1000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <h1>Trenerzy</h1>
            <Button variant="contained" color="primary" onClick={() => handleOpen(null)}>Dodaj Trenera</Button>
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
                        {trainers.map((trainer) => (
                            <TableRow key={trainer.TrainerId} onClick={() => handleOpen(trainer)} style={{ cursor: 'pointer' }}>
                                <TableCell>{trainer.TrainerId}</TableCell>
                                <TableCell>{trainer.FirstName}</TableCell>
                                <TableCell>{trainer.LastName}</TableCell>
                                <TableCell>{trainer.Email}</TableCell>
                                <TableCell>{trainer.PhoneNumber}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Modal open={open && !loading} onClose={handleClose}>
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
                    <h2>{currentTrainer.trainerId ? 'Edytuj trenera' : 'Dodaj nowego trenera'}</h2>
                    <TextField fullWidth label="Imię" name="firstName" value={currentTrainer.firstName} onChange={handleInputChange} margin="normal" />
                    <TextField fullWidth label="Nazwisko" name="lastName" value={currentTrainer.lastName} onChange={handleInputChange} margin="normal" />
                    <TextField fullWidth label="Email" name="email" type="email" value={currentTrainer.email} onChange={handleInputChange} margin="normal" />
                    <TextField fullWidth label="Numer Telefonu" name="phoneNumber" type="tel" value={currentTrainer.phoneNumber} onChange={handleInputChange} margin="normal" />
                    <Button variant="contained" color="primary" onClick={handleAddOrUpdateTrainer}>{currentTrainer.trainerId ? 'Zaktualizuj' : 'Dodaj'}</Button>
                    {currentTrainer.trainerId && (
                        <Button variant="contained" color="secondary" onClick={() => handleDeleteTrainer(currentTrainer.trainerId)} style={{ marginLeft: '10px' }}>Usuń</Button>
                    )}
                </Box>
            </Modal>
        </Container>
    );
};

export default Trainers;