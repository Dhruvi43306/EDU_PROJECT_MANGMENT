using student_Project_Managment_System.Dto.CreateAccountSetup;
using student_Project_Managment_System.Models;

namespace student_Project_Managment_System.Services.Interface
{
    public interface IAccountSetupTokens
    {
        Task<Guid> CreateAccountSetupToken(int UserId);
        Task<VerifyAccountSetupResponseDto> VerifyFacultyToken(Guid token);
        Task<bool> FacultySetPassword(SetPasswordDto setPasswordDto);
    }
}
