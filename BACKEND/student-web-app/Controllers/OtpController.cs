using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using student_Project_Managment_System.Dto.User;
using student_Project_Managment_System.Services.Interface;

namespace student_Project_Managment_System.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OtpController : ControllerBase
    {
        private readonly IotpService _otpService;

        public OtpController(IotpService otpService)
        {
            _otpService = otpService;
        }

        [HttpPost("generateOtp")]
        public async Task<IActionResult> GenerateOtpAsync(int id,string email)
        {
            try
            {
                var genrateotp = await _otpService.GenerateOtpAsync(id, email);
                return Ok(genrateotp);

            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Success = false,
                    Message = ex.Message
                });
            }
           
        }

        [HttpPost("verifyOtp")]

        public async Task<IActionResult> VerifyOtpAsync(VerifyOtpDto verifyOtpDto)
        {
            try
            {
                var verifyotp = await _otpService.VerifyOtpAsync(verifyOtpDto);
                return Ok(verifyotp);

            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Success = false,
                    Message = ex.Message
                });
            }
        }

        [HttpPost("resendOtp")]
        public async Task<IActionResult> ResendOtpAsync([FromBody] SendOtpDto sendOtpDto)
        {
            try
            {
                var resendotp = await _otpService.ResendOtpAsync(sendOtpDto.UserId,sendOtpDto.Email);
                return Ok(resendotp);

            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Success = false,
                    Message = ex.Message
                });
            }
        }
    }
}
