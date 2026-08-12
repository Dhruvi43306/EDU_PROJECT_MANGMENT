using Microsoft.Data.SqlClient;
using student_Project_Managment_System.Data;
using student_Project_Managment_System.DTOs;
using student_Project_Managment_System.Services.Interfaces;
using System.Data;

namespace student_Project_Managment_System.Services
{
    public class WeeklyProgressService : IWeeklyProgressService
    {
        private readonly IConfiguration _configuration;

        public WeeklyProgressService(
            IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private string GetConnectionString()
        {
            return _configuration.GetConnectionString(
                "DefaultConnection");
        }



        public async Task<int> AddWeeklyProgress(
            AddWeeklyProgressDto dto)
        {
            using SqlConnection connection =
                new SqlConnection(GetConnectionString());

            using SqlCommand command =
                new SqlCommand(
                    "PR_AddWeeklyProgress",
                    connection);

            command.CommandType =
                CommandType.StoredProcedure;

            command.Parameters.AddWithValue(
                "@StudentProjectId",
                dto.StudentProjectId);

            command.Parameters.AddWithValue(
                "@WeekNumber",
                dto.WeekNumber);

            command.Parameters.AddWithValue(
                "@WorkDone",
                dto.WorkDone);

            command.Parameters.AddWithValue(
                "@Challenges",
                dto.Challenges);

            command.Parameters.AddWithValue(
                "@NextPlan",
                dto.NextPlan);

            command.Parameters.AddWithValue(
                "@SubmittedDate",
                dto.SubmittedDate);

            command.Parameters.AddWithValue(
                "@StatusId",
                dto.StatusId);

            command.Parameters.AddWithValue(
                "@CreatedBy",
                dto.CreatedBy);

            await connection.OpenAsync();

            var result =
                await command.ExecuteScalarAsync();

            return Convert.ToInt32(result);
        }



        public async Task<List<WeeklyProgressDto>>
            GetWeeklyProgressByStudentProject(
                int studentProjectId)
        {
            var list = new List<WeeklyProgressDto>();

            using SqlConnection connection =
                new SqlConnection(GetConnectionString());

            using SqlCommand command =
                new SqlCommand(
                    "PR_GetWeeklyProgressByStudentProject",
                    connection);

            command.CommandType =
                CommandType.StoredProcedure;

            command.Parameters.AddWithValue(
                "@StudentProjectId",
                studentProjectId);

            await connection.OpenAsync();

            using SqlDataReader reader =
                await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                list.Add(new WeeklyProgressDto
                {
                    ProgressId =
                        Convert.ToInt32(reader["ProgressId"]),

                    StudentProjectId =
                        Convert.ToInt32(reader["StudentProjectId"]),

                    WeekNumber =
                        Convert.ToInt32(reader["WeekNumber"]),

                    WorkDone =
                        reader["WorkDone"]?.ToString(),

                    Challenges =
                        reader["Challenges"]?.ToString(),

                    NextPlan =
                        reader["NextPlan"]?.ToString(),

                    SubmittedDate =
                        Convert.ToDateTime(
                            reader["SubmittedDate"]),

                    StatusId =
                        Convert.ToInt32(reader["StatusId"])
                });
            }

            return list;
        }



        public async Task<List<WeeklyProgressDto>>
            GetAllWeeklyProgress()
        {
            var list = new List<WeeklyProgressDto>();

            using SqlConnection connection =
                new SqlConnection(GetConnectionString());

            using SqlCommand command =
                new SqlCommand(
                    "PR_GetAllWeeklyProgress",
                    connection);

            command.CommandType =
                CommandType.StoredProcedure;

            await connection.OpenAsync();

            using SqlDataReader reader =
                await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                list.Add(new WeeklyProgressDto
                {
                    ProgressId =
                        Convert.ToInt32(reader["ProgressId"]),

                    StudentProjectId =
                        Convert.ToInt32(reader["StudentProjectId"]),

                    WeekNumber =
                        Convert.ToInt32(reader["WeekNumber"]),

                    WorkDone =
                        reader["WorkDone"]?.ToString(),

                    Challenges =
                        reader["Challenges"]?.ToString(),

                    NextPlan =
                        reader["NextPlan"]?.ToString(),

                    SubmittedDate =
                        Convert.ToDateTime(
                            reader["SubmittedDate"]),

                    StatusId =
                        Convert.ToInt32(reader["StatusId"])
                });
            }

            return list;
        }



        public async Task<bool> UpdateWeeklyProgress(
            int progressId,
            AddWeeklyProgressDto dto)
        {
            using SqlConnection connection =
                new SqlConnection(GetConnectionString());

            using SqlCommand command =
                new SqlCommand(
                    "PR_UpdateWeeklyProgress",
                    connection);

            command.CommandType =
                CommandType.StoredProcedure;

            command.Parameters.AddWithValue(
                "@ProgressId",
                progressId);

            command.Parameters.AddWithValue(
                "@WorkDone",
                dto.WorkDone);

            command.Parameters.AddWithValue(
                "@Challenges",
                dto.Challenges);

            command.Parameters.AddWithValue(
                "@NextPlan",
                dto.NextPlan);

            command.Parameters.AddWithValue(
                "@StatusId",
                dto.StatusId);

            command.Parameters.AddWithValue(
                "@UpdatedBy",
                dto.CreatedBy);

            await connection.OpenAsync();

            int rows =
                await command.ExecuteNonQueryAsync();

            return rows > 0;
        }



        public async Task<bool> DeleteWeeklyProgress(
            int progressId)
        {
            using SqlConnection connection =
                new SqlConnection(GetConnectionString());

            using SqlCommand command =
                new SqlCommand(
                    "PR_DeleteWeeklyProgress",
                    connection);

            command.CommandType =
                CommandType.StoredProcedure;

            command.Parameters.AddWithValue(
                "@ProgressId",
                progressId);

            await connection.OpenAsync();

            int rows =
                await command.ExecuteNonQueryAsync();

            return rows > 0;
        }
    }
}