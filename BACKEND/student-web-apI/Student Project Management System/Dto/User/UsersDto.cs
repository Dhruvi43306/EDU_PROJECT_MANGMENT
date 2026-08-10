using System.ComponentModel.DataAnnotations;

namespace student_Project_Managment_System.Dto.User
{
    public class UsersDto
    {
        public int UserId { get; set; }
        [Required]
        [StringLength(100)]
        public string FullName { get; set; }
        public string? UserCode { get; set; }
        public string UserName { get; set; }
        public string? Phone { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        public int RoleId { get; set; }
        public string? RoleName { get; set; }
        public int Age { get; set; }
        public string Gender { get; set; }
        
        public string DepartmentName { get; set; }

        public string ProfilePhoto { get; set; }

        public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; } = DateTime.UtcNow;

    }
}
