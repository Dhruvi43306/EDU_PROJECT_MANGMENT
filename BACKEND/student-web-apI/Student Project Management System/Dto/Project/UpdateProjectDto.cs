using System.ComponentModel.DataAnnotations;

namespace student_Project_Managment_System.Dto.Project
{
    public class UpdateProjectDto
    {
        public string? ProjectCode { get; set; }

        [Required]
        public string? ProjectTitle { get; set; }

        public string? Description { get; set; }

        public string? Objectives { get; set; }

        public string? TechnologyStack { get; set; }

        public string? ProjectType { get; set; }

        public string? DifficultyLevel { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public int IsDeleted { get; set; }

        public int UpdatedBy { get; set; }
    }
}