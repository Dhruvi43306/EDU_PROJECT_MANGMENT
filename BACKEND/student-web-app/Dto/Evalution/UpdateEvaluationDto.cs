using System.ComponentModel.DataAnnotations;

namespace student_Project_Managment_System.Dto.Evaluation
{
    public class UpdateEvaluationDto
    {
        [Required]
        public int StudentProjectId { get; set; }

        [Required]
        public int TaskId { get; set; }

        [Required]
        public int EvaluatedByUserId { get; set; }

        [Required]
        public decimal MarksObtained { get; set; }

        [Required]
        public decimal TotalMarks { get; set; }

        [Required]
        public string Grade { get; set; }

        public string Feedback { get; set; }

        [Required]
        public DateTime EvaluationDate { get; set; }

        [Required]
        public int StatusId { get; set; }

        public int UpdatedBy { get; set; }
    }
}