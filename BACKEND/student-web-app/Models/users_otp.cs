using student_Project_Managment_System.Dto.User;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace student_Project_Managment_System.Models
{
    public class users_otp
    {
    [Key]   
    public int otpid { get; set; }

    public int userid { get; set; }
    [ForeignKey(nameof(userid))]
    public Users User { get; set; }

    public string? otpcode { get; set; }

    public DateTime? expiresat { get; set; }

    public bool isused { get; set; }

    public int attempts { get; set; }

    public DateTime? createdat { get; set; }

    }
}
