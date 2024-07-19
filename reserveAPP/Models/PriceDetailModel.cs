namespace reserveAPP.Models
{
    public class PriceDetailModel
    {
        public int PriceDetailId { get; set; }
        public int PriceTypeId { get; set; }
        public int PriceSeasonId { get; set; }
        public int PriceDayTypeId { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public decimal Price { get; set; }
    }
}