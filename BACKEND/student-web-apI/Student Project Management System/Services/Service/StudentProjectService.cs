using Microsoft.Data.SqlClient;
using student_Project_Managment_System.Dto.Student;
using student_Project_Managment_System.Dto.StudentProject;
using student_Project_Managment_System.DTOs;
using student_Project_Managment_System.Migrations;
using student_Project_Managment_System.Models;
using student_Project_Managment_System.Services.Interface;
using System.Data;

namespace student_Project_Managment_System.Services.Service
{
    public class StudentProjectService : IStudentProjectService
    {
        public readonly IConfiguration _configuration;
        public readonly string _connectionString;
        public StudentProjectService(IConfiguration configuration)
        {
            _configuration = configuration;
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }
        private async Task<int> GetStudentIdFromUserId(int userId)
        {
            using SqlConnection con = new SqlConnection(_connectionString);

            using SqlCommand cmd = new SqlCommand(
                "SELECT StudentId FROM Studnets WHERE UserId=@UserId",
                con);

            cmd.Parameters.AddWithValue("@UserId", userId);

            await con.OpenAsync();

            object result = await cmd.ExecuteScalarAsync();

            if (result == null)
                throw new Exception("Student not found.");

            return Convert.ToInt32(result);
        }
        public async Task<StudentProjectDto> ApplyStudentProject(StudentProjectDto studentProjectDto,int userId)
        {
            StudentProjectDto? project = null;

            try
            {
                using SqlConnection con = new SqlConnection(_connectionString);
                using SqlCommand cmd = new SqlCommand("PR_ApplyStudentProject", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                int studentId = await GetStudentIdFromUserId(userId);
                cmd.Parameters.AddWithValue("@StudentId", studentId);
                cmd.Parameters.AddWithValue("@ProjectId", studentProjectDto.ProjectId);
                cmd.Parameters.AddWithValue("@EnrollmentNo", studentProjectDto.Enrollmentno);
                cmd.Parameters.AddWithValue("@Semester", studentProjectDto.Semester);
                //cmd.Parameters.AddWithValue("@Batch", studentProjectDto.batch);
                cmd.Parameters.AddWithValue("@AcademicYear", studentProjectDto.Academicyear);
                cmd.Parameters.AddWithValue("@CPI", studentProjectDto.cpi);
                cmd.Parameters.AddWithValue("@DepartmentId", studentProjectDto.DepartmentId);

                await con.OpenAsync();

                using SqlDataReader reader = await cmd.ExecuteReaderAsync();

                if (await reader.ReadAsync())
                {
                    project = new StudentProjectDto
                    {
                        StudnetProjectId = Convert.ToInt32(reader["StudnetProjectId"]),
                        StudentId = Convert.ToInt32(reader["StudentId"]),
                        ProjectId = Convert.ToInt32(reader["ProjectId"]),
                        Enrollmentno = reader["EnrollmentNo"].ToString(),
                        Semester = Convert.ToInt32(reader["Semester"]),
                        //batch = Convert.ToInt32(reader["Batch"]),
                        Academicyear = Convert.ToInt32(reader["AcademicYear"]),
                        cpi = Convert.ToSingle(reader["CPI"]),
                        DepartmentId = Convert.ToInt32(reader["DepartmentId"]),
                        StatusId = Convert.ToInt32(reader["StatusId"])
                    };
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("====================================");
                Console.WriteLine("ApplyStudentProject ERROR");
                Console.WriteLine(ex.ToString());
                Console.WriteLine("====================================");
            }
            return project;
        }
       
          public async Task<List<StudentProjectDto>> GetAllStudentProject()
        {
            List<StudentProjectDto> list = new();

            try
            {
                using SqlConnection con = new SqlConnection(_connectionString);
                using SqlCommand cmd = new SqlCommand("PR_GetAllStudentProjects", con);

                cmd.CommandType = CommandType.StoredProcedure;

                await con.OpenAsync();

                using SqlDataReader reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    list.Add(new StudentProjectDto
                    {
                        StudnetProjectId = Convert.ToInt32(reader["StudnetProjectId"]),
                        StudentId = Convert.ToInt32(reader["StudentId"]),
                        StudentName = reader["StudentName"].ToString(),
                        StudentCode = reader["StudentCode"].ToString(),

                        Enrollmentno = reader["Enrollmentno"].ToString(),
                        Semester = Convert.ToInt32(reader["Semester"]),
                        //batch = Convert.ToInt32(reader["batch"]),
                        Academicyear = Convert.ToInt32(reader["Academicyear"]),
                        cpi = Convert.ToSingle(reader["cpi"]),

                        ProjectId = Convert.ToInt32(reader["ProjectId"]),
                        ProjectTitle = reader["ProjectTitle"].ToString(),

                        DepartmentName = reader["DepartmentName"].ToString(),
                        StatusName = reader["StatusName"].ToString(),

                        ApprovedBy = reader["ApprovedBy"] == DBNull.Value ? "" : reader["ApprovedBy"].ToString(),
                        CoordinatorId = reader["CoordinatorId"] == DBNull.Value ? null : Convert.ToInt32(reader["CoordinatorId"]),
                        Coordinator = reader["Coordinator"] == DBNull.Value ? "" : reader["Coordinator"].ToString(),

                        ApprovedDate = reader["ApprovedDate"] == DBNull.Value
                            ? null
                            : Convert.ToDateTime(reader["ApprovedDate"]),

                        AssignedDate = reader["AssignedDate"] == DBNull.Value
                            ? null
                            : Convert.ToDateTime(reader["AssignedDate"]),
                        OverallGrade = reader["OverallGrade"] == DBNull.Value? null: reader["OverallGrade"].ToString()
                    });
                  
                }
            }
            catch
            {
                throw;
            }

            return list;
        }

        public async Task<List<StudentProjectDto>> GetStudentProjectsByStudentId(int studentId)
        {
            List<StudentProjectDto> list = new();

            try
            {
                using SqlConnection con = new SqlConnection(_connectionString);
                using SqlCommand cmd = new SqlCommand("PR_GetStudentProjectsByStudentId", con);

                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@StudentId", studentId);

                await con.OpenAsync();

                using SqlDataReader reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    list.Add(new StudentProjectDto
                    {
                        StudnetProjectId = Convert.ToInt32(reader["StudnetProjectId"]),
                        StudentName = reader["StudentName"].ToString(),
                        StudentCode = reader["StudentCode"].ToString(),

                        Enrollmentno = reader["Enrollmentno"].ToString(),
                        Semester = Convert.ToInt32(reader["Semester"]),
                        //batch = Convert.ToInt32(reader["batch"]),
                        Academicyear = Convert.ToInt32(reader["Academicyear"]),
                        cpi = Convert.ToSingle(reader["cpi"]),

                        ProjectTitle = reader["ProjectTitle"].ToString(),
                        DepartmentName = reader["DepartmentName"].ToString(),
                        StatusName = reader["StatusName"].ToString(),

                        ApprovedDate = reader["ApprovedDate"] == DBNull.Value
                            ? null
                            : Convert.ToDateTime(reader["ApprovedDate"]),

                        AssignedDate = reader["AssignedDate"] == DBNull.Value
                            ? null
                            : Convert.ToDateTime(reader["AssignedDate"]),
                        StudentId = Convert.ToInt32(reader["StudentId"]),

                        ProjectId = Convert.ToInt32(reader["ProjectId"]),

                        OverallGrade =
                    reader["OverallGrade"] == DBNull.Value
                        ? null
                        : reader["OverallGrade"]?.ToString()

                    });
                }
            }
            catch
            {
                throw;
            }

            return list;
        }

