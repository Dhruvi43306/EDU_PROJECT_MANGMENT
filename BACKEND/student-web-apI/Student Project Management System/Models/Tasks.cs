using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace student_Project_Managment_System.Models
{
    public class Task
    {
        [Key]
        public int TaskId { get; set; }

        public int ProjectId { get; set; }
        public virtual Project Project { get; set; }
        [Required]
        [StringLength(200)]
        public string TaskName { get; set; }
        
        public string Description { get; set; }
        [Required]
        public int PriorityId { get; set; }
        public virtual Priority Priority { get; set; }
        [Required]
        public DateOnly StartDate { get; set; }
        [Required]
        public DateOnly DueDate { get; set; }
        [Column(TypeName = "decimal(5,2)")]
        public decimal? ActualHours { get; set; }
        [Required]
       
        public DateTime Created { get; set; } = DateTime.Now;

        public DateTime? Updated { get; set; }
        public int TotalTask { get; set; }
        public int completedTask { get; set; }
        public int pendingTask { get; set; }
        public int inProgressTask { get; set; }
        public int isDeleted { get; set; }

        public int UserId { get; set; }
        [ForeignKey(nameof(UserId))]

        public Users Users { get; set; }

        [Required]
        public int WeekNumber { get; set; }

    }
}