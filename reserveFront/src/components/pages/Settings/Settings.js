import React from 'react';
import { TextField, InputAdornment, IconButton, Container, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const Settings = ({ numCourts, setNumCourts, openingHour, setOpeningHour, closingHour, setClosingHour }) => {
    const handleIncrement = () => {
        setNumCourts((prevCount) => (prevCount < 10 ? prevCount + 1 : prevCount));
    };

    const handleDecrement = () => {
        setNumCourts((prevCount) => (prevCount > 1 ? prevCount - 1 : prevCount));
    };

    const handleChange = (e) => {
        const value = Number(e.target.value);
        setNumCourts(value >= 1 && value <= 10 ? value : numCourts);
    };

    const handleOpeningHourChange = (e) => {
        setOpeningHour(e.target.value);
    };

    const handleClosingHourChange = (e) => {
        setClosingHour(e.target.value);
    };

    return (
        <Container className="mt-5">
            <h2>Ustawienia</h2>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="Liczba kortów"
                        type="number"
                        value={numCourts}
                        onChange={handleChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IconButton onClick={handleDecrement} disabled={numCourts <= 1}>
                                        <RemoveIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleIncrement} disabled={numCourts >= 10}>
                                        <AddIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        inputProps={{
                            style: { textAlign: 'center' },
                            min: 1,
                            max: 10,
                        }}
                        variant="outlined"
                        size="small"
                        fullWidth
                    />
                </Grid>
                {/*<Grid item xs={6}>
                    <TextField
                        label="Godzina otwarcia"
                        type="time"
                        value={openingHour}
                        onChange={handleOpeningHourChange}
                        inputProps={{
                            step: 1800, // 30 min
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        size="small"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Godzina zamknięcia"
                        type="time"
                        value={closingHour}
                        onChange={handleClosingHourChange}
                        inputProps={{
                            step: 1800, // 30 min
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        size="small"
                        fullWidth
                    />
                </Grid>*/}
            </Grid>
        </Container>
    );
};

export default Settings;

