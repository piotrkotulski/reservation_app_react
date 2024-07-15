import React, {useState} from 'react';
import {ChromePicker} from 'react-color';
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
import {Add, Save, Edit, Delete} from '@mui/icons-material';
import {nanoid} from 'nanoid'
import styles from './Settings.module.scss';

const Settings = ({
                      numCourts,
                      setNumCourts,
                      openingHour,
                      closingHour,
                      setOpeningHour,
                      setClosingHour,
                      handleSaveGroups,
                      adduserGroup,
                      deleteGroup,
                      editGroup
                  }) => {
    const [userGroups, setUserGroups] = useState(JSON.parse(localStorage.getItem('userGroups')) || []);
    const [groupName, setGroupName] = useState('');
    const [groupColor, setGroupColor] = useState('#ffffff');
    const [editingIndex, setEditingIndex] = useState(null);

    const handleAddGroup = () => {
        const newGroup = {id: nanoid(), name: groupName, color: groupColor};
        adduserGroup(newGroup);
        const updatedGroups = editingIndex !== null ? userGroups.map((group, index) => index === editingIndex ? newGroup : group) : [...userGroups, newGroup];
        setUserGroups(updatedGroups);
        localStorage.setItem('userGroups', JSON.stringify(updatedGroups));
        setGroupName('');
        setGroupColor('#ffffff');
        setEditingIndex(null);
    };

    const handleEditGroup = (index, id) => {
        editGroup(id, groupName, groupColor);
        setGroupName(userGroups[index].name);
        setGroupColor(userGroups[index].color);
        setEditingIndex(index);
    };

    const handleDeleteGroup = (index, id) => {
        deleteGroup(id)
        const updatedGroups = userGroups.filter((_, i) => i !== index);
        setUserGroups(updatedGroups);
        localStorage.setItem('userGroups', JSON.stringify(updatedGroups));
    };

    const handleSave = () => {
        console.log('Groups saved:', userGroups);
        handleSaveGroups(userGroups);
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
                    inputProps={{min: 1}}
                    fullWidth
                    margin="normal"
                />

                <Typography variant="h6" gutterBottom>Dostępny przedział czasowy</Typography>
                <TextField
                    label="Godzina otwarcia"
                    type="number"
                    value={openingHour}
                    onChange={(e) => setOpeningHour(parseInt(e.target.value))}
                    inputProps={{min: 0, max: 23}}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Godzina zamknięcia"
                    type="number"
                    value={closingHour}
                    onChange={(e) => setClosingHour(parseInt(e.target.value))}
                    inputProps={{min: 0, max: 23}}
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
                        startIcon={<Add/>}
                        onClick={handleAddGroup}
                        sx={{mr: 2}}
                    >
                        {editingIndex !== null ? 'Zaktualizuj grupę' : 'Dodaj kolejny'}
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<Save/>}
                        onClick={handleSave}
                    >
                        Zapisz
                    </Button>
                </Box>

                <Box mt={4}>
                    <Typography variant="h6" gutterBottom>Lista grup</Typography>
                    <List>
                        {userGroups.map((group, index) => (
                            <ListItem key={group.id}>
                                <ListItemIcon>
                                    <div style={{
                                        backgroundColor: group.color,
                                        width: 24,
                                        height: 24,
                                        borderRadius: '50%'
                                    }}/>
                                </ListItemIcon>
                                <ListItemText primary={group.name}/>
                                <IconButton onClick={() => handleEditGroup(index, group.id)}>
                                    <Edit/>
                                </IconButton>
                                <IconButton onClick={() => handleDeleteGroup(index, group.id)}>
                                    <Delete/>
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Box>
        </Box>
    );
};

export default Settings;