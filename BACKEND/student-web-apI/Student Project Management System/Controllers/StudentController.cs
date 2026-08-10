using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using student_Project_Managment_System.Dto.Student;
using student_Project_Managment_System.Models;
using student_Project_Managment_System.Services.Interface;

namespace student_Project_Managment_System.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class StudentController:ControllerBase
    {
        private readonly IStudentService _studentService;
       public StudentController(IStudentService studentService)
        {
            _studentService = studentService;
        }

        [HttpGet]
        public async Task<IActionResult> GetStudent()
        {
            try
            {
                var students = await _studentService.GetStudents();
                return Ok(students);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while getting all student.",
                    error = ex.Message
                });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetStudentById(int id)
        {
            try
            {
                var student = await _studentService.GetStudentById(id);
                return Ok(student);
            }
            catch(Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while getting the student.",
                    error = ex.Message
                });
            }

        }

        [HttpPost]
        public async Task<IActionResult> AddStudent(StudentDto studentdto)
        {
            try
            {
                var student = await _studentService.AddStudent(studentdto);
                return Ok(student);
            }
            catch(Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while creating the student.",
                    error = ex.Message
                });
            }
        }
    
    }
}
