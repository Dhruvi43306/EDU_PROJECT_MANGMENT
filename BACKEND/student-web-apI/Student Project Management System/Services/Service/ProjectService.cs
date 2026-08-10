    //using AutoMapper;
    using Microsoft.Data.SqlClient;
    using Microsoft.VisualBasic;
    using student_Project_Managment_System.Data;
    using student_Project_Managment_System.Dto.Department;
    using student_Project_Managment_System.Dto.Project;
    using student_Project_Managment_System.Dto.StatusMaster;
    using student_Project_Managment_System.Models;
    using student_Project_Managment_System.Services.Interface;
    using System.Data;

    namespace student_Project_Managment_System.Services.Service
    {
        public class ProjectService : IProjectService
        {
            private readonly IConfiguration _configuration;

            private readonly string _connectionString;

            public ProjectService(IConfiguration configuration)
            {
                _configuration = configuration;
                _connectionString = _configuration.GetConnectionString("DefaultConnection");
            }
            private string GenerateProjectCode()
            {
                Random random = new Random();
                return "PR" + random.Next(100000, 999999);
            }

            public async Task<List<ProjectDto>> GetAllProject()
            {

                List<ProjectDto> projectlist = new List<ProjectDto>();
            
                try
                {
                    using SqlConnection con = new SqlConnection(_connectionString);
                    using SqlCommand cmd = new SqlCommand("PR_GetAllProject", con);
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    await con.OpenAsync();

                    using SqlDataReader reader = await cmd.ExecuteReaderAsync();
                    while (await reader.ReadAsync())
                    {
                        projectlist.Add(new ProjectDto
                        {
                            projectId = Convert.ToInt32(reader["projectId"]),
                            projectcode = GenerateProjectCode(),
                            projecttitle = reader["projecttitle"].ToString(),
                            description = reader["description"].ToString(),
                            objectives = reader["objectives"].ToString(),
                            technologystack = reader["technologystack"].ToString(),
                            projecttype = reader["projecttype"].ToString(),
                            difficultylevel = reader["difficultylevel"].ToString(),
                            startdate = reader["startdate"] == DBNull.Value ? null : Convert.ToDateTime(reader["startdate"]),
                            enddate = reader["enddate"] == DBNull.Value ? null : Convert.ToDateTime(reader["enddate"]),
                            PriorityId = Convert.ToInt32(reader["PriorityId"])

                        });
                    }

                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
                return projectlist;

            }
            public async Task<ProjectDto> GetProjectById(int id)
            {
                ProjectDto? project = null;

                try
                {
                    using SqlConnection con = new SqlConnection(_connectionString);
                    using SqlCommand cmd = new SqlCommand("PR_GetProjectById", con);
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add("@ProjectId", SqlDbType.Int).Value = id;
                    await con.OpenAsync();
                    ;

                    using SqlDataReader reader = await cmd.ExecuteReaderAsync();
                    while (await reader.ReadAsync())
                    {
                        project = new ProjectDto
                        {
                            projectId = Convert.ToInt32(reader["projectId"]),
                            projectcode = GenerateProjectCode(),
                            projecttitle = reader["projecttitle"].ToString(),
                            description = reader["description"].ToString(),
                            objectives = reader["objectives"].ToString(),
                            technologystack = reader["technologystack"].ToString(),
                            projecttype = reader["projecttype"].ToString(),
                            difficultylevel = reader["difficultylevel"].ToString(),
                            startdate = reader["startdate"] == DBNull.Value ? null : Convert.ToDateTime(reader["startdate"]),
                            enddate = reader["enddate"] == DBNull.Value ? null : Convert.ToDateTime(reader["enddate"])
                        };
                    }

                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
                return project;
            }

            public async Task<ProjectDto?> AddProject(ProjectDto projectDto, int userId)
            {
                ProjectDto? project = null;

                using SqlConnection con = new SqlConnection(_connectionString);

                using SqlCommand cmd = new SqlCommand("PR_AddProject", con);

                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@projectcode", GenerateProjectCode());
                cmd.Parameters.AddWithValue("@projecttitle", projectDto.projecttitle);
                cmd.Parameters.AddWithValue("@description", projectDto.description);
                cmd.Parameters.AddWithValue("@objectives", projectDto.objectives);
                cmd.Parameters.AddWithValue("@technologystack", projectDto.technologystack);
                cmd.Parameters.AddWithValue("@projecttype", projectDto.projecttype);
                cmd.Parameters.AddWithValue("@difficultylevel", projectDto.difficultylevel);
                cmd.Parameters.AddWithValue("@PriorityId", projectDto.PriorityId);
                cmd.Parameters.AddWithValue("@UserId", userId);
                cmd.Parameters.AddWithValue("@startdate", (object?)projectDto.startdate ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@enddate", (object?)projectDto.enddate ?? DBNull.Value);

            await con.OpenAsync();

                using SqlDataReader reader = await cmd.ExecuteReaderAsync();

                if (await reader.ReadAsync())
                {
                    project = new ProjectDto
                    {
                        projectId = Convert.ToInt32(reader["projectId"]),
                        projectcode = reader["projectcode"].ToString(),
                        projecttitle = reader["projecttitle"].ToString(),
                        description = reader["description"].ToString(),
                        objectives = reader["objectives"].ToString(),
                        technologystack = reader["technologystack"].ToString(),
                        projecttype = reader["projecttype"].ToString(),
                        difficultylevel = reader["difficultylevel"].ToString(),
                        startdate = reader["startdate"] == DBNull.Value ? null : Convert.ToDateTime(reader["startdate"]),
                        enddate = reader["enddate"] == DBNull.Value ? null : Convert.ToDateTime(reader["enddate"]),
                        PriorityId = Convert.ToInt32(reader["PriorityId"])
                    };
                }

                return project;
            }

            public async Task<ProjectDto> UpdateProject(UpdateProjectDto projectDto, int id)
            {
                ProjectDto? project = null;
                try
                {
                    using SqlConnection con = new SqlConnection(_connectionString);
                    using SqlCommand cmd = new SqlCommand("PR_UpdateProject", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@ProjectId", SqlDbType.Int).Value = id;
                    cmd.Parameters.Add("@projecttitle", SqlDbType.VarChar, 50).Value = projectDto.ProjectTitle;
                    cmd.Parameters.Add("@projecttype", SqlDbType.VarChar, 100).Value = projectDto.ProjectType;
                cmd.Parameters.AddWithValue("@description", projectDto.Description);
                cmd.Parameters.AddWithValue("@objectives", projectDto.Objectives);
                cmd.Parameters.AddWithValue("@technologystack", projectDto.TechnologyStack);
                cmd.Parameters.AddWithValue("@difficultylevel", projectDto.DifficultyLevel);
                cmd.Parameters.AddWithValue("@startdate", (object?)projectDto.StartDate ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@enddate", (object?)projectDto.EndDate ?? DBNull.Value);
              

                await con.OpenAsync();

                    using SqlDataReader reader = await cmd.ExecuteReaderAsync();

                    if (await reader.ReadAsync())
                    {
                        project = new ProjectDto
                        {

                            projectId = Convert.ToInt32(reader["projectId"]),
                            //projectcode = reader["projectcode"].ToString(),
                            projecttitle = reader["projecttitle"].ToString(),
                            description = reader["description"].ToString(),
                            objectives = reader["objectives"].ToString(),
                            technologystack = reader["technologystack"].ToString(),
                            projecttype = reader["projecttype"].ToString(),
                            difficultylevel = reader["difficultylevel"].ToString(),
                            startdate = reader["startdate"] == DBNull.Value ? null : Convert.ToDateTime(reader["startdate"]),
                            enddate = reader["enddate"] == DBNull.Value ? null : Convert.ToDateTime(reader["enddate"])
                        };
                    }

                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
                return project;
            }

            public async Task<ProjectDto> RemoveProject(int id)
            {

                ProjectDto? project = null;

                try
                {
                    using SqlConnection con = new SqlConnection(_connectionString);
                    using SqlCommand cmd = new SqlCommand("PR_DeleteProject", con);
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add("@ProjectId", SqlDbType.Int).Value = id;
                    await con.OpenAsync();

                    using SqlDataReader reader = await cmd.ExecuteReaderAsync();
                    while (await reader.ReadAsync())
                    {
                        project = new ProjectDto
                        {
                            projectId = Convert.ToInt32(reader["projectId"]),
                       
                        };
                    }

                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
                return project;
            }

        }
    }
