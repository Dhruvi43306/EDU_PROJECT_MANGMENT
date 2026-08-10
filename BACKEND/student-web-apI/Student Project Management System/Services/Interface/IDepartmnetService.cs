using student_Project_Managment_System.Dto.Department;

namespace student_Project_Managment_System.Services.Interface
{
    public interface IDepartmnetService 
    {
            Task<List<DepartmentDto>> GetDepartment();
            Task<DepartmentDto> GetDepartmentId(int id);

            Task<DepartmentDto> AddDepartment(DepartmentDto departmentDto);

            Task<DepartmentDto> UpdateDepartment(DepartmentDto departmentDto, int id);

            Task<DepartmentDto> RemoveDepartment(int id);


    }
}
