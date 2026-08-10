using student_Project_Managment_System.Dto.Student;

namespace student_Project_Managment_System.Services.Interface
{
    public interface IStudentService
    {
        Task<List<StudentDto>> GetStudents();
        Task<StudentDto> GetStudentById(int id);
        Task<StudentDto> AddStudent(StudentDto studentDto);
      

    }
}
