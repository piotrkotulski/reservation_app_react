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
        private readonly PriceService _priceService;
        private readonly TrainerService _TrainerService;


        public ReserveAppController(IConfiguration configuration)
        {
            string connectionString = configuration.GetConnectionString("reserveAppDbConn");
            _reservationService = new ReservationService(connectionString);
            _userService = new UserService(connectionString);
            _courtService = new CourtService(connectionString);
            _priceService = new PriceService(connectionString);
            _TrainerService = new TrainerService(connectionString);

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

        [HttpPost]
        [Route("CreatePriceType")]
        public IActionResult CreatePriceType([FromBody] PriceTypeModel priceType)
        {
            try
            {
                _priceService.CreatePriceType(priceType);
                return Ok(new { message = "Price Type Created Successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet]
        [Route("GetPriceTypes")]
        public IActionResult GetPriceTypes()
        {
            try
            {
                List<PriceTypeModel> priceTypes = _priceService.GetPriceTypes();
                return Ok(priceTypes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost]
        [Route("CreatePriceSeason")]
        public IActionResult CreatePriceSeason([FromBody] PriceSeasonModel priceSeason)
        {
            try
            {
                _priceService.CreatePriceSeason(priceSeason);
                return Ok(new { message = "Price Season Created Successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet]
        [Route("GetPriceSeasons")]
        public IActionResult GetPriceSeasons()
        {
            try
            {
                List<PriceSeasonModel> priceSeasons = _priceService.GetPriceSeasons();
                return Ok(priceSeasons);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost]
        [Route("CreatePriceDayType")]
        public IActionResult CreatePriceDayType([FromBody] PriceDayTypeModel priceDayType)
        {
            try
            {
                _priceService.CreatePriceDayType(priceDayType);
                return Ok(new { message = "Price Day Type Created Successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet]
        [Route("GetPriceDayTypes")]
        public IActionResult GetPriceDayTypes()
        {
            try
            {
                List<PriceDayTypeModel> priceDayTypes = _priceService.GetPriceDayTypes();
                return Ok(priceDayTypes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost]
        [Route("CreatePriceDetail")]
        public IActionResult CreatePriceDetail([FromBody] PriceDetailModel priceDetail)
        {
            try
            {
                _priceService.CreatePriceDetail(priceDetail);
                return Ok(new { message = "Price Detail Created Successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet]
        [Route("GetPriceDetails")]
        public IActionResult GetPriceDetails()
        {
            try
            {
                List<PriceDetailModel> priceDetails = _priceService.GetPriceDetails();
                return Ok(priceDetails);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
        
        [HttpDelete]
        [Route("DeletePriceDetail/{id}")]
        public IActionResult DeletePriceDetail(int id)
        {
            try
            {
                _priceService.DeletePriceDetail(id);
                return Ok(new { message = "Price Detail Deleted Successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpDelete]
        [Route("DeletePriceType/{id}")]
        public IActionResult DeletePriceType(int id)
        {
            try
            {
                _priceService.DeletePriceType(id);
                return Ok(new { message = "Price Type Deleted Successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpDelete]
        [Route("DeletePriceSeason/{id}")]
        public IActionResult DeletePriceSeason(int id)
        {
            try
            {
                _priceService.DeletePriceSeason(id);
                return Ok(new { message = "Price Season Deleted Successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpDelete]
        [Route("DeletePriceDayType/{id}")]
        public IActionResult DeletePriceDayType(int id)
        {
            try
            {
                _priceService.DeletePriceDayType(id);
                return Ok(new { message = "Price Day Type Deleted Successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
        [HttpGet]
        [Route("GetAllTrainers")]
        public ActionResult<IEnumerable<Trainer>> GetAllTrainers()
        {
            return Ok(_TrainerService.GetAllTrainers());
        }


        [HttpPost]
        [Route("AddTrainer")]
        public ActionResult AddTrainer([FromBody] Trainer trainer)
        {
            _TrainerService.AddTrainer(trainer);
            return Ok(trainer); // Zwrot obiektu trenera jako potwierdzenie
        }



        [HttpPut("{id}")]
        public ActionResult UpdateTrainer(int id, [FromBody] Trainer Trainer)
        {
            Trainer.ID = id;
            _TrainerService.UpdateTrainer(Trainer);
            return Ok();
        }

        [HttpDelete("{id}")]
        public ActionResult DeleteTrainer(int id)
        {
            _TrainerService.DeleteTrainer(id);
            return Ok();
        }

        [HttpGet]
        [Route("GetTrainer/{id}")]
        public IActionResult GetTrainer(int id)
        {
            var trainer = _TrainerService.GetTrainer(id);
            if (trainer != null)
            {
                return Ok(trainer);
            }
            else
            {
                return NotFound("Trainer not found");
            }
        }
    }
}
