const deleteReservation = async (id) => {
    try {
        await axios.delete(`${API_URL}/reservations/${id}`);

        //TODO: update globalnego stanu i rezerwacji w globanym stanie

    } catch (error) {
        console.error(error);
    }
}