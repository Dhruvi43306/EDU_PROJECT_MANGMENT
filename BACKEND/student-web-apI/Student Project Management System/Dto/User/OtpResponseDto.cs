namespace student_Project_Managment_System.Dto.User
{
    public class OtpResponseDto
    {
        public bool Success { get; set; }

        public string Message { get; set; } = string.Empty;

        public int UserId { get; set; }
    }
}
