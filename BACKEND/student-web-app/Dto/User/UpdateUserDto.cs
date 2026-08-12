using System.ComponentModel.DataAnnotations;

namespace student_Project_Managment_System.Dto.Users
{
    public class UpdateUserDto
    {
        public string? UserCode { get; set; }

        [Required]
        public string? FullName { get; set; }

        [Required]
        public string? UserName { get; set; }

        [Required]
        [EmailAddress]
        public string? Email { get; set; }

        public string? Phone { get; set; }

        public string? ProfilePhoto { get; set; }

        public string? Gender { get; set; }

        public int RoleId { get; set; }

        public int Age { get; set; }

        public int DepartmentId { get; set; }

        public int IsVerified { get; set; }

        public int IsDeleted { get; set; }

        public int UpdatedBy { get; set; }
    }
}