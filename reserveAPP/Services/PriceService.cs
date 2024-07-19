using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using reserveAPP.Models;

namespace reserveAPP.Services
{
    public class PriceService
    {
        private readonly string _connectionString;

        public PriceService(string connectionString)
        {
            _connectionString = connectionString;
        }

        // Metody do zarządzania PriceType
        public void CreatePriceType(PriceTypeModel priceType)
        {
            string query = "INSERT INTO PriceType (Name) VALUES (@Name)";

            using (SqlConnection myConn = new SqlConnection(_connectionString))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    myCommand.Parameters.AddWithValue("@Name", priceType.Name);
                    myCommand.ExecuteNonQuery();
                }
            }
        }

        public List<PriceTypeModel> GetPriceTypes()
        {
            string query = "SELECT * FROM PriceType";
            DataTable table = new DataTable();
            List<PriceTypeModel> priceTypes = new List<PriceTypeModel>();

            using (SqlConnection myConn = new SqlConnection(_connectionString))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    using (SqlDataReader myReader = myCommand.ExecuteReader())
                    {
                        table.Load(myReader);
                    }
                }
            }

            foreach (DataRow row in table.Rows)
            {
                priceTypes.Add(new PriceTypeModel
                {
                    PriceTypeId = Convert.ToInt32(row["PriceTypeId"]),
                    Name = row["Name"].ToString()
                });
            }

            return priceTypes;
        }

        // Metody do zarządzania PriceSeason
        public void CreatePriceSeason(PriceSeasonModel priceSeason)
        {
            string query = "INSERT INTO PriceSeason (Name) VALUES (@Name)";

            using (SqlConnection myConn = new SqlConnection(_connectionString))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    myCommand.Parameters.AddWithValue("@Name", priceSeason.Name);
                    myCommand.ExecuteNonQuery();
                }
            }
        }

        public List<PriceSeasonModel> GetPriceSeasons()
        {
            string query = "SELECT * FROM PriceSeason";
            DataTable table = new DataTable();
            List<PriceSeasonModel> priceSeasons = new List<PriceSeasonModel>();

            using (SqlConnection myConn = new SqlConnection(_connectionString))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    using (SqlDataReader myReader = myCommand.ExecuteReader())
                    {
                        table.Load(myReader);
                    }
                }
            }

            foreach (DataRow row in table.Rows)
            {
                priceSeasons.Add(new PriceSeasonModel
                {
                    PriceSeasonId = Convert.ToInt32(row["PriceSeasonId"]),
                    Name = row["Name"].ToString()
                });
            }

            return priceSeasons;
        }

        // Metody do zarządzania PriceDayType
        public void CreatePriceDayType(PriceDayTypeModel priceDayType)
        {
            string query = "INSERT INTO PriceDayType (Name) VALUES (@Name)";

            using (SqlConnection myConn = new SqlConnection(_connectionString))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    myCommand.Parameters.AddWithValue("@Name", priceDayType.Name);
                    myCommand.ExecuteNonQuery();
                }
            }
        }

        public List<PriceDayTypeModel> GetPriceDayTypes()
        {
            string query = "SELECT * FROM PriceDayType";
            DataTable table = new DataTable();
            List<PriceDayTypeModel> priceDayTypes = new List<PriceDayTypeModel>();

            using (SqlConnection myConn = new SqlConnection(_connectionString))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    using (SqlDataReader myReader = myCommand.ExecuteReader())
                    {
                        table.Load(myReader);
                    }
                }
            }

            foreach (DataRow row in table.Rows)
            {
                priceDayTypes.Add(new PriceDayTypeModel
                {
                    PriceDayTypeId = Convert.ToInt32(row["PriceDayTypeId"]),
                    Name = row["Name"].ToString()
                });
            }

            return priceDayTypes;
        }

        // Metody do zarządzania PriceDetail
        public void CreatePriceDetail(PriceDetailModel priceDetail)
        {
            string query = @"
                INSERT INTO PriceDetail (PriceTypeId, PriceSeasonId, PriceDayTypeId, StartTime, EndTime, Price)
                VALUES (@PriceTypeId, @PriceSeasonId, @PriceDayTypeId, @StartTime, @EndTime, @Price)";

            using (SqlConnection myConn = new SqlConnection(_connectionString))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    myCommand.Parameters.AddWithValue("@PriceTypeId", priceDetail.PriceTypeId);
                    myCommand.Parameters.AddWithValue("@PriceSeasonId", priceDetail.PriceSeasonId);
                    myCommand.Parameters.AddWithValue("@PriceDayTypeId", priceDetail.PriceDayTypeId);
                    myCommand.Parameters.AddWithValue("@StartTime", priceDetail.StartTime);
                    myCommand.Parameters.AddWithValue("@EndTime", priceDetail.EndTime);
                    myCommand.Parameters.AddWithValue("@Price", priceDetail.Price);
                    myCommand.ExecuteNonQuery();
                }
            }
        }

        public List<PriceDetailModel> GetPriceDetails()
        {
            string query = "SELECT * FROM PriceDetail";
            DataTable table = new DataTable();
            List<PriceDetailModel> priceDetails = new List<PriceDetailModel>();

            using (SqlConnection myConn = new SqlConnection(_connectionString))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    using (SqlDataReader myReader = myCommand.ExecuteReader())
                    {
                        table.Load(myReader);
                    }
                }
            }

            foreach (DataRow row in table.Rows)
            {
                priceDetails.Add(new PriceDetailModel
                {
                    PriceDetailId = Convert.ToInt32(row["PriceDetailId"]),
                    PriceTypeId = Convert.ToInt32(row["PriceTypeId"]),
                    PriceSeasonId = Convert.ToInt32(row["PriceSeasonId"]),
                    PriceDayTypeId = Convert.ToInt32(row["PriceDayTypeId"]),
                    StartTime = TimeSpan.Parse(row["StartTime"].ToString()),
                    EndTime = TimeSpan.Parse(row["EndTime"].ToString()),
                    Price = Convert.ToDecimal(row["Price"])
                });
            }

            return priceDetails;
        }
    }
}
