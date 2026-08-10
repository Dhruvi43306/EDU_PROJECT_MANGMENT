using Microsoft.AspNetCore.Http.HttpResults;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace student_Project_Managment_System.Models
{
    public class AccountSetupTokens
    {
        [Key]
        public int TokenId { get; set; }
        public int UserId { get; set; }
        public Users User { get; set; } = null!;

        public Guid? Token { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public int IsUsed { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
