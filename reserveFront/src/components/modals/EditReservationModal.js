import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem, Modal,
    Select,
    TextField
} from "@mui/material";
import styles from "../pages/HomePage/HomePage.module.scss";
import Autocomplete from "@mui/material/Autocomplete";
import React from "react";

const
    EditReservationModal = ({
                                open,
                                handleCloseModal,
                                selectedReservation,
                                duration,
                                setDuration,
                                filteredUserList,
                                clientName,
                                handleNameChange,
                                handleUserSelect,
                                phoneNumber,
                                setPhoneNumber,
                                selectedGroup,
                                setSelectedGroup,
                                userGroups,
                                notes,
                                setNotes,
                                multiSportCard,
                                setMultiSportCard,
                                handleUpdateReservation,
                                confirmDelete,

                            }) => {


        return <Modal open={open} onClose={handleCloseModal}>
            <Box className={styles.modalContent}>
                <h2>Edytuj Rezerwację</h2>
                <p>Kort: {selectedReservation?.CourtId}, Godzina: {selectedReservation?.StartTime}</p>

                <FormControl sx={{m: 1, minWidth: 120}} size="small">
                    <InputLabel id="duration-select-label">Czas trwania</InputLabel>
                    <Select
                        className={styles.durationSelect}
                        labelId="duration-select-label"
                        id="duration-select"
                        value={duration.toString()}
                        label="Czas trwania"
                        onChange={e => setDuration(Number(e.target.value))}
                    >
                        <MenuItem value={30}>30 minut</MenuItem>
                        <MenuItem value={60}>1 godzina</MenuItem>
                        <MenuItem value={90}>1 godzina 30 minut</MenuItem>
                        <MenuItem value={120}>2 godziny</MenuItem>
                    </Select>
                </FormControl>

                <Autocomplete
                    freeSolo
                    options={filteredUserList}
                    getOptionLabel={(option) => `${option.FirstName} ${option.LastName}`}
                    onChange={handleUserSelect}
                    inputValue={clientName}
                    onInputChange={handleNameChange}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Imię i nazwisko"
                            fullWidth
                            margin="normal"
                            autoComplete="off"
                        />
                    )}
                />

                <TextField
                    label="Telefon"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    fullWidth
                    margin="normal"
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel id="group-select-label">Grupa</InputLabel>
                    <Select
                        labelId="group-select-label"
                        id="group-select"
                        value={selectedGroup}
                        label="Grupa"
                        onChange={(e) => setSelectedGroup(e.target.value)}
                    >
                        {userGroups.map((group, index) => (
                            <MenuItem key={index} value={group.name}>
                                {group.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    label="Uwagi"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    fullWidth
                    margin="normal"
                    multiline
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={multiSportCard}
                            onChange={(e) => setMultiSportCard(e.target.checked)}
                        />
                    }
                    label="Karta Multisport"
                />

                <Button className={styles.successBtt} onClick={handleUpdateReservation}>Zaktualizuj</Button>
                <Button className={styles.deleteBtt} onClick={() => confirmDelete(selectedReservation)}>Usuń
                    Rezerwację</Button>
                <Button className={styles.deleteBtt} onClick={handleCloseModal}>Anuluj</Button>
            </Box>
        </Modal>

    }

export default EditReservationModal;