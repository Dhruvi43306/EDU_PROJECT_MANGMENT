using System.ComponentModel.DataAnnotations;

public class RegisterDto
{
    [Required(ErrorMessage ="Full Name is Required")]
    [StringLength(100)]
    public string FullName { get; set; }


    [Required(ErrorMessage = "User Name is required")]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "User Name must be at least 2 characters long and cannot exceed 50 characters.")]
    public string UserName { get; set; }

    [Required(ErrorMessage = "Email is required")]
    [EmailAddress]
    public string Email { get; set; }

    [Required(ErrorMessage ="Phone Number is Required.")]
    [Phone]
    [RegularExpression(@"^[0-9]{10}$", ErrorMessage = "Phone number must contain exactly 10 digits.")]
    public string Phone { get; set; }

    [Required(ErrorMessage = "Password is required")]
    [MinLength(6,ErrorMessage = "Password must be at least 6 characters")]
    public string Password { get; set; }

    [Required(ErrorMessage = "Gender is required")]
    public string Gender { get; set; }

    public int RoleId { get; set; }

    //[Required(ErrorMessage = "Department is required")]
    //public int DepartmentId { get; set; }
}