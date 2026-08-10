namespace student_Project_Managment_System.DTOs
{
    public class AddWeeklyProgressDto
    {
        public int StudentProjectId { get; set; }

        public int WeekNumber { get; set; }

        public string WorkDone { get; set; }

        public string Challenges { get; set; }

        public string NextPlan { get; set; }

        public DateTime SubmittedDate { get; set; }

        public int StatusId { get; set; }

        public int CreatedBy { get; set; }
    }
}