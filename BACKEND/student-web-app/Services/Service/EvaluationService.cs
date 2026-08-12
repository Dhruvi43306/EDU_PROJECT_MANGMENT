using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using student_Project_Managment_System.Data;
using student_Project_Managment_System.DTOs;
using student_Project_Managment_System.Services.Interfaces;
using System.Data;

namespace student_Project_Managment_System.Services
{
    public class EvaluationService : IEvaluationService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public EvaluationService(
            AppDbContext context,
            IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        private string GetConnectionString()
        {
            return _configuration.GetConnectionString("DefaultConnection");
        }


        public async Task<int> AddEvaluation(AddEvaluationDto dto)
        {
            try
            {
                using SqlConnection connection = new SqlConnection(GetConnectionString());

                using SqlCommand command = new SqlCommand(
                    "PR_AddEvaluation",
                    connection
                );

                command.CommandType = CommandType.StoredProcedure;

                command.Parameters.AddWithValue(
                    "@StudentProjectId",
                    dto.StudentProjectId
                );

                command.Parameters.AddWithValue(
                    "@TaskId",
                    dto.TaskId
                );

                command.Parameters.AddWithValue(
                    "@EvaluatedByUserId",
                    dto.EvaluatedByUserId
                );

                command.Parameters.AddWithValue(
                    "@MarksObtained",
                    dto.MarksObtained
                );

                command.Parameters.AddWithValue(
                    "@TotalMarks",
                    dto.TotalMarks
                );

                command.Parameters.AddWithValue(
                    "@Grade",
                    dto.Grade ?? ""
                );

                command.Parameters.AddWithValue(
                    "@Feedback",
                    dto.Feedback ?? ""
                );

                command.Parameters.AddWithValue(
                    "@EvaluationDate",
                    dto.EvaluationDate
                );

                command.Parameters.AddWithValue(
                    "@StatusId",
                    dto.StatusId
                );

                command.Parameters.AddWithValue(
                    "@CreatedBy",
                    dto.CreatedBy
                );

                await connection.OpenAsync();

                var result = await command.ExecuteScalarAsync();

                int evaluationId = Convert.ToInt32(result);


                using SqlCommand statusCommand = new SqlCommand(
                    "PR_UpdateStudentProjectStatus",
                    connection
                );

                statusCommand.CommandType = CommandType.StoredProcedure;

                statusCommand.Parameters.AddWithValue(
                    "@StudentProjectId",
                    dto.StudentProjectId
                );

                await statusCommand.ExecuteNonQueryAsync();

                return evaluationId;
            }
            catch (Exception ex)
            {
                Console.WriteLine("========== ADD EVALUATION ERROR ==========");
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                Console.WriteLine("==========================================");

                throw;
            }
        }



        public async Task<EvaluationDto?> GetEvaluationById(int evaluationId)
        {
            using SqlConnection connection =
                new SqlConnection(GetConnectionString());

            using SqlCommand command =
                new SqlCommand("PR_GetEvaluationById", connection);

            command.CommandType = CommandType.StoredProcedure;

            command.Parameters.AddWithValue(
                "@EvaluationId",
                evaluationId);

            await connection.OpenAsync();

            using SqlDataReader reader =
                await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return new EvaluationDto
                {
                    EvaluationId = Convert.ToInt32(
                        reader["EvaluationId"]),

                    StudentProjectId = Convert.ToInt32(
                        reader["StudentProjectId"]),

                    TaskId = Convert.ToInt32(
                        reader["TaskId"]),

                    EvaluatedByUserId = Convert.ToInt32(
                        reader["EvaluatedByUserId"]),

                    MarksObtained = Convert.ToDecimal(
                        reader["MarksObtained"]),

                    TotalMarks = Convert.ToDecimal(
                        reader["TotalMarks"]),

                    Grade = reader["Grade"]?.ToString(),

                    Feedback = reader["Feedback"]?.ToString(),

                    EvaluationDate = Convert.ToDateTime(
                        reader["EvaluationDate"]),

                    StatusId = Convert.ToInt32(
                        reader["StatusId"]),

                    CreatedBy = Convert.ToInt32(
                        reader["CreatedBy"]),
                     weekNumber = Convert.ToInt32(
                        reader["weekNumber"]),
                    TaskName = reader["TaskName"]?.ToString()
                };
            }

            return null;
        }



        public async Task<List<EvaluationDto>> GetAllEvaluations()
        {
            var evaluations = new List<EvaluationDto>();

            using SqlConnection connection =
                new SqlConnection(GetConnectionString());

            using SqlCommand command =
                new SqlCommand("PR_GetAllEvaluations", connection);

            command.CommandType = CommandType.StoredProcedure;

            await connection.OpenAsync();

            using SqlDataReader reader =
                await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                evaluations.Add(new EvaluationDto
                {
                    EvaluationId = Convert.ToInt32(
                        reader["EvaluationId"]),

                    StudentProjectId = Convert.ToInt32(
                        reader["StudentProjectId"]),

                    TaskId = Convert.ToInt32(
                        reader["TaskId"]),

                    EvaluatedByUserId = Convert.ToInt32(
                        reader["EvaluatedByUserId"]),

                    MarksObtained = Convert.ToDecimal(
                        reader["MarksObtained"]),

                    TotalMarks = Convert.ToDecimal(
                        reader["TotalMarks"]),

                    Grade = reader["Grade"]?.ToString(),

                    Feedback = reader["Feedback"]?.ToString(),

                    EvaluationDate = Convert.ToDateTime(
                        reader["EvaluationDate"]),

                    StatusId = Convert.ToInt32(
                        reader["StatusId"]),

                    weekNumber = Convert.ToInt32(
                        reader["weekNumber"]),
                    TaskName = reader["TaskName"]?.ToString()
                });
            }

