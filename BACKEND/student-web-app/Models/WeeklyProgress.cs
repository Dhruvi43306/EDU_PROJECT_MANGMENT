using student_Project_Managment_System.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class WeeklyProgress
{
    [Key]
    public int ProgressId { get; set; }

    public int StudentProjectId { get; set; }
    public StudentProject StudentProject { get; set; }

    public int WeekNumber { get; set; }

    public string WorkDone { get; set; }

    public string Challenges { get; set; }

    public string NextPlan { get; set; }

    public DateTime SubmittedDate { get; set; }

    public int StatusId { get; set; }
    [ForeignKey(nameof(StatusId))]
    public StatusMaster StatusMaster { get; set; }

    public DateTime Created { get; set; }

    public DateTime? Updated { get; set; }

    public int CreatedBy { get; set; }

    public int? UpdatedBy { get; set; }
}