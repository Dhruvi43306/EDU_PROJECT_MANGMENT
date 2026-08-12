using System.ComponentModel.DataAnnotations;

namespace student_Project_Managment_System.Dto.StatusMaster
{
    public class UpdateStatusMasterDto
    {
        [Required]
        public string? StatusName { get; set; }

        public string? StatusCategory { get; set; }

        public string? Description { get; set; }
    }
}