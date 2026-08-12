using System.ComponentModel.DataAnnotations;

namespace student_Project_Managment_System.Dto.AddFacultyDto
{
    public class AddFacultyDto
    {
        public int UserId { get; set; }

        public string? UserCode { get; set; }

        [Required]
        public string FullName { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string Gender { get; set; }

        [Required]
        public int Age { get; set; }

        public int RoleId { get; set; }

        public int DepartmentId { get; set; }

        public int CreatedBy { get; set; }
    }
}