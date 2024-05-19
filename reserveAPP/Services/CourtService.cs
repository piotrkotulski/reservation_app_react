using System.Data;
using System.Data.SqlClient;
using reserveAPP.Models;

namespace reserveAPP.Services
{
    public class CourtService
    {
        private readonly string _connectionString;

        public CourtService(string connectionString)
        {
            _connectionString = connectionString;
        }

        public void AddCourt(CourtModel court)
        {
            string query = @"
                INSERT INTO dbo.Courts (Type, Name, IsActive, IsFloodlit, IsIndoor)
                VALUES (@Type, @Name, @IsActive, @IsFloodlit, @IsIndoor)";

            using (SqlConnection myConn = new SqlConnection(_connectionString))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    myCommand.Parameters.AddWithValue("@Type", court.Type);
                    myCommand.Parameters.AddWithValue("@Name", court.Name);
                    myCommand.Parameters.AddWithValue("@IsActive", court.IsActive);
                    myCommand.Parameters.AddWithValue("@IsFloodlit", court.IsFloodlit);
                    myCommand.Parameters.AddWithValue("@IsIndoor", court.IsIndoor);
                    myCommand.ExecuteNonQuery();
                }
            }
        }

        public void UpdateCourt(CourtModel court)
        {
            string query = @"
                UPDATE dbo.Courts
                SET Type = @Type, Name = @Name, IsActive = @IsActive, IsFloodlit = @IsFloodlit, IsIndoor = @IsIndoor
                WHERE CourtId = @CourtId";

            using (SqlConnection myConn = new SqlConnection(_connectionString))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    myCommand.Parameters.AddWithValue("@CourtId", court.CourtId);
                    myCommand.Parameters.AddWithValue("@Type", court.Type);
                    myCommand.Parameters.AddWithValue("@Name", court.Name);
                    myCommand.Parameters.AddWithValue("@IsActive", court.IsActive);
                    myCommand.Parameters.AddWithValue("@IsFloodlit", court.IsFloodlit);
                    myCommand.Parameters.AddWithValue("@IsIndoor", court.IsIndoor);
                    myCommand.ExecuteNonQuery();
                }
            }
        }

        public DataTable GetCourts()
        {
            string query = "SELECT * FROM dbo.Courts";
            DataTable table = new DataTable();

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

            return table;
        }

        public void DeleteCourt(int courtId)
        {
            string query = "DELETE FROM dbo.Courts WHERE CourtId = @CourtId";

            using (SqlConnection myConn = new SqlConnection(_connectionString))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    myCommand.Parameters.AddWithValue("@CourtId", courtId);
                    myCommand.ExecuteNonQuery();
                }
            }
        }
    }
}
