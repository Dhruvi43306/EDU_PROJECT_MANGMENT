using student_Project_Managment_System.Models;

namespace student_Project_Managment_System.Dto.User
{
    public class LoginResponseDto
    {
        public bool Success { get; set; }

        public string Message { get; set; }

        public string Token { get; set; }

        public UsersDto User { get; set; } = new UsersDto();
    }
}
