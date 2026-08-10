using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace student_Project_Managment_System.Models
{
    public class StatusMaster
    {
        [Key]
       public int StatusId { get; set; }
        public string? StatusName { get; set; }
        public string? StatusCategory { get; set; }
        public string? Description { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }


        public ICollection<Student> Students { get; set; } 
    }
}
