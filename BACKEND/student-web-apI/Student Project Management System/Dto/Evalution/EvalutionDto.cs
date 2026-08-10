namespace student_Project_Managment_System.DTOs
{
    public class EvaluationDto
    {
        public int EvaluationId { get; set; }

        public int StudentProjectId { get; set; }

        public int TaskId { get; set; }

        public int EvaluatedByUserId { get; set; }

        public decimal MarksObtained { get; set; }

        public decimal TotalMarks { get; set; }

        public string Grade { get; set; }

        public string Feedback { get; set; }

        public DateTime EvaluationDate { get; set; }

        public int? weekNumber { get; set; }

        public int StatusId { get; set; }

        public int CreatedBy { get; set; }

        public string? TaskName { get; set; }
    }
}