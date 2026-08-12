using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace student_Project_Managment_System.Dto.Student
{
    public class StudentDto
    {
        [Key]
        [Column("studentid")]
        public int StudentId { get; set; }
     
        public string StudentName { get; set; }
        public string? StudentCode { get; set; }
      
        [Column("createdat")]
        public DateTime? CreatedAt { get; set; }
        [Column("updatedat")]
        public DateTime? UpdatedAt { get; set; }
      
    }
}
