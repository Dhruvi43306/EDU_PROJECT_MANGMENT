using System.ComponentModel.DataAnnotations;

namespace student_Project_Managment_System.Dto.Student
{
    public class UpdateStudentDto
    {
        [Required]
        public string StudentName { get; set; }

        public string? StudentCode { get; set; }

        [Required]
        public int UserId { get; set; }

        public int UpdatedBy { get; set; }
    }
}