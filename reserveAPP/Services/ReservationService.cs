using System.Data;
using System.Data.SqlClient;
using reserveAPP.Models;

namespace reserveAPP.Services
{
    public class ReservationService
    {
        private readonly string _connectionString;

        public ReservationService(string connectionString)
        {
            _connectionString = connectionString;
        }

        public void CreateReservation(ReservationModel reservation)
        {
            string query = @"
                INSERT INTO dbo.Reservations (CourtId, UserId, Date, StartTime, EndTime, ClientName, PhoneNumber, Notes, MultiSportCard)
                VALUES (@CourtId, @UserId, @Date, @StartTime, @EndTime, @ClientName, @PhoneNumber, @Notes, @MultiSportCard)";

            using (SqlConnection myConn = new SqlConnection(_connectionString))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    myCommand.Parameters.AddWithValue("@CourtId", reservation.CourtId);
                    myCommand.Parameters.AddWithValue("@UserId", reservation.UserId);
                    myCommand.Parameters.AddWithValue("@Date", reservation.Date.Date);
                    myCommand.Parameters.AddWithValue("@StartTime", reservation.StartTime);
                    myCommand.Parameters.AddWithValue("@EndTime", reservation.EndTime);
                    myCommand.Parameters.AddWithValue("@ClientName", reservation.ClientName);
                    myCommand.Parameters.AddWithValue("@PhoneNumber", reservation.PhoneNumber);
                    myCommand.Parameters.AddWithValue("@Notes", reservation.Notes);
                    myCommand.Parameters.AddWithValue("@MultiSportCard", reservation.MultiSportCard);
                    myCommand.ExecuteNonQuery();
                }
            }
        }

        public void UpdateReservation(ReservationModel reservation)
        {
            string query = @"
                UPDATE dbo.Reservations
                SET CourtId = @CourtId, 
                    UserId = @UserId, 
                    Date = @Date, 
                    StartTime = @StartTime, 
                    EndTime = @EndTime, 
                    ClientName = @ClientName, 
                    PhoneNumber = @PhoneNumber, 
                    Notes = @Notes, 
                    MultiSportCard = @MultiSportCard
                WHERE ReservationId = @ReservationId";

            using (SqlConnection myConn = new SqlConnection(_connectionString))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    myCommand.Parameters.AddWithValue("@ReservationId", reservation.ReservationId);
                    myCommand.Parameters.AddWithValue("@CourtId", reservation.CourtId);
                    myCommand.Parameters.AddWithValue("@UserId", reservation.UserId);
                    myCommand.Parameters.AddWithValue("@Date", reservation.Date.Date);
                    myCommand.Parameters.AddWithValue("@StartTime", reservation.StartTime);
                    myCommand.Parameters.AddWithValue("@EndTime", reservation.EndTime);
                    myCommand.Parameters.AddWithValue("@ClientName", reservation.ClientName);
                    myCommand.Parameters.AddWithValue("@PhoneNumber", reservation.PhoneNumber);
                    myCommand.Parameters.AddWithValue("@Notes", reservation.Notes);
                    myCommand.Parameters.AddWithValue("@MultiSportCard", reservation.MultiSportCard);

                    myCommand.ExecuteNonQuery();
                }
            }
        }

        public void DeleteReservation(int reservationId)
                {
                    string query = "DELETE FROM dbo.Reservations WHERE ReservationId = @ReservationId";

                    using (SqlConnection myConn = new SqlConnection(_connectionString))
                    {
                        myConn.Open();
                        using (SqlCommand myCommand = new SqlCommand(query, myConn))
                        {
                            myCommand.Parameters.AddWithValue("@ReservationId", reservationId);
                            myCommand.ExecuteNonQuery();
                        }
                    }
                }

        public DataTable GetReservations()
        {
            string query = "SELECT * FROM dbo.Reservations";
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
    }
}
