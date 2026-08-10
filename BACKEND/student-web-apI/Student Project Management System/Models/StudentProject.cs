using student_Project_Managment_System.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class StudentProject
{
    [Key]
    public int StudnetProjectId { get; set; }

    public int StudentId { get; set; }
    
    [ForeignKey(nameof(StudentId))]
    public Student Student { get; set; }

    public int ProjectId { get; set; }

    [ForeignKey(nameof(ProjectId))]
    public Project Project { get; set; }

    public int StatusId { get; set; }

    [ForeignKey(nameof(StatusId))]
    public StatusMaster StatusMaster { get; set; }

    public int? ApprovedByUserId { get; set; }

    [ForeignKey(nameof(ApprovedByUserId))]
    public Users ApprovedByUsers { get; set; }

    public int? CoordinatorId { get; set; }

    [ForeignKey(nameof(CoordinatorId))]
    public Users CoordinatorUser { get; set; }

    public int DepartmentId { get; set; }
    [ForeignKey(nameof(DepartmentId))]
    public DepartmentMaster Department { get; set; }

    public int Semester { get; set; }
    public string? Enrollmentno { get; set; }
    public int batch { get; set; }
    public int Academicyear { get; set; }
    public float cpi { get; set; }
    public DateTime? ApprovedDate { get; set; }

    public DateTime? AssignedDate { get; set; }

    public string OverallGrade { get; set; }

}