using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace student_Project_Managment_System.Models
{
    public class Project
    {
        [Key]
        public int projectId { get; set; }
        public string? projectcode { get; set; }
        public string? projecttitle { get; set; }
        public string? description { get; set; }
        public string? objectives { get; set; }
        public string? technologystack { get; set; }
        public string? projecttype { get; set; }
        public string? difficultylevel { get; set; }
        public DateTime? startdate { get; set; }
        public DateTime? enddate { get; set; }
        public int UserId { get; set; }
        public virtual Users User { get; set; }

       
        public int PriorityId { get; set; }
        public virtual Priority Priority { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        //softdelete
        public int isDeleted { get; set; }

        
        public ICollection<student_Project_Managment_System.Models.Task> Tasks { get; set; }


    }
}
