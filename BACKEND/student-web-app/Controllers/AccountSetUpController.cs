using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using student_Project_Managment_System.Dto.CreateAccountSetup;
using student_Project_Managment_System.Services.Interface;

namespace student_Project_Managment_System.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountSetupController : ControllerBase
    {
        private readonly IAccountSetupTokens _accountSetup;

        public AccountSetupController(IAccountSetupTokens accountSetup)
        {
            _accountSetup = accountSetup;
        }

        [HttpPost("generate-token")]
        public async Task<IActionResult> GenerateToken(int userId)
        {
            try
            {
                Guid token = await _accountSetup.CreateAccountSetupToken(userId);

                return Ok(new
                {
                    message = "Token Generated Successfully",
                    token = token
                });
            }
            catch(Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while creating.",
                    error = ex.Message
                });
            }
        }

        [HttpGet("verify-token")]
        public async Task<IActionResult> VerifyToken([FromQuery] Guid token)
        {
            try
            {
                var result = await _accountSetup.VerifyFacultyToken(token);

                if (result == null)
                {
                    return BadRequest(new
                    {
                        message = "Invalid or Expired Token"
                    });
                }
                return Ok(result);
            }
            catch(Exception ex)
            {
                 return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while creating the task.",
                    error = ex.Message
                });
            }
            
        }

        [HttpPost("set-password")]
        public async Task<IActionResult> SetPassword(SetPasswordDto dto)
        {
            try
            {
                bool success = await _accountSetup.FacultySetPassword(dto);

                if (!success)
                {
                    return BadRequest(new
                    {
                        message = "Unable to set password"
                    });
                }

                return Ok(new
                {
                    message = "Password Set Successfully"
                });
            }
            catch(Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while creating the task.",
                    error = ex.Message
                }); 
            }
        }
    }
    }