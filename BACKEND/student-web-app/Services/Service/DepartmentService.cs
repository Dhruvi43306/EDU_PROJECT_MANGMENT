
using Microsoft.Data.SqlClient;
using Microsoft.VisualBasic;
using student_Project_Managment_System.Data;
using student_Project_Managment_System.Dto.Department;
using student_Project_Managment_System.Dto.StatusMaster;
using student_Project_Managment_System.Models;
using student_Project_Managment_System.Services.Interface;
using System.Data;

namespace student_Project_Managment_System.Services.Service
{
    public class DepartmentService : IDepartmnetService
    {
        private readonly IConfiguration _configuration;

        private readonly string _connectionString;

        public DepartmentService(IConfiguration configuration)
        {
            _configuration = configuration;
            _connectionString = _configuration.GetConnectionString("DefaultConnection");
        }
        private string GenerateDepartementCode()
        {
            Random random = new Random();
            return "DEPT" + random.Next(100000, 999999);
        }

        public async Task<List<DepartmentDto>> GetDepartment()
        {
            List<DepartmentDto> deptlist = new List<DepartmentDto>();
            try
            {
                using SqlConnection con = new SqlConnection(_connectionString);
                using SqlCommand cmd = new SqlCommand("PR_GetAllDepartment", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                await con.OpenAsync();

                using SqlDataReader reader = await cmd.ExecuteReaderAsync();
                while(await reader.ReadAsync())
                {
                    deptlist.Add(new DepartmentDto
                    {
                        DepartmentId = Convert.ToInt32(reader["DepartmentId"]),
                        DepartmentName = reader["DepartmentName"].ToString(),
                        Description = reader["Description"].ToString()
                    });
                }

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return deptlist;

        }
        public async Task<DepartmentDto> GetDepartmentId(int id)
        {
            DepartmentDto? dept = null;

            try
            {
                using SqlConnection con = new SqlConnection(_connectionString);
                using SqlCommand cmd = new SqlCommand("PR_GetDepartmentById", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.Add("@DepartmentId", SqlDbType.Int).Value = id;


                await con.OpenAsync();
                using SqlDataReader reader = await cmd.ExecuteReaderAsync();
                if(await reader.ReadAsync())
                {
                    dept = new DepartmentDto
                    {
                        DepartmentId = Convert.ToInt32(reader["DepartmentId"]),
                        DepartmentName = reader["DepartmentName"].ToString(),
                        Description = reader["Description"].ToString()

                    };
                }

            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return dept;
        }

        public async Task<DepartmentDto> AddDepartment(DepartmentDto departmentDto)
        {
            DepartmentDto? dept = null;
            try
            {
                using SqlConnection con = new SqlConnection(_connectionString);
                using SqlCommand cmd = new SqlCommand("PR_AddDepartment", con);
                string departmentcode = GenerateDepartementCode();
                cmd.CommandType = CommandType.StoredProcedure;
                    
                cmd.Parameters.Add("@DepartmentName", SqlDbType.VarChar, 50).Value = departmentDto.DepartmentName;
                cmd.Parameters.Add("@Description", SqlDbType.VarChar, 100).Value = departmentDto.Description;
                cmd.Parameters.Add("@DepartmentCode", SqlDbType.VarChar, 100).Value = departmentcode;
                await con.OpenAsync();
                using SqlDataReader reader = await cmd.ExecuteReaderAsync();
                if(await reader.ReadAsync())
                {
                    dept = new DepartmentDto
                    {
                        DepartmentId = Convert.ToInt32(reader["DepartmentId"]),
                        DepartmentName = reader["DepartmentName"].ToString(),
                        Description = reader["Description"].ToString(),
                        DepartmentCode = reader["DepartmentCode"].ToString()
                    };
                }
            }
            catch(Exception ex)
            {

                Console.WriteLine(ex.Message);

            }
            return dept;
        }

        public async Task<DepartmentDto> UpdateDepartment(DepartmentDto departmentDto, int id)
        {
            DepartmentDto? dept = null;
            try
            {
                using SqlConnection con = new SqlConnection(_connectionString);
                using SqlCommand cmd = new SqlCommand("PR_UpdateDepartment", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@DepartmentId", SqlDbType.Int).Value = id;
                cmd.Parameters.Add("DepartmentName", SqlDbType.VarChar, 50).Value = departmentDto.DepartmentName;
                cmd.Parameters.Add("@Description", SqlDbType.VarChar, 100).Value = departmentDto.Description;
                await con.OpenAsync();
                using SqlDataReader reader = await cmd.ExecuteReaderAsync();
                if(await reader.ReadAsync())
                {
                    dept = new DepartmentDto
                    {
                        DepartmentId = departmentDto.DepartmentId,
                        DepartmentName = departmentDto.DepartmentName,
                        Description = departmentDto.Description
                    };
                }
                
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return dept;
        }

        public async Task<DepartmentDto> RemoveDepartment(int id)
        {
            DepartmentDto? dept = null;

            try
            {
                using SqlConnection con = new SqlConnection(_connectionString);
                using SqlCommand cmd = new SqlCommand("PR_DeleteDepartment", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.Add("@DepartmentId", SqlDbType.Int).Value = id;
                await con.OpenAsync();
                using SqlDataReader reader = await cmd.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    dept = new DepartmentDto
                    {
                        DepartmentId = Convert.ToInt32(reader["DepartmentId"]),
                       

                    };
                }

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return dept;
        }
            
    }
}
