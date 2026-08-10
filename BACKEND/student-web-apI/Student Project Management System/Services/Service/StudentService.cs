using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using student_Project_Managment_System.Data;
using student_Project_Managment_System.Dto.StatusMaster;
using student_Project_Managment_System.Dto.Student;
using student_Project_Managment_System.Models;
using student_Project_Managment_System.Services.Interface;
using System.Data;

namespace student_Project_Managment_System.Services.Service
{
    public class StudentService : IStudentService
    {
        public readonly IConfiguration _configuration;
        public readonly string _connectionString;

        public StudentService(IConfiguration configuration)
        {
            _configuration = configuration;
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }
        private string GenerateStudentCode()
        {
            Random random = new Random();
            return "STU" + random.Next(100000, 999999);
        }
        public async Task<List<StudentDto>> GetStudents()
        {
            List<StudentDto> stulist = new List<StudentDto>();
            
            try
            {
                using SqlConnection con = new SqlConnection(_connectionString);
                using SqlCommand cmd = new SqlCommand("PR_GetAllStudent",con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;

                await con.OpenAsync();

                using SqlDataReader reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    stulist.Add(new StudentDto
                    {
                       StudentName = reader["StudentName"].ToString(),
                        StudentCode = GenerateStudentCode()
                       
                    });
                }
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return stulist;
        }

        public async Task<StudentDto> GetStudentById(int id)
        {
            StudentDto? stu = null;
            try
            {
                using SqlConnection con = new SqlConnection(_connectionString);
                using SqlCommand cmd = new SqlCommand("PR_GetAllStudent", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.Add("StudentId", SqlDbType.Int).Value = id;

                await con.OpenAsync();

                using SqlDataReader reader = await cmd.ExecuteReaderAsync();

                if (await reader.ReadAsync())
                {
                    stu = new StudentDto
                    {
                        StudentName = reader["StudentName"].ToString(),
                        StudentCode = GenerateStudentCode()
                     
                    };
                }
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return stu;
        }

        public async Task<StudentDto> AddStudent(StudentDto studentDto)
        {
            StudentDto? stu = null;
            string stucode = GenerateStudentCode();
            try
            {
                using SqlConnection con = new SqlConnection(_connectionString);
                using SqlCommand cmd = new SqlCommand(" PR_AddStudent", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
              
                cmd.Parameters.Add("studentCode", SqlDbType.VarChar, 50).Value = stucode;
                cmd.Parameters.Add("SudentName", SqlDbType.VarChar, 50).Value = studentDto.StudentName;


                await con.OpenAsync();

                using SqlDataReader reader = await cmd.ExecuteReaderAsync();

                if (await reader.ReadAsync())
                {
                    stu = new StudentDto
                    {
                        StudentName = reader["StudentName"].ToString(), 
                        StudentCode = GenerateStudentCode()
                      

                    };
                }
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return stu;
        }

      
       
    }
}
