using System.ComponentModel.DataAnnotations;

namespace student_Project_Managment_System.Dto.User
{
    public class VerifyOtpDto
    {
        //[Required]
        //[EmailAddress]
        //public string? Email { get; set; } = string.Empty;

        

        public int UserId { get; set; }

        [Required]
        [StringLength(6, MinimumLength = 6)]
        public string OtpCode { get; set; } = string.Empty;
    }
}
