using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace student_Project_Managment_System.Dto.StatusMaster
{
    public class StatusMasterDto
    {
        
        public int StatusId { get; set; }
        [Required]
        [StringLength(100)]
        public string? StatusName { get; set; }
        [Required]
        [StringLength(100)]
        public string? StatusCategory { get; set; }
        public string? Description { get; set; }
    }
}
