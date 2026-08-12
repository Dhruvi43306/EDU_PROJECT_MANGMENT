namespace student_Project_Managment_System.DTOs
{
    public class NextEvaluationTaskDto
    {
        public int TaskId { get; set; }

        public int ProjectId { get; set; }

        public int StudentProjectId { get; set; }

        public string? TaskName { get; set; }

        public string Description { get; set; }

        public int PriorityId { get; set; }

        public DateOnly StartDate { get; set; }

        public DateOnly DueDate { get; set; }

        public decimal? ActualHours { get; set; }
    }
}