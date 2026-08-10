using student_Project_Managment_System.Dto.AddFacultyDto;
using student_Project_Managment_System.Dto.User;
using student_Project_Managment_System.Models;

namespace student_Project_Managment_System.Services.Interface
{
    public interface IUserService
    {
        Task<RegisterResponseDto> RegisterAsync(RegisterDto registerDto);

        Task<LoginResponseDto> LoginAsync(LoginDto loginDto);

        Task<AddFacultyDto> AddFaculty(AddFacultyDto addFacultyDto);

        Task<List<getFacultyDto>> GetAllUsers();

        Task<UsersDto> GetUserProfile(int UserId);
    }
}
