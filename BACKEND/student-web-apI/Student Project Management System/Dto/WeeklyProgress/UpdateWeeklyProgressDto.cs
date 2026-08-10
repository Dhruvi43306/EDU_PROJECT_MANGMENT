using System.ComponentModel.DataAnnotations;

namespace student_Project_Managment_System.Dto.WeeklyProgress
{
    public class UpdateWeeklyProgressDto
    {
        [Required]
        public int StudentProjectId { get; set; }

        [Required]
        public int WeekNumber { get; set; }

        [Required]
        public string WorkDone { get; set; }

        public string Challenges { get; set; }

        public string NextPlan { get; set; }

        [Required]
        public DateTime SubmittedDate { get; set; }

        [Required]
        public int StatusId { get; set; }

        public int UpdatedBy { get; set; }
    }
}