using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace student_Project_Managment_System.Dto.Project
{
    public class ProjectDto
    {

        public int projectId { get; set; }

        public string? projectcode { get; set; }

        
        [Required]
        
        public string? projecttitle { get; set; }


        [Required]
        public string? description { get; set; }


        [Required]
        public string? objectives { get; set; }


        [Required]
        public string? technologystack { get; set; }


        [Required]
        public string? projecttype { get; set; }

        public string? difficultylevel { get; set; }

        public DateTime? startdate { get; set; }

        public DateTime? enddate { get; set; }

        public int PriorityId { get; set; }

       

    }
}
