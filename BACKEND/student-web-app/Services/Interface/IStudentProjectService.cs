using student_Project_Managment_System.Dto.StudentProject;
using student_Project_Managment_System.DTOs;

namespace student_Project_Managment_System.Services.Interface
{
    public interface IStudentProjectService
    {
        public Task<List<StudentProjectDto>> GetAllStudentProject();

        public Task<StudentProjectDto?> ApplyStudentProject(StudentProjectDto studentProjectDto,int userId);

        public Task<List<StudentProjectDto>> GetStudentProjectsByStudentId(int studentid);

        Task<bool> ApproveStudentProject(int studentProjectId, int facultyUserId);

        Task<bool> RejectStudentProject(int studentProjectId, int facultyUserId);

        public Task<bool> AssignCoordinator(int studentProjectId, int coordinatorId);

        Task<bool> UpdateStudentProject(UpdateStudentProjectDto dto);

        Task<bool> DeleteStudentProject(int studentId);

    }
}
