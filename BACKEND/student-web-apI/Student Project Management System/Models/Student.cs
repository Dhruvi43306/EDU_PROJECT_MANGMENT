using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.RegularExpressions;

namespace student_Project_Managment_System.Models
{
    public class Student
    {
        [Key]
        public int? StudentId { get; set; }

        public string StudentName { get; set; }
       
        public string? StudentCode { get; set; }

        public int UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public Users User { get; set; }

        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public ICollection<StudentProject> StudentProjects { get; set; } = new List<StudentProject>();




    }
}
