using student_Project_Managment_System.Dto.Project;

namespace student_Project_Managment_System.Services.Interface
{
    public interface IProjectService
    {
        Task<List<ProjectDto>> GetAllProject();

        Task<ProjectDto> GetProjectById(int id);

        Task<ProjectDto> AddProject(ProjectDto projectDto,int userId);

        Task<ProjectDto> UpdateProject(UpdateProjectDto projectDto, int id);

        Task<ProjectDto> RemoveProject(int id);

    }
}
