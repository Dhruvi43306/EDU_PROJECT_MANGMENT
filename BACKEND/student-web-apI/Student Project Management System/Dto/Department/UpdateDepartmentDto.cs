using System.ComponentModel.DataAnnotations;

namespace student_Project_Managment_System.Dto.Department
{
    public class UpdateDepartmentDto
    {
        [Required]
        public string? DepartmentName { get; set; }

        [Required]
        public string? DepartmentCode { get; set; }

        public string? Description { get; set; }
    }
}