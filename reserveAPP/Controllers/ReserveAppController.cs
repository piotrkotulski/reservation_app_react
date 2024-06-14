using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using reserveAPP.Models;
using reserveAPP.Services;


using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using reserveAPP.Models;
using reserveAPP.Services;

namespace reserveAPP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReserveAppController : ControllerBase
    {
        private readonly ReservationService _reservationService;
        private readonly UserService _userService;
        private readonly CourtService _courtService;

        public ReserveAppController(IConfiguration configuration)
        {
            string connectionString = configuration.GetConnectionString("reserveAppDbConn");
            _reservationService = new ReservationService(connectionString);
            _userService = new UserService(connectionString);
            _courtService = new CourtService(connectionString);
        }

        [HttpPost]
        [Route("CreateReservation")]
        public IActionResult CreateReservation([FromBody] ReservationModel reservation)
        {
            _reservationService.CreateReservation(reservation);
            return new JsonResult("Reservation Created Successfully");
        }

        [HttpPut]
        [Route("UpdateReservation/{id}")]
        public IActionResult UpdateReservation(int id, [FromBody] ReservationModel reservation)
        {
            reservation.ReservationId = id; // Przypisz ID rezerwacji z URL do modelu
            _reservationService.UpdateReservation(reservation);
            return new JsonResult("Reservation Updated Successfully");
        }

        [HttpGet]
        [Route("GetReservations")]
        public IActionResult GetReservations()
        {
            DataTable reservations = _reservationService.GetReservations();
            return new JsonResult(reservations);
        }

          [HttpDelete]
          [Route("DeleteReservation/{id}")]
                public IActionResult DeleteReservation(int id)
                {
                    _reservationService.DeleteReservation(id);
                    return new JsonResult("Reservation Deleted Successfully");
          }

        [HttpPost]
        [Route("CreateUser")]
        public IActionResult CreateUser([FromBody] UserModel user)
        {
            _userService.CreateUser(user);
            return new JsonResult("User Created Successfully");
        }

        [HttpPut]
        [Route("UpdateUser/{userId}")]
        public IActionResult UpdateUser(int userId, [FromBody] UserModel user)
        {
            _userService.UpdateUser(userId, user);
            return new JsonResult("User Updated Successfully");
        }

        [HttpGet]
        [Route("GetUsers")]
        public IActionResult GetUsers()
        {
            DataTable users = _userService.GetUsers();
            return new JsonResult(users);
        }

        [HttpGet]
        [Route("GetUser/{userId}")]
        public IActionResult GetUser(int userId)
        {
            DataTable user = _userService.GetUser(userId);
            if (user.Rows.Count > 0)
            {
                return new JsonResult(user.Rows[0]);
            }
            else
            {
                return new JsonResult("User not found");
            }
        }

        [HttpDelete]
        [Route("DeleteUser/{userId}")]
        public IActionResult DeleteUser(int userId)
        {
            _userService.DeleteUser(userId);
            return new JsonResult("User Deleted Successfully");
        }

        [HttpPost]
        [Route("AddCourt")]
        public IActionResult AddCourt([FromBody] CourtModel court)
        {
            _courtService.AddCourt(court);
            return new JsonResult("Court Added Successfully");
        }

        [HttpPut]
        [Route("UpdateCourt")]
        public IActionResult UpdateCourt([FromBody] CourtModel court)
        {
            _courtService.UpdateCourt(court);
            return new JsonResult("Court Updated Successfully");
        }

        [HttpGet]
        [Route("GetCourts")]
        public IActionResult GetCourts()
        {
            DataTable courts = _courtService.GetCourts();
            return new JsonResult(courts);
        }

        [HttpDelete]
        [Route("DeleteCourt/{id}")]
        public IActionResult DeleteCourt(int id)
        {
            _courtService.DeleteCourt(id);
            return new JsonResult("Court Deleted Successfully");
        }
    }
}
