using student_Project_Managment_System.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Evaluation
{
    [Key]
    public int EvaluationId { get; set; }

    public int StudentProjectId { get; set; }
    [ForeignKey(nameof(StudentProjectId))]
    public StudentProject StudentProject { get; set; }

    public int TaskId { get; set; }
    [ForeignKey(nameof(TaskId))]
    public student_Project_Managment_System.Models.Task Task { get; set; }

    public int EvaluatedByUserId { get; set; }
    [ForeignKey(nameof(EvaluatedByUserId))]
    public Users EvaluatedByUser { get; set; }

    public decimal MarksObtained { get; set; }

    public decimal TotalMarks { get; set; }

    public string Grade { get; set; }

    public string Feedback { get; set; }

    public DateTime EvaluationDate { get; set; }

    public int StatusId { get; set; }
    [ForeignKey(nameof(StatusId))]

    public StatusMaster StatusMaster { get; set; }

    public DateTime Created { get; set; }

    public DateTime? Updated { get; set; }

    public int CreatedBy { get; set; }

    public int? UpdatedBy { get; set; }

}