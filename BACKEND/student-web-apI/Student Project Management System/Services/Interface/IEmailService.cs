namespace student_Project_Managment_System.Services.Interface
{
    public interface IEmailService
    {
        Task SendOtpEmailAsync(string email, string otp);

        Task SendEmailAsync(string to, string subject, string body);
    }
}