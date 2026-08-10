using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using student_Project_Managment_System.Dto.User;
using student_Project_Managment_System.Services.Interface;
using System.Data;

namespace student_Project_Managment_System.Services.Service
{
    public class OtpService : IotpService
    {
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;
        private readonly IEmailService _emailService;

        public OtpService(IConfiguration configuration,IEmailService emailService)
        {
            _configuration = configuration;
            _connectionString = _configuration.GetConnectionString("DefaultConnection")!;
            _emailService = emailService;
        }

        private string GenrateOtp()
        {
            Random random = new Random();
            return random.Next(100000, 999999).ToString();
        }

        public async Task<OtpResponseDto> GenerateOtpAsync(int userId,string email)
        {
            OtpResponseDto response = new OtpResponseDto();
            Console.WriteLine("GenerateOtpAsync Called");
            Console.WriteLine(userId);
            Console.WriteLine(email);
            try
            {
               

                string otpCode = GenrateOtp();
                Console.WriteLine("OTP : " + otpCode);
                //string hashedOtp = BCrypt.Net.BCrypt.HashPassword(otpCode);
                using SqlConnection con = new SqlConnection(_connectionString);
                using SqlCommand cmd = new SqlCommand("PR_SaveOtp", con);

                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@UserId", SqlDbType.Int).Value = userId;
                cmd.Parameters.Add("OtpCode", SqlDbType.NVarChar).Value = otpCode;

                    
                

                //bool valid = BCrypt.Net.BCrypt.Verify(otpCode);

                await con.OpenAsync();

                using SqlDataReader reader = await cmd.ExecuteReaderAsync();
                Console.WriteLine("Procedure Executed");

                if (await reader.ReadAsync())
                {
                    Console.WriteLine("Reader Read");

                    response.Success = Convert.ToBoolean(reader["Success"]);
                    response.Message = reader["Message"].ToString()!;
                    Console.WriteLine(response.Success);
                    Console.WriteLine(response.Message);

                }
                if (response.Success)
                {
                    Console.WriteLine(email);
                    Console.WriteLine(otpCode);
                    Console.WriteLine("Before Send Email");
                    await _emailService.SendOtpEmailAsync(email, otpCode);
                    Console.WriteLine("After Send Email");
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }

            return response;
        }

        public async Task<OtpResponseDto> VerifyOtpAsync([FromBody] VerifyOtpDto verifyOtpDto)
        {
            OtpResponseDto response = new OtpResponseDto();

            try
            {
                using SqlConnection con = new SqlConnection(_connectionString);
                using SqlCommand cmd = new SqlCommand("PR_VerifyOtp", con);

                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@UserId", SqlDbType.Int).Value = verifyOtpDto.UserId;
                cmd.Parameters.Add("@OtpCode", SqlDbType.VarChar, 6).Value = verifyOtpDto.OtpCode;

                await con.OpenAsync();

                using SqlDataReader reader = await cmd.ExecuteReaderAsync();

                if (await reader.ReadAsync())
                {
                    response.Success = Convert.ToBoolean(reader["Success"]);
                    response.Message = reader["Message"].ToString()!;
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }

            return response;
        }

        public async Task<OtpResponseDto> ResendOtpAsync(int userId,string email)
        {
            OtpResponseDto response = new OtpResponseDto();

            try
            {
                string otpCode = GenrateOtp();
                using SqlConnection con = new SqlConnection(_connectionString);
                using SqlCommand cmd = new SqlCommand("PR_ResendOtp", con);

                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@UserId", SqlDbType.Int).Value = userId;
                cmd.Parameters.Add("@OtpCode", SqlDbType.VarChar,100).Value = otpCode;

                await con.OpenAsync();

                using SqlDataReader reader = await cmd.ExecuteReaderAsync();

                if (await reader.ReadAsync())
                {
                    response.Success = Convert.ToBoolean(reader["Success"]);
                    response.Message = reader["Message"].ToString()!;
                }
                await _emailService.SendOtpEmailAsync(email, otpCode);
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }

            return response;
        }
    }
}