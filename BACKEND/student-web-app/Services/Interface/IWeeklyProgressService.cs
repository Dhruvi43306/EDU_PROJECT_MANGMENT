using student_Project_Managment_System.DTOs;

namespace student_Project_Managment_System.Services.Interfaces
{
    public interface IWeeklyProgressService
    {
        Task<int> AddWeeklyProgress(AddWeeklyProgressDto dto);

        Task<List<WeeklyProgressDto>>
            GetWeeklyProgressByStudentProject(int studentProjectId);

        Task<List<WeeklyProgressDto>>
            GetAllWeeklyProgress();

        Task<bool> UpdateWeeklyProgress(
            int progressId,
            AddWeeklyProgressDto dto);

        Task<bool> DeleteWeeklyProgress(int progressId);
    }
}