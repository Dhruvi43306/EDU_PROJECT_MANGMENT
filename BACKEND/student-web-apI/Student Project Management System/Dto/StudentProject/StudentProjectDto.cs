using student_Project_Managment_System.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace student_Project_Managment_System.Dto.StudentProject
{
    public class StudentProjectDto
    {
        [Key]
        public int StudnetProjectId { get; set; }

        public int StudentId { get; set; }
        public string? StudentName { get; set; }
        public string? StudentCode { get; set; }


        public int ProjectId { get; set; }
        public string? ProjectTitle { get; set; }

        public int StatusId { get; set; }
        public string? StatusName { get; set; }

        public int? ApprovedByUserId { get; set; }
        public string? ApprovedBy { get; set; }

        public int? CoordinatorId { get; set; }
        public string? Coordinator { get; set; }

        public int DepartmentId { get; set; }
        public string? DepartmentName { get; set; }

        public DateTime? ApprovedDate { get; set; }

        public DateTime? AssignedDate { get; set; }
        public int Semester { get; set; }
        public string? Enrollmentno { get; set; }
        //public int batch { get; set; }
        public int Academicyear { get; set; }
        public float cpi { get; set; }
        public string? OverallGrade { get; set; }

    }
}
