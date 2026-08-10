using System.ComponentModel.DataAnnotations;

namespace student_Project_Managment_System.Dto.User
{
    public class SendOtpDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        public int UserId { get; set; }
    }
}
