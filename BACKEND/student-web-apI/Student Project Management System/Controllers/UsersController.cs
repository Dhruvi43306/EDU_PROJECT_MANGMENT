using Microsoft.AspNetCore.Mvc;
using student_Project_Managment_System.Dto.AddFacultyDto;
using student_Project_Managment_System.Dto.User;
using student_Project_Managment_System.Models;
using student_Project_Managment_System.Services.Interface;

namespace student_Project_Managment_System.Controllers
{
    [ApiController]
    [Route("/api/[Controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

            [HttpPost("register")]
            
            public async Task<IActionResult> RegisterAsync([FromBody] RegisterDto registerDto)
            {
                var result = await _userService.RegisterAsync(registerDto);

                if (!result.Success)
                {
                    return BadRequest(result);
                }

                return Ok(result);
            }

        [HttpPost("login")]
        public async Task<IActionResult> LoginAsync([FromBody] LoginDto loginDto)
        {
            var response = await _userService.LoginAsync(loginDto);

            if (!response.Success)
            {
                return Unauthorized(response);
            }

            return Ok(response);
        }

        [HttpPost("AddFaculty")]
        public async Task<IActionResult> AddFaculty([FromBody] AddFacultyDto addFacultyDto)
        {
            try
            {
                var users = await _userService.AddFaculty(addFacultyDto);

                return Ok(users);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }

        public async Task<ActionResult> GetAllUsers()
        {
            try
            {
                var users = await _userService.GetAllUsers();

                return Ok(users);
            }
            catch(Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }
        [HttpGet("GetUserProfile/{userId}")]
        public async Task<IActionResult> GetUserProfile(int userId)
        {
            try
            {
                var userProfile = await _userService.GetUserProfile(userId);

                if (userProfile == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "User profile not found."
                    });
                }

                return Ok(new
                {
                    success = true,
                    data = userProfile
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Failed to fetch user profile.",
                    error = ex.Message
                });
            }
        }
    }
}



