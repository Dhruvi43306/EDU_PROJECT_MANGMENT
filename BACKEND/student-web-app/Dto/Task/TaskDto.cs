using System.ComponentModel.DataAnnotations;

namespace student_Project_Managment_System.Dto.Task
{
    public class TaskDto
    {
        public int TaskId { get; set; }

        [Required]
        public int ProjectId { get; set; }


        [Required(ErrorMessage ="Task Name is Required!")]
        [StringLength(200, MinimumLength = 3,
        ErrorMessage = "Task Name must be between 3 and 200 characters.")]
        public string TaskName { get; set; }

        public string Description { get; set; }
        [Required]
        public int PriorityId { get; set; }

        public string? PriorityName { get; set; }

        public string? projecttitle { get; set; }

        [Required]
        public DateOnly StartDate { get; set; }

        [Required]
        public DateOnly DueDate { get; set; }

        public int userId { get; set; }

        public int WeekNumber { get; set; }



    }
}