        public async Task<bool> ApproveStudentProject(int studentProjectId, int facultyUserId)
        {
            using SqlConnection con = new SqlConnection(_connectionString);

            using SqlCommand cmd = new SqlCommand("PR_ApproveStudentProject", con);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@StudentProjectId", studentProjectId);
            cmd.Parameters.AddWithValue("@FacultyUserId", facultyUserId);

            await con.OpenAsync();

            return await cmd.ExecuteNonQueryAsync() > 0;
        }

        public async Task<bool> RejectStudentProject(int studentProjectId, int facultyUserId)
        {
            using SqlConnection con = new SqlConnection(_connectionString);

            using SqlCommand cmd = new SqlCommand("PR_RejectStudentProject", con);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@StudentProjectId", studentProjectId);
            cmd.Parameters.AddWithValue("@FacultyUserId", facultyUserId);

            await con.OpenAsync();

            return await cmd.ExecuteNonQueryAsync() > 0;
        }

        public async Task<bool> AssignCoordinator(int studentProjectId, int coordinatorId)
        {
            using SqlConnection con = new SqlConnection(_connectionString);

            using SqlCommand cmd = new SqlCommand("PR_AssignCoordinator", con);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@StudentProjectId", studentProjectId);
            cmd.Parameters.AddWithValue("@CoordinatorId", coordinatorId);

            await con.OpenAsync();

            return await cmd.ExecuteNonQueryAsync() > 0;
        }

        public async Task<bool> UpdateStudentProject(
     UpdateStudentProjectDto dto)
        {
            using SqlConnection connection =
                new SqlConnection(
                    _configuration.GetConnectionString("DefaultConnection")
                );

            using SqlCommand command =
                new SqlCommand(
                    "PR_UpdateStudentProject",
                    connection
                );

            command.CommandType = CommandType.StoredProcedure;

            command.Parameters.Add(
                "@StudentId",
                SqlDbType.Int
            ).Value = dto.StudentId;

            command.Parameters.Add(
                "@StudentName",
                SqlDbType.VarChar,
                100
            ).Value = dto.StudentName;

            command.Parameters.Add(
                "@ProjectTitle",
                SqlDbType.VarChar,
                200
            ).Value = dto.ProjectTitle;

            command.Parameters.Add(
                "@DepartmentName",
                SqlDbType.VarChar,
                100
            ).Value = dto.DepartmentName;

            SqlParameter cpiParameter =
                command.Parameters.Add(
                    "@CPI",
                    SqlDbType.Decimal
                );

            cpiParameter.Precision = 5;
            cpiParameter.Scale = 2;
            cpiParameter.Value = dto.CPI;

            command.Parameters.Add(
                "@StatusName",
                SqlDbType.VarChar,
                100
            ).Value = dto.StatusName;

            command.Parameters.Add(
                "@OverallGrade",
                SqlDbType.VarChar,
                10
            ).Value =
                (object?)dto.OverallGrade ?? DBNull.Value;

            await connection.OpenAsync();

            using SqlDataReader reader =
                await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return Convert.ToInt32(
                    reader["Success"]
                ) == 1;
            }

            return false;
        }


        public async Task<bool> DeleteStudentProject(int studentId)
        {
            using SqlConnection con =
                new SqlConnection(_connectionString);

            using SqlCommand cmd =
                new SqlCommand(
                    "PR_DeleteStudentProject",
                    con
                );

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.Add(
                "@StudentId",
                SqlDbType.Int
            ).Value = studentId;

            await con.OpenAsync();

            using SqlDataReader reader =
                await cmd.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return Convert.ToInt32(
                    reader["Success"]
                ) == 1;
            }

            return false;
        }
    }
}
