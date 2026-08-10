using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using student_Project_Managment_System.Configuration;
using student_Project_Managment_System.Services.Interface;

namespace student_Project_Managment_System.Services.Service
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _settings;
        private readonly IConfiguration _configuration; 

        public EmailService(IOptions<EmailSettings> settings,IConfiguration configuration)
        {
            _settings = settings.Value;
            _configuration = configuration;

        }

        public async Task SendOtpEmailAsync(string email, string otp)
        {
            
            try
            {
                var message = new MimeMessage();
                    message.From.Add(new MailboxAddress(
                        _settings.SenderName,
                        _settings.SenderEmail));
                    message.To.Add(MailboxAddress.Parse(email));
                message.Subject = "Email Verification OTP";
                message.Body = new TextPart("html")
                {
                    Text = $@"
                <h2>Email Verification</h2>
                <h1>{otp}</h1>"
                };
                using var smtp = new SmtpClient();
                await smtp.ConnectAsync(
                    _settings.SmtpServer,
                    _settings.Port,
                    SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync(
                    _settings.SenderEmail,
                    _settings.Password);

                await smtp.SendAsync(message);

                await smtp.DisconnectAsync(true);
         
                Console.WriteLine(email);
                Console.WriteLine(otp);

                Console.WriteLine("Email Sent Successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine("EMAIL ERROR:");
                Console.WriteLine(ex.ToString());
                throw;
            }
        }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            try
            {
                var message = new MimeMessage();

                message.From.Add(new MailboxAddress(
                    _settings.SenderName,
                    _settings.SenderEmail));

                message.To.Add(MailboxAddress.Parse(to));

                message.Subject = subject;

                message.Body = new TextPart("html")
                {
                    Text = body
                };

                using var smtp = new SmtpClient();

                await smtp.ConnectAsync(
                    _settings.SmtpServer,
                    _settings.Port,
                    SecureSocketOptions.StartTls);

                await smtp.AuthenticateAsync(
                    _settings.SenderEmail,
                    _settings.Password);

                await smtp.SendAsync(message);
                Console.WriteLine("========== EMAIL SERVICE ==========");
                Console.WriteLine("To      : " + to);
                Console.WriteLine("Subject : " + subject);
                Console.WriteLine("===================================");

                await smtp.DisconnectAsync(true);
            }
            catch (Exception ex)
            {
                Console.WriteLine("EMAIL ERROR");
                Console.WriteLine(ex.ToString());
                throw;
            }
        }
    }
}