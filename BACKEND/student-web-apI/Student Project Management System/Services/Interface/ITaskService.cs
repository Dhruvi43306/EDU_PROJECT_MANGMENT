using student_Project_Managment_System.Dto.Task;

namespace student_Project_Managment_System.Services.Interface
{
    public interface ITaskService
    {
        Task<List<TaskDto>> GetAllTask();
        Task<TaskDto> AddTask(TaskDto taskDto, int userId);
    }
}
