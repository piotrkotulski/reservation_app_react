using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using System.Data.SqlTypes;

namespace todoAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReserveAppController : ControllerBase
    {
        private IConfiguration _configration;

        public ReserveAppController(IConfiguration configuration)
        {
            _configration = configuration;
        }

        public class ReservationModel
        {
            public int CourtId { get; set; }
            public int UserId { get; set; }
            public DateTime Date { get; set; }
            public TimeSpan StartTime { get; set; }
            public TimeSpan EndTime { get; set; }
        }

        [HttpPost]
        [Route("CreateReservation")]
        public JsonResult CreateReservation([FromBody] ReservationModel reservation)
        {
            string query = @"
    INSERT INTO dbo.Reservations (CourtId, UserId, Date, StartTime, EndTime)
    VALUES (@CourtId, @UserId, @Date, @StartTime, @EndTime)";

            string sqlDataSource = _configration.GetConnectionString("todoAppDBCon");
            using (SqlConnection myConn = new SqlConnection(sqlDataSource))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    myCommand.Parameters.AddWithValue("@CourtId", reservation.CourtId);
                    myCommand.Parameters.AddWithValue("@UserId", reservation.UserId);
                    myCommand.Parameters.AddWithValue("@Date", reservation.Date.Date);
                    myCommand.Parameters.AddWithValue("@StartTime", reservation.StartTime);
                    myCommand.Parameters.AddWithValue("@EndTime", reservation.EndTime);
                    myCommand.ExecuteNonQuery();
                }
                myConn.Close();
            }
            return new JsonResult("Reservation Created Successfully");
        }


        [HttpGet]
        [Route("GetReservations")]
        public JsonResult GetReservations()
        {
            string query = "SELECT * FROM dbo.Reservations";
            DataTable table = new DataTable();
            string sqlDataSource = _configration.GetConnectionString("todoAppDBCon");
            SqlDataReader myReader;
            using (SqlConnection myConn = new SqlConnection(sqlDataSource))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myConn.Close();
                }
            }
            return new JsonResult(table);
        }

        


       
    }
}
