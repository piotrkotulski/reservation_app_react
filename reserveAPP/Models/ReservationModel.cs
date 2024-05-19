namespace reserveAPP.Models
{
    public class ReservationModel
    {
        public int ReservationId { get; set; }
        public int CourtId { get; set; }
        public int UserId { get; set; }
        public DateTime Date { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public string ClientName { get; set; }
        public string PhoneNumber { get; set; }
        public string Notes { get; set; }
        public bool MultiSportCard { get; set; }
    }
}