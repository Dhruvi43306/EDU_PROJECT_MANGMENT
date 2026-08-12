using Microsoft.Data.SqlClient;
using student_Project_Managment_System.Dto.CreateAccountSetup;
using student_Project_Managment_System.Services.Interface;
using System.Data;

namespace student_Project_Managment_System.Services.Service
{
    public class AccountSetupTokens : IAccountSetupTokens
    {
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;

        public AccountSetupTokens(IConfiguration configuration)
        {
            _configuration = configuration;
            _connectionString = _configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<Guid> CreateAccountSetupToken(int userId)
        {
            Guid token = Guid.NewGuid();

            using SqlConnection con = new SqlConnection(_connectionString);

            using SqlCommand cmd = new SqlCommand("PR_CreateAccountSetupToken", con);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@UserId", userId);
            cmd.Parameters.AddWithValue("@Token", token);

            await con.OpenAsync();
            await cmd.ExecuteNonQueryAsync();

            return token;
        }

        public async Task<VerifyAccountSetupResponseDto?> VerifyFacultyToken(Guid token)
        {
            Console.WriteLine($"Token Received: {token}");
            VerifyAccountSetupResponseDto? response = null;

            using SqlConnection con = new SqlConnection(_connectionString);

            using SqlCommand cmd = new SqlCommand("PR_VerifyAccountSetupToken", con);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@Token", token);

            await con.OpenAsync();

            using SqlDataReader reader = await cmd.ExecuteReaderAsync();
            Console.WriteLine("Has Rows: " + reader.HasRows);

            if (await reader.ReadAsync())
            {
                Console.WriteLine("Reader Read Successfully");
                response = new VerifyAccountSetupResponseDto
                {
                    FullName = reader["FullName"].ToString(),
                    Email = reader["Email"].ToString(),
                    Gender = reader["Gender"].ToString()
                };
                Console.WriteLine(response.FullName);
            }
            else
            {

                Console.WriteLine("No rows returned");

            }

            return response;
        }

        public async Task<bool> FacultySetPassword(SetPasswordDto dto)
        {
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            using SqlConnection con = new SqlConnection(_connectionString);

            using SqlCommand cmd = new SqlCommand("PR_SetPassword", con);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@Token", dto.Token);
            cmd.Parameters.AddWithValue("@PasswordHash", passwordHash);

            await con.OpenAsync();

            int rows = await cmd.ExecuteNonQueryAsync();

            return rows > 0;
        }
    }
}