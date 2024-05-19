namespace reserveAPP.Models
{
    public class CourtModel
    {
        public int CourtId { get; set; }
        public string Type { get; set; }
        public string Name { get; set; }
        public bool IsActive { get; set; }
        public bool IsFloodlit { get; set; }
        public bool IsIndoor { get; set; }
    }
}