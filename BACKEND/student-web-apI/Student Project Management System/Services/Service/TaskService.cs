using Microsoft.Data.SqlClient;
using student_Project_Managment_System.Dto.Task;
using student_Project_Managment_System.Models;
using student_Project_Managment_System.Services.Interface;
using System.Data;

namespace student_Project_Managment_System.Services.Service
{
    public class TaskService : ITaskService
    {
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;

        public TaskService(IConfiguration configuration)
        {
            _configuration = configuration;
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<List<TaskDto>> GetAllTask()
        {
            List<TaskDto> tasklist = new List<TaskDto>();
            try
            {
                using SqlConnection con = new SqlConnection(_connectionString);
                using SqlCommand cmd = new SqlCommand("PR_GetAllTask", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                await con.OpenAsync();

                using SqlDataReader reader = await cmd.ExecuteReaderAsync();
                while(await reader.ReadAsync())
                {
                    tasklist.Add(new TaskDto
                    {
                        TaskId = Convert.ToInt32(reader["TaskId"]),
                        TaskName = reader["TaskName"].ToString(),
                        PriorityId = Convert.ToInt32(reader["PriorityId"]),
                        StartDate = DateOnly.FromDateTime(Convert.ToDateTime(reader["StartDate"])),
                        DueDate = DateOnly.FromDateTime(Convert.ToDateTime(reader["DueDate"])),
                        ProjectId = Convert.ToInt32(reader["ProjectId"]),
                        Description = reader["Description"].ToString(),
                        PriorityName = reader["PriorityName"].ToString(),
                        projecttitle = reader["projecttitle"].ToString(),
                        WeekNumber = Convert.ToInt32(reader["WeekNumber"])
                    });

                }
            }
            catch(Exception ex)
            {
                Console.Write(ex.Message);
            }
            return tasklist;
        }


        public async Task<TaskDto> AddTask(TaskDto taskDto, int userId)
        {
            TaskDto? task = null;
            try
            {
                using SqlConnection con = new SqlConnection(_connectionString);
                using SqlCommand cmd = new SqlCommand("PR_AddTask", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.Add("TaskName", System.Data.SqlDbType.VarChar, 50).Value = taskDto.TaskName;
                cmd.Parameters.Add("PriorityId", System.Data.SqlDbType.Int).Value = taskDto.PriorityId;
                cmd.Parameters.Add("ProjectId", System.Data.SqlDbType.Int).Value = taskDto.ProjectId;
                cmd.Parameters.Add("Description", System.Data.SqlDbType.VarChar,100).Value = taskDto.Description;
                cmd.Parameters.Add("@StartDate", SqlDbType.DateTime).Value = taskDto.StartDate.ToDateTime(TimeOnly.MinValue);
                cmd.Parameters.Add("@DueDate", SqlDbType.DateTime).Value = taskDto.DueDate.ToDateTime(TimeOnly.MinValue);
                cmd.Parameters.Add("@UserId", SqlDbType.Int).Value = userId;
                cmd.Parameters.Add("WeekNumber", SqlDbType.Int).Value = taskDto.WeekNumber;
                await con.OpenAsync();

                using SqlDataReader reader = await cmd.ExecuteReaderAsync();
                if(await reader.ReadAsync())
                {
                    task = new TaskDto
                    {
                        TaskName = reader["TaskName"].ToString(),
                        PriorityId = Convert.ToInt32(reader["PriorityId"]),
                        StartDate = DateOnly.FromDateTime(Convert.ToDateTime(reader["StartDate"])),
                        DueDate = DateOnly.FromDateTime(Convert.ToDateTime(reader["DueDate"])),
                        ProjectId = Convert.ToInt32(reader["ProjectId"]),
                        Description = reader["Description"].ToString(),
                        userId = Convert.ToInt32(reader["UserId"]),
                        PriorityName = reader["PriorityName"].ToString(),
                        projecttitle = reader["projecttitle"].ToString(),
                        WeekNumber = Convert.ToInt32(reader["WeekNumber"])

                    };
                }

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);

            }
            return task;
        }
    }
}