            return evaluations;
        }

        public async Task<bool> UpdateEvaluation(
     int evaluationId,
     AddEvaluationDto dto)
        {
            using SqlConnection connection =
                new SqlConnection(GetConnectionString());

            await connection.OpenAsync();

            using SqlCommand command =
                new SqlCommand("PR_UpdateEvaluation", connection);

            command.CommandType = CommandType.StoredProcedure;

            command.Parameters.AddWithValue(
                "@EvaluationId",
                evaluationId);

            command.Parameters.AddWithValue(
                "@MarksObtained",
                dto.MarksObtained);

            command.Parameters.AddWithValue(
                "@TotalMarks",
                dto.TotalMarks);

            command.Parameters.AddWithValue(
                "@Grade",
                dto.Grade);

            command.Parameters.AddWithValue(
                "@Feedback",
                dto.Feedback);

            command.Parameters.AddWithValue(
                "@EvaluationDate",
                dto.EvaluationDate);

            command.Parameters.AddWithValue(
                "@StatusId",
                dto.StatusId);

            command.Parameters.AddWithValue(
                "@UpdatedBy",
                dto.CreatedBy);

            int rows = await command.ExecuteNonQueryAsync();

            if (rows <= 0)
                return false;


            using SqlCommand getProjectCommand =
                new SqlCommand(
                    @"SELECT StudentProjectId
              FROM Evaluations
              WHERE EvaluationId = @EvaluationId",
                    connection);

            getProjectCommand.Parameters.AddWithValue(
                "@EvaluationId",
                evaluationId);

            var studentProjectIdObject =
                await getProjectCommand.ExecuteScalarAsync();

            if (studentProjectIdObject != null)
            {
                using SqlCommand updateStatusCommand =
                    new SqlCommand(
                        "PR_UpdateStudentProjectStatus",
                        connection);

                updateStatusCommand.CommandType =
                    CommandType.StoredProcedure;

                updateStatusCommand.Parameters.AddWithValue(
                    "@StudentProjectId",
                    Convert.ToInt32(studentProjectIdObject));

                await updateStatusCommand.ExecuteNonQueryAsync();
            }

            return true;
        }



        public async Task<bool> DeleteEvaluation(int evaluationId)
        {
            using SqlConnection connection =
                new SqlConnection(GetConnectionString());

            using SqlCommand command =
                new SqlCommand("PR_DeleteEvaluation", connection);

            command.CommandType = CommandType.StoredProcedure;

            command.Parameters.AddWithValue(
                "@EvaluationId",
                evaluationId);

            await connection.OpenAsync();

            int rows = await command.ExecuteNonQueryAsync();

            return rows > 0;
        }



        public async Task<NextEvaluationTaskDto?>
            GetNextEvaluationTask(int studentProjectId)
        {
            using SqlConnection connection =
                new SqlConnection(GetConnectionString());

            using SqlCommand command =
                new SqlCommand(
                    "PR_GetNextEvaluationTask",
                    connection);

            command.CommandType = CommandType.StoredProcedure;

            command.Parameters.AddWithValue(
                "@StudentProjectId",
                studentProjectId);

            await connection.OpenAsync();

            using SqlDataReader reader =
                await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return new NextEvaluationTaskDto
                {
                    TaskId = Convert.ToInt32(
                        reader["TaskId"]),

                    ProjectId = Convert.ToInt32(
                        reader["ProjectId"]),

                    StudentProjectId = Convert.ToInt32(
                        reader["StudentProjectId"]),

                    TaskName = reader["TaskName"]?.ToString(),

                    Description = reader["Description"]?.ToString(),

                    PriorityId = Convert.ToInt32(
                        reader["PriorityId"]),

                    StartDate = DateOnly.FromDateTime(
                        Convert.ToDateTime(reader["StartDate"])),

                    DueDate = DateOnly.FromDateTime(
                        Convert.ToDateTime(reader["DueDate"])),

                    ActualHours = reader["ActualHours"] == DBNull.Value
                        ? null
                        : Convert.ToDecimal(reader["ActualHours"])
                };
            }

            return null;
        }

        public async Task<bool> UpdateStudentProjectStatus(int studentProjectId)
        {
            using SqlConnection connection =
                new SqlConnection(GetConnectionString());

            using SqlCommand command =
                new SqlCommand(
                    "PR_UpdateStudentProjectStatus",
                    connection);

            command.CommandType = CommandType.StoredProcedure;

            command.Parameters.AddWithValue(
                "@StudentProjectId",
                studentProjectId);

            await connection.OpenAsync();

            int rows = await command.ExecuteNonQueryAsync();

            return true;
        }
    }
}