using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using student_Project_Managment_System.Data;
using student_Project_Managment_System.Dto.AddFacultyDto;
using student_Project_Managment_System.Dto.User;
using student_Project_Managment_System.Models;
using student_Project_Managment_System.Services.Interface;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;


namespace student_Project_Managment_System.Services.Service
{
    public class UserService : IUserService
    {
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;
        private readonly IotpService _otpService;
        private readonly IEmailService _emailService;
        private readonly IAccountSetupTokens _accountSetupTokens;


        public UserService(IConfiguration configuration,IotpService otpService,IEmailService emailService,IAccountSetupTokens accountSetupTokens)
        {
            _configuration = configuration;
            _connectionString = _configuration.GetConnectionString("DefaultConnection");
            _otpService = otpService;
            _emailService = emailService;
            _accountSetupTokens = accountSetupTokens;
        }
        private string GenerateJwtToken(int userId, string email, string role)
        {
            var claims = new[]
            {
        new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
        new Claim(ClaimTypes.Email, email),
        new Claim(ClaimTypes.Role, role)
    };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));

            var credentials = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        private string GenerateUserCode()
        {
            Random random = new Random();
            return "USR" + random.Next(100000, 999999);
        }
        public async Task<RegisterResponseDto> RegisterAsync(RegisterDto registerDto)
        {
            RegisterResponseDto response = new RegisterResponseDto();
            string userCode = GenerateUserCode();
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);


