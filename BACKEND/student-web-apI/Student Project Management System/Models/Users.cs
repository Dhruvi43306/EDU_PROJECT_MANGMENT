using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using student_Project_Managment_System.Dto.Department;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;

namespace student_Project_Managment_System.Models
{
    public class Users
    {
        [Key]
        public int UserId { get; set; }
        public string? UserCode { get; set; }
        public string? FullName { get; set; }
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Password { get; set; }
        public string? ProfilePhoto { get; set; }
        public string? Gender { get; set; }
        public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; } = DateTime.UtcNow;
        public int CreatedBy { get; set; }
       
        public int UpdatedBy { get; set; }
        public DateTime? LastLoginAt { get; set; }
        public int RoleId { get; set; }
        public virtual UserRole UserRole { get; set; }
        public int age { get; set; }
        public int DepartmentId { get; set; }
        public virtual DepartmentMaster Department { get; set; }

        public int isDeleted { get; set; } = 0;

        public int isVerified { get; set; }

        public ICollection<StudentProject> ApprovedProject { get; set; } = new List<StudentProject>();


        public ICollection<StudentProject> CoordinatedProject { get; set; } = new List<StudentProject>();

    }
}
