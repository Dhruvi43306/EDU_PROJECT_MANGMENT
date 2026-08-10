using System.ComponentModel.DataAnnotations;

namespace student_Project_Managment_System.DTOs
{
    public class UpdateStudentProjectDto
    {


        public int StudentId { get; set; }

        public string StudentName { get; set; } = "";

        public string ProjectTitle { get; set; } = "";

        public string DepartmentName { get; set; } = "";

        public decimal CPI { get; set; }

        public string StatusName { get; set; } = "";

        public string? OverallGrade { get; set; }

    }
}