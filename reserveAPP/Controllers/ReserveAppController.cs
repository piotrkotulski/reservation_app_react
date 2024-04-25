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


        public class UserModel
        {
            public int UserId { get; set; } 
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string Email { get; set; }
            public string PhoneNumber { get; set; }
        }

        public class CourtModel
        {
            public int CourtId { get; set; }
            public string Type { get; set; } // np. Hala, Dywan, Mączka
            public string Name { get; set; }
            public bool IsActive { get; set; }
            public bool IsFloodlit { get; set; } // Oświetlenie
            public bool IsIndoor { get; set; } // Czy to jest hala
        }

        [HttpPost]
        [Route("CreateReservation")]
        public JsonResult CreateReservation([FromBody] ReservationModel reservation)
        {
            string query = @"
        INSERT INTO dbo.Reservations (CourtId, UserId, Date, StartTime, EndTime, ClientName, PhoneNumber, Notes, MultiSportCard)
        VALUES (@CourtId, @UserId, @Date, @StartTime, @EndTime, @ClientName, @PhoneNumber, @Notes, @MultiSportCard)";

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
                    myCommand.Parameters.AddWithValue("@ClientName", reservation.ClientName);
                    myCommand.Parameters.AddWithValue("@PhoneNumber", reservation.PhoneNumber);
                    myCommand.Parameters.AddWithValue("@Notes", reservation.Notes);
                    myCommand.Parameters.AddWithValue("@MultiSportCard", reservation.MultiSportCard);
                    myCommand.ExecuteNonQuery();
                }
                myConn.Close();
            }
            return new JsonResult("Reservation Created Successfully");
        }

        [HttpPut]
        [Route("UpdateReservation")]
        public JsonResult UpdateReservation([FromBody] ReservationModel reservation)
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

            string sqlDataSource = _configration.GetConnectionString("todoAppDBCon");
            using (SqlConnection myConn = new SqlConnection(sqlDataSource))
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

                    int rowsAffected = myCommand.ExecuteNonQuery();
                    return new JsonResult($"Updated {rowsAffected} records successfully.");
                }
            }
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


        [HttpPost]
        [Route("CreateUser")]
        public JsonResult CreateUser([FromBody] UserModel user)
        {
            string query = @"
INSERT INTO dbo.Users (FirstName, LastName, Email, PhoneNumber)
VALUES (@FirstName, @LastName, @Email, @PhoneNumber)";

            string sqlDataSource = _configration.GetConnectionString("todoAppDBCon");
            using (SqlConnection myConn = new SqlConnection(sqlDataSource))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    myCommand.Parameters.AddWithValue("@FirstName", user.FirstName);
                    myCommand.Parameters.AddWithValue("@LastName", user.LastName);
                    myCommand.Parameters.AddWithValue("@Email", user.Email);
                    myCommand.Parameters.AddWithValue("@PhoneNumber", user.PhoneNumber);
                    myCommand.ExecuteNonQuery();
                }
                myConn.Close();
            }
            return new JsonResult("User Created Successfully");
        }

        [HttpGet]
        [Route("GetUsers")]
        public JsonResult GetUsers()
        {
            string query = "SELECT UserId, FirstName, LastName, Email, PhoneNumber FROM dbo.Users";
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

        [HttpPost]
        [Route("AddCourt")]
        public JsonResult AddCourt([FromBody] CourtModel court)
        {
            string query = @"
                INSERT INTO dbo.Courts (Type, Name, IsActive, IsFloodlit, IsIndoor)
                VALUES (@Type, @Name, @IsActive, @IsFloodlit, @IsIndoor)";

            string sqlDataSource = _configration.GetConnectionString("todoAppDBCon");
            using (SqlConnection myConn = new SqlConnection(sqlDataSource))
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
                myConn.Close();
            }
            return new JsonResult("Court Added Successfully");
        }


        [HttpGet]
        [Route("GetCourts")]
        public JsonResult GetCourts()
        {
            string query = "SELECT * FROM dbo.Courts";
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

        [HttpPut]
        [Route("UpdateCourt")]
        public JsonResult UpdateCourt([FromBody] CourtModel court)
        {
            string query = @"
                UPDATE dbo.Courts
                SET Type = @Type, Name = @Name, IsActive = @IsActive, IsFloodlit = @IsFloodlit, IsIndoor = @IsIndoor
                WHERE CourtId = @CourtId";

            string sqlDataSource = _configration.GetConnectionString("todoAppDBCon");
            using (SqlConnection myConn = new SqlConnection(sqlDataSource))
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
                myConn.Close();
            }
            return new JsonResult("Court Updated Successfully");
        }

        [HttpDelete]
        [Route("DeleteCourt/{id}")]
        public JsonResult DeleteCourt(int id)
        {
            string query = "DELETE FROM dbo.Courts WHERE CourtId = @CourtId";
            string sqlDataSource = _configration.GetConnectionString("todoAppDBCon");
            using (SqlConnection myConn = new SqlConnection(sqlDataSource))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    myCommand.Parameters.AddWithValue("@CourtId", id);
                    myCommand.ExecuteNonQuery();
                }
                myConn.Close();
            }
            return new JsonResult("Court Deleted Successfully");
        }

        [HttpGet]
        [Route("SearchUsers")]
        public JsonResult SearchUsers(string searchTerm)
        {
            string query = @"
                SELECT UserId, FirstName, LastName, Email, PhoneNumber 
                FROM dbo.Users 
                WHERE FirstName LIKE @SearchTerm + '%' OR LastName LIKE @SearchTerm + '%'";


            DataTable table = new DataTable();
            string sqlDataSource = _configration.GetConnectionString("todoAppDBCon");
            SqlDataReader myReader;
            using (SqlConnection myConn = new SqlConnection(sqlDataSource))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    myCommand.Parameters.AddWithValue("@SearchTerm", searchTerm);
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                }
                myConn.Close();
            }
            return new JsonResult(table);
        }


    }
}
