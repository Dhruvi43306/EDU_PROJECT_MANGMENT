using student_Project_Managment_System.Dto.User;

namespace student_Project_Managment_System.Services.Interface
{
    public interface IotpService
    {
        Task<OtpResponseDto> GenerateOtpAsync(int userId,string email);

        Task<OtpResponseDto> VerifyOtpAsync(VerifyOtpDto verifyOtpDto);

        Task<OtpResponseDto> ResendOtpAsync(int userId,string email);
    }
}
