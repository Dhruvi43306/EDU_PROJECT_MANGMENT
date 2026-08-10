using Microsoft.Data.SqlClient;
using student_Project_Managment_System.Models;
using student_Project_Managment_System.Services.Interface;
using System.Data;

namespace student_Project_Managment_System.Services.Service
{
    public class PriorityService : IPriorityService
    {
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;

        public PriorityService(IConfiguration configuration)
        {
            _configuration = configuration;
            _connectionString = _configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<List<Priority>> GetPriorities()
        {
            List<Priority> priorities = new List<Priority>();

            try
            {
                using SqlConnection con = new SqlConnection(_connectionString);

                using SqlCommand cmd = new SqlCommand("PR_GetAllPriority", con);

                cmd.CommandType = CommandType.StoredProcedure;

                await con.OpenAsync();

                using SqlDataReader reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    priorities.Add(new Priority
                    {
                        PriorityID = Convert.ToInt32(reader["PriorityID"]),
                        PriorityName = reader["PriorityName"].ToString(),
                        Description = reader["Description"] == DBNull.Value ? null : reader["Description"].ToString(),
                        Sequence = reader["Sequence"] == DBNull.Value ? null : Convert.ToInt32(reader["Sequence"]),
                        Created = Convert.ToDateTime(reader["Created"]),
                        Modified = reader["Modified"] == DBNull.Value ? null : Convert.ToDateTime(reader["Modified"])
                    });
                }
            }
            catch (Exception)
            {
                throw;
            }

            return priorities;
        }

        public async Task<Priority?> GetPriorityById(int priorityId)
        {
            Priority? priority = null;

            try
            {
                using SqlConnection con = new SqlConnection(_connectionString);

                using SqlCommand cmd = new SqlCommand("PR_GetPriorityById", con);

                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@PriorityID", priorityId);

                await con.OpenAsync();

                using SqlDataReader reader = await cmd.ExecuteReaderAsync();

                if (await reader.ReadAsync())
                {
                    priority = new Priority
                    {
                        PriorityID = Convert.ToInt32(reader["PriorityID"]),
                        PriorityName = reader["PriorityName"].ToString(),
                        Description = reader["Description"] == DBNull.Value ? null : reader["Description"].ToString(),
                        Sequence = reader["Sequence"] == DBNull.Value ? null : Convert.ToInt32(reader["Sequence"]),
                        Created = Convert.ToDateTime(reader["Created"]),
                        Modified = reader["Modified"] == DBNull.Value ? null : Convert.ToDateTime(reader["Modified"])
                    };
                }
            }
            catch (Exception)
            {
                throw;
            }

            return priority;
        }

        public async Task<int> AddPriority(Priority priority)
        {
            try
            {
                using SqlConnection con = new SqlConnection(_connectionString);

                using SqlCommand cmd = new SqlCommand("PR_AddPriority", con);

                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@PriorityName", priority.PriorityName);
                cmd.Parameters.AddWithValue("@Description", (object?)priority.Description ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Sequence", (object?)priority.Sequence ?? DBNull.Value);

                await con.OpenAsync();

                using SqlDataReader reader = await cmd.ExecuteReaderAsync();

                if (await reader.ReadAsync())
                {
                    return Convert.ToInt32(reader["PriorityId"]);
                }

                return 0;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}