using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace student_Project_Managment_System.Dto.Department
{
    public class DepartmentDto
    {
     
        public int DepartmentId { get; set; }
        [Required]
        [StringLength(100)]
       
        public string? DepartmentName { get; set; }
       
        public string? DepartmentCode { get; set; }
       
        public string? Description { get; set; }

        

    }
}
