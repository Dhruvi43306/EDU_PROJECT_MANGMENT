using student_Project_Managment_System.Models;

namespace student_Project_Managment_System.Services.Interface
{
    public interface IPriorityService
    {
        Task<List<Priority>> GetPriorities();
        Task<Priority> GetPriorityById(int priorityId);
        Task<int> AddPriority(Priority priority);
    }
}
