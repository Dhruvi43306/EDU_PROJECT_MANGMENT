using System.ComponentModel.DataAnnotations;

namespace student_Project_Managment_System.Models
{
    public class UserRole
    {

        [Key]
        public int RoleId { get; set; }

        public string? RoleName { get; set; }

    }
}
