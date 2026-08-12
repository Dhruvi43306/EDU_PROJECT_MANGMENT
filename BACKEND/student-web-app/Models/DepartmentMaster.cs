using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace student_Project_Managment_System.Models
{
    public class DepartmentMaster
    {
        [Key]
       
        public int DepartmentId { get; set; }
        
        public string? DepartmentName { get; set; }
       
        public string? DepartmentCode { get; set; }
        public string? Description { get; set; }

        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    

        public ICollection<Users> Users { get; set; }

    }
}
