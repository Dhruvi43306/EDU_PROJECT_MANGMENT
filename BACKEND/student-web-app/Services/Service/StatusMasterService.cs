using Microsoft.Data.SqlClient;
using Microsoft.Data.SqlClient.Server;
using student_Project_Managment_System.Data;
using student_Project_Managment_System.Dto.StatusMaster;
using student_Project_Managment_System.Models;
using student_Project_Managment_System.Services.Interface;
using System.Data;

namespace student_Project_Managment_System.Services.Service
{
    public class StatusMasterService : IStatusMasterService
    {
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;

        public StatusMasterService(IConfiguration configuration)
        {
            _configuration = configuration;
            _connectionString = _configuration.GetConnectionString("DefaultConnection");
        }


        public async Task<List<StatusMasterDto>> GetAllStatusMaster()
        {
            StatusMasterDto? status = null;
            List<StatusMasterDto> list = new List<StatusMasterDto>();
            try
            {
                using SqlConnection con = new SqlConnection(_connectionString);
                using SqlCommand cmd = new SqlCommand("PR_GetAllStatus", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;

                await con.OpenAsync();

                using SqlDataReader reader = await cmd.ExecuteReaderAsync();

                while(await reader.ReadAsync())
                {
                   

                    list.Add(new StatusMasterDto
                    {
                        StatusId = Convert.ToInt32(reader["StatusId"]),
                        StatusName = reader["StatusName"].ToString(),
                        StatusCategory = reader["StatusCategory"].ToString(),
                        Description = reader["Description"].ToString(),
                    });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return list;
        }

        public async Task<StatusMasterDto> GetStatusMasterById(int id)
        {
            StatusMasterDto? status = null;
            try
            {
                using SqlConnection con = new SqlConnection(_connectionString);
                using SqlCommand cmd = new SqlCommand("PR_GetStatusById", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.Add("@StatusId", SqlDbType.Int).Value = id;

                await con.OpenAsync();

                using SqlDataReader reader = await cmd.ExecuteReaderAsync();
                if(await reader.ReadAsync())
                {
                    status = new StatusMasterDto
                    {
                        StatusId = Convert.ToInt32(reader["StatusId"]),
                        StatusName = reader["StatusName"].ToString(),
                        StatusCategory = reader["StatusCategory"].ToString(),
                        Description = reader["Description"].ToString(),

                    };
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            return status;

        }

        public async Task<StatusMasterDto> AddStatusMaster(StatusMasterDto statusMasterdto)
        {
            StatusMasterDto? status = null;

            try
            {
                using SqlConnection con = new SqlConnection(_connectionString);
                using SqlCommand cmd = new SqlCommand("PR_AddStatus", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@StatusName", SqlDbType.VarChar, 50).Value = statusMasterdto.StatusName;
                cmd.Parameters.Add("@StatusCategory", SqlDbType.VarChar, 50).Value = statusMasterdto.StatusCategory;
                cmd.Parameters.Add("@Description", SqlDbType.VarChar, 100).Value = statusMasterdto.Description;

                await con.OpenAsync();
                using SqlDataReader reader = await cmd.ExecuteReaderAsync();
                if(await reader.ReadAsync())
                {
                    status = new StatusMasterDto
                    {
                        StatusId = Convert.ToInt32(reader["StatusId"]),
                        StatusName = reader["StatusName"].ToString(),
                        StatusCategory = reader["StatusCategory"].ToString(),
                        Description = reader["Description"].ToString(),
                    };
                }
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return status;
        }

        public async Task<StatusMasterDto> UpdateStatusMaster(StatusMasterDto statusMasterDto,int id)
        {
            StatusMasterDto? status = null;

            try
            {
                using SqlConnection con = new SqlConnection(_connectionString);
                using SqlCommand cmd = new SqlCommand("PR_UpdateStatus", con);

                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@StatusId", SqlDbType.Int).Value = id;
                cmd.Parameters.Add("@StatusName", SqlDbType.VarChar, 50).Value = statusMasterDto.StatusName;
                cmd.Parameters.Add("@StatusCategory", SqlDbType.VarChar, 50).Value = statusMasterDto.StatusCategory;
                cmd.Parameters.Add("@Description", SqlDbType.VarChar, 100).Value = statusMasterDto.Description;

                await con.OpenAsync();

                using SqlDataReader reader = await cmd.ExecuteReaderAsync();

                if (await reader.ReadAsync())
                {
                    status = new StatusMasterDto
                    {
                        StatusId = id,
                        StatusName = statusMasterDto.StatusName,
                        StatusCategory = statusMasterDto.StatusCategory,
                        Description = statusMasterDto.Description,
                       
                    };
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            return status;

        }


        public async Task<StatusMasterDto> RemoveStatusMaster(int id)
        {
            StatusMasterDto? status = null;

            try
            {
                using SqlConnection con = new SqlConnection(_connectionString);
                using SqlCommand cmd = new SqlCommand("PR_DeleteStatus", con);

                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@StatusId", SqlDbType.Int).Value = id;

                await con.OpenAsync();

                using SqlDataReader reader = await cmd.ExecuteReaderAsync();

                if (await reader.ReadAsync())
                {
                    status = new StatusMasterDto
                    {
                        StatusId = Convert.ToInt32(reader["StatusId"])
                    };
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }


            return status;
        }
    }
}