            try
            {
                using SqlConnection con = new SqlConnection(_connectionString);
                using SqlCommand cmd = new SqlCommand("PR_RegisterUsers", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@FullName", SqlDbType.VarChar, 100).Value = registerDto.FullName;
                cmd.Parameters.Add("@UserName", SqlDbType.VarChar, 50).Value = registerDto.UserName;
                cmd.Parameters.Add("@Email", SqlDbType.VarChar, 100).Value = registerDto.Email;
                cmd.Parameters.Add("@Phone", SqlDbType.VarChar).Value = registerDto.Phone;
                cmd.Parameters.Add("@Password", SqlDbType.NVarChar, 250).Value = hashedPassword;
                cmd.Parameters.Add("@Gender", SqlDbType.VarChar, 10).Value = registerDto.Gender;
                cmd.Parameters.Add("@UserCode", SqlDbType.VarChar, 20).Value = userCode;
                cmd.Parameters.Add("@RoleId", SqlDbType.Int).Value = registerDto.RoleId;
              


                await con.OpenAsync();

                using SqlDataReader reader = await cmd.ExecuteReaderAsync();
                if(await reader.ReadAsync())
                {
                    response.Success = true;
                    response.UserId = Convert.ToInt32(reader["UserId"]);

                    await _otpService.GenerateOtpAsync(response.UserId,registerDto.Email);
                    response.Message = "OTP sent to your email!";
                }
                else
                {
                    response.Success = false;
                    response.Message = "Registration failed!";
                }
            }
            catch(SqlException ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            catch(Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public async Task<LoginResponseDto> LoginAsync(LoginDto loginDto)
        {
            LoginResponseDto response = new LoginResponseDto();

            try
            {
                using SqlConnection con = new SqlConnection(_connectionString);
                using SqlCommand cmd = new SqlCommand("PR_LoginUser", con);

                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Email", loginDto.Email);

                await con.OpenAsync();

                using SqlDataReader reader = await cmd.ExecuteReaderAsync();

                if (!await reader.ReadAsync())
                {
                    response.Success = false;
                    response.Message = "Email not found.";
                    return response;
                }

                string hashedPassword = reader["Password"].ToString()!;
                Console.WriteLine("Entered Password : " + loginDto.Password);
                Console.WriteLine("Hash From DB     : " + hashedPassword);
                //string hash = BCrypt.Net.BCrypt.HashPassword("Dhruvi@2024");
                //Console.WriteLine(BCrypt.Net.BCrypt.Verify("Dhruvi@2024", hash));
                bool validPassword = BCrypt.Net.BCrypt.Verify(
                    loginDto.Password,
                    hashedPassword
                );

                if (!validPassword)
                {
                    response.Success = false;
                    response.Message = "Invalid password.";
                    return response;
                }

                Console.WriteLine("Verify Result : " + validPassword);

                response.Success = true;
                response.Message = "Login Successful";
                response.Token = GenerateJwtToken(
                Convert.ToInt32(reader["UserId"]),
                reader["Email"].ToString()!,
                reader["RoleName"].ToString()!);
                response.User = new UsersDto
                {
                    UserId = Convert.ToInt32(reader["UserId"]),
                    FullName = reader["FullName"].ToString()!,
                    UserName = reader["UserName"].ToString()!,
                    Email = reader["Email"].ToString()!,
                    RoleId = Convert.ToInt32(reader["RoleId"])
                };

                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                return response;
            }
        }

        public async Task<AddFacultyDto> AddFaculty(AddFacultyDto addFacultyDto)
        {
            AddFacultyDto? users = null;

            string userCode = GenerateUserCode();

            try
            {
                using SqlConnection con = new SqlConnection(_connectionString);

                using SqlCommand cmd = new SqlCommand("PR_AddFaculty", con);

                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@UserCode", SqlDbType.VarChar, 20).Value = userCode;
                cmd.Parameters.Add("@FullName", SqlDbType.VarChar, 100).Value = addFacultyDto.FullName;
                cmd.Parameters.Add("@Email", SqlDbType.VarChar, 100).Value = addFacultyDto.Email;
                cmd.Parameters.Add("@Gender", SqlDbType.VarChar, 20).Value = addFacultyDto.Gender;
                cmd.Parameters.Add("@RoleId", SqlDbType.Int).Value = addFacultyDto.RoleId;   
                cmd.Parameters.Add("@Age", SqlDbType.Int).Value = addFacultyDto.Age;
                cmd.Parameters.Add("@CreatedBy", SqlDbType.Int).Value = addFacultyDto.CreatedBy;
                cmd.Parameters.Add("@DepartmentId", SqlDbType.Int).Value = addFacultyDto.DepartmentId;
                await con.OpenAsync();

                using SqlDataReader reader = await cmd.ExecuteReaderAsync();

                if (await reader.ReadAsync())
                {
                    users = new AddFacultyDto
                    {
                        
                        UserId = Convert.ToInt32(reader["UserId"]),
                        UserCode = reader["UserCode"].ToString(),
                        FullName = reader["FullName"].ToString(),
                        Email = reader["Email"].ToString(),
                        Gender = reader["Gender"].ToString(),
                        RoleId = Convert.ToInt32(reader["RoleId"]),
                        Age = Convert.ToInt32(reader["Age"]),
                        DepartmentId = Convert.ToInt32(reader["DepartmentId"])
                    };
                }
                Console.WriteLine("DepartmentId = " + addFacultyDto.DepartmentId);

                if (users == null)
                {
                    throw new Exception("Faculty was not inserted.");
                }

                // Create setup token
                Guid token = await _accountSetupTokens.CreateAccountSetupToken(users.UserId);
                Console.WriteLine("FrontendUrl = " + _configuration["FrontendUrl"]);
               

                string setupLink = $"http://localhost:3000/auth/setup-account?token={token}";
                Console.WriteLine("SetupLink = " + setupLink);

                string body = $@"
            <h2>Welcome to Student Project Management System</h2>

            <p>Hello <b>{users.FullName}</b>,</p>

            <p>Your Faculty account has been created successfully.</p>

            <p>Your User Code is:
                <b>{users.UserCode}</b>
            </p>

            <p>Please click the link below to create your password.</p> 

            <a href='{setupLink}'>Set Password</a>

            <br/><br/>

            <p>This link will expire in 24 hours.</p>

            <p>Thank You.</p>";


                await _emailService.SendEmailAsync(
                    users.Email,
                    "Faculty Account Setup",
                    body);
                Console.WriteLine("Faculty Email : " + users.Email);
                Console.WriteLine("Setup Link : " + setupLink);
                Console.WriteLine("Calling SendEmailAsync...");
                Console.WriteLine(setupLink);
                return users;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<List<getFacultyDto>> GetAllUsers()
        {
            List<getFacultyDto> users = new List<getFacultyDto>();

            try
            {
                using SqlConnection con = new SqlConnection(_connectionString);

                using SqlCommand cmd = new SqlCommand("PR_GetAllUser", con);

                cmd.CommandType = CommandType.StoredProcedure;

                await con.OpenAsync();

                using SqlDataReader reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    users.Add(new getFacultyDto
                    {
                        UserId = Convert.ToInt32(reader["UserId"]),

                        FullName = reader["FullName"]?.ToString() ?? "",

                        RoleId = Convert.ToInt32(reader["RoleId"]),

                        RoleName = reader["RoleName"]?.ToString() ?? ""
                    });
                }
            }
            catch (Exception)
            {
                throw;
            }

            return users;
        }



        public async Task<UsersDto?> GetUserProfile(int userId)
        {
            UsersDto? userProfile = null;

            using SqlConnection con = new SqlConnection(_connectionString);

            using SqlCommand cmd = new SqlCommand(
                "PR_GetUserProfile",
                con
            );

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.Add("@UserId", SqlDbType.Int).Value = userId;

            await con.OpenAsync();

            using SqlDataReader reader = await cmd.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                userProfile = new UsersDto
                {
                    UserId = Convert.ToInt32(reader["UserId"]),

                    UserName = reader["UserName"]?.ToString() ?? "",

                    FullName = reader["FullName"]?.ToString() ?? "",

                    Email = reader["Email"]?.ToString() ?? "",

                    Phone = reader["Phone"]?.ToString() ?? "",

                    Gender = reader["Gender"]?.ToString() ?? "",

                    Age = reader["Age"] == DBNull.Value? 18: Convert.ToInt32(reader["Age"]),

                    ProfilePhoto = reader["ProfilePhoto"]?.ToString() ?? "",

                    RoleId = Convert.ToInt32(reader["RoleId"]),

                    RoleName = reader["RoleName"]?.ToString() ?? "",

            

                    CreatedAt = reader["CreatedAt"] == DBNull.Value
                        ? null
                        : Convert.ToDateTime(reader["CreatedAt"]),

                    UpdatedAt = reader["UpdatedAt"] == DBNull.Value
                        ? null
                        : Convert.ToDateTime(reader["UpdatedAt"]),

                };
            }

            return userProfile;
        }

    }
}
