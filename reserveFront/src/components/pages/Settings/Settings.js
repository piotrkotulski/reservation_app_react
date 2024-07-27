import React, { useState, useEffect } from 'react';
import { ChromePicker } from 'react-color';
import {
    TextField,
    Button,
    Typography,
    Box,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton
} from '@mui/material';
import { Add, Save, Edit, Delete } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Settings.module.scss';

const Settings = ({
    numCourts,
    setNumCourts,
    openingHour,
    closingHour,
    setOpeningHour,
    setClosingHour,
    API_URL,
    adduserGroup,
    deleteGroup,
    editGroup
}) => {
    const [userGroups, setUserGroups] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [groupColor, setGroupColor] = useState('#ffffff');
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchUserGroups();
    }, []);

    const fetchUserGroups = async () => {
        try {
            const response = await fetch(`${API_URL}api/ReserveApp/GetUserGroups`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setUserGroups(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Błąd podczas pobierania grup użytkowników:', error);
            toast.error('Błąd podczas pobierania grup użytkowników.');
        }
    };

    const handleAddGroup = async () => {
        if (!groupName || !groupColor) {
            toast.error("Proszę uzupełnić wszystkie pola!");
            return;
        }

        const newGroup = { GroupName: groupName, GroupColor: groupColor };

        try {
            let response;
            if (editingId) {
                response = await fetch(`${API_URL}api/ReserveApp/UpdateUserGroup/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newGroup)
                });
            } else {
                response = await fetch(`${API_URL}api/ReserveApp/CreateUserGroup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newGroup)
                });
            }

            if (response.ok) {
                toast.success(editingId ? 'Grupa zaktualizowana pomyślnie' : 'Grupa dodana pomyślnie');
                fetchUserGroups();
                setGroupName('');
                setGroupColor('#ffffff');
                setEditingIndex(null);
                setEditingId(null);
            } else {
                const errorData = await response.json();
                toast.error(`Nie udało się ${editingId ? 'zaktualizować' : 'dodać'} grupy: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Błąd:', error);
            toast.error(`Wystąpił błąd podczas ${editingId ? 'aktualizacji' : 'dodawania'} grupy`);
        }
    };

    const handleEditGroup = (index, id) => {
        const group = userGroups[index];
        setGroupName(group.GroupName);
        setGroupColor(group.GroupColor);
        setEditingIndex(index);
        setEditingId(id);
    };

    const handleDeleteGroup = async (index, id) => {
        try {
            const response = await fetch(`${API_URL}api/ReserveApp/DeleteUserGroup/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                toast.success('Grupa usunięta pomyślnie');
                fetchUserGroups();
            } else {
                const errorData = await response.json();
                toast.error(`Nie udało się usunąć grupy: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Błąd podczas usuwania grupy:', error);
            toast.error('Wystąpił błąd podczas usuwania grupy');
        }
    };

    const handleSave = () => {
        // Możesz zaimplementować dodatkowe logowanie lub zapisywanie stanu
        console.log('Current user groups state:', userGroups);
    };

    return (
        <Box className={styles.settings}>
            <Typography variant="h4" gutterBottom>USTAWIENIA</Typography>

            <Box className={styles.courtSettings}>
                <Typography variant="h6" gutterBottom>Ilość kortów w obiekcie</Typography>
                <TextField
                    label="Liczba kortów"
                    type="number"
                    value={numCourts}
                    onChange={(e) => setNumCourts(parseInt(e.target.value))}
                    inputProps={{ min: 1 }}
                    fullWidth
                    margin="normal"
                />

                <Typography variant="h6" gutterBottom>Dostępny przedział czasowy</Typography>
                <TextField
                    label="Godzina otwarcia"
                    type="number"
                    value={openingHour}
                    onChange={(e) => setOpeningHour(parseInt(e.target.value))}
                    inputProps={{ min: 0, max: 23 }}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Godzina zamknięcia"
                    type="number"
                    value={closingHour}
                    onChange={(e) => setClosingHour(parseInt(e.target.value))}
                    inputProps={{ min: 0, max: 23 }}
                    fullWidth
                    margin="normal"
                />
            </Box>

            <Box className={styles.userGroupConfig}>
                <Typography variant="h6" gutterBottom>Konfiguracja grup użytkowników</Typography>
                <TextField
                    label="Nazwa grupy"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Typography variant="body1" gutterBottom>Wybierz kolor:</Typography>
                <ChromePicker
                    color={groupColor}
                    onChangeComplete={(color) => setGroupColor(color.hex)}
                />
                <Box mt={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={handleAddGroup}
                        sx={{ mr: 2 }}
                    >
                        {editingIndex !== null ? 'Zaktualizuj grupę' : 'Dodaj grupę'}
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<Save />}
                        onClick={handleSave}
                    >
                        Zapisz
                    </Button>
                </Box>

                <Box mt={4}>
                    <Typography variant="h6" gutterBottom>Lista grup</Typography>
                    <List>
                        {userGroups.map((group, index) => (
                            <ListItem key={group.UserGroupId}>
                                <ListItemIcon>
                                    <div style={{
                                        backgroundColor: group.GroupColor,
                                        width: 24,
                                        height: 24,
                                        borderRadius: '50%'
                                    }} />
                                </ListItemIcon>
                                <ListItemText primary={group.GroupName} />
                                <IconButton onClick={() => handleEditGroup(index, group.UserGroupId)}>
                                    <Edit />
                                </IconButton>
                                <IconButton onClick={() => handleDeleteGroup(index, group.UserGroupId)}>
                                    <Delete />
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Box>
            <ToastContainer />
        </Box>
    );
};

export default Settings;
