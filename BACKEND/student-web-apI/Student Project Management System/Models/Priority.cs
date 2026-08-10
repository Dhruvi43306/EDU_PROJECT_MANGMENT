    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    namespace student_Project_Managment_System.Models
    {
        [Table("Priority")]
        public class Priority
        {
            [Key]
            public int PriorityID { get; set; }

            [Required]
            [StringLength(50)]
            public string PriorityName { get; set; }

            [StringLength(250)]
            public string? Description { get; set; }

            public int? Sequence { get; set; }

            public DateTime Created { get; set; } = DateTime.Now;

            public DateTime? Modified { get; set; } = DateTime.Now;

            public ICollection<student_Project_Managment_System.Models.Task> task = new List<student_Project_Managment_System.Models.Task>();

            public ICollection<Project> projects = new List<Project>();
          }
    }