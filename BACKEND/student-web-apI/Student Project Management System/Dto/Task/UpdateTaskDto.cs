using System.ComponentModel.DataAnnotations;

namespace student_Project_Managment_System.Dto.Task
{
    public class UpdateTaskDto
    {
        [Required]
        public int ProjectId { get; set; }

        [Required]
        [StringLength(200)]
        public string TaskName { get; set; }

        public string Description { get; set; }

        [Required]
        public int PriorityId { get; set; }

        [Required]
        public DateOnly StartDate { get; set; }

        [Required]
        public DateOnly DueDate { get; set; }

        public decimal? ActualHours { get; set; }

        public int TotalTask { get; set; }

        public int CompletedTask { get; set; }

        public int PendingTask { get; set; }

        public int InProgressTask { get; set; }

        public int UserId { get; set; }

        public int IsDeleted { get; set; }

        public int UpdatedBy { get; set; }
    }
}