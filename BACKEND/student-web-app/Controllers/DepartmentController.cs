using Microsoft.AspNetCore.Mvc;
using student_Project_Managment_System.Dto.Department;
using student_Project_Managment_System.Models;
using student_Project_Managment_System.Services.Interface;

namespace student_Project_Managment_System.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class DepartmentController : ControllerBase
    {
        private readonly IDepartmnetService _departmentService;

        public DepartmentController(IDepartmnetService departmentService)
        {
            _departmentService = departmentService;
        }

        [HttpGet]
        public  async Task<IActionResult> GetDepartment()
        {
            try
            {
                var departments = await _departmentService.GetDepartment();
                if(departments == null)
                {
                    return NotFound(new
                    {
                        Success = false,
                        Message = "No Department found."
                    });
                }
                return Ok(new
                {
                    Success = true,
                    Message = "Tasks retrieved successfully.",
                    Data = departments
                });
            
              
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving Department.",
                    Error = ex.Message
                });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDepartmentById(int id)
        {
            try
            {
                var department = await _departmentService.GetDepartmentId(id);
                if (department == null)
                {
                    return NotFound(new
                    {
                        Success = false,
                        Message = "No Department found."
                    });
                }
                return Ok(new
                {
                    Success = true,
                    Message = "Department retrieved successfully.",
                    Data = department
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving Department.",
                    error = ex.Message
                });
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddDepartment(DepartmentDto departmentDto)
        {
            try
            {
                var department = await _departmentService.AddDepartment(departmentDto);
                return StatusCode(StatusCodes.Status201Created,new
                {
                    Success = false,
                    Message = "Department is Created."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while creating the Department.",
                    error = ex.Message
                });
            }
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDepartment(DepartmentDto departmentDto,int id)
        {
            try
            {
                var department = await _departmentService.UpdateDepartment(departmentDto,id);
                if (department == null)
                {
                    return NotFound(new
                    {
                        Success = false,
                        Message = "Department not found."
                    });
                }

                return Ok(new
                {
                    Success = true,
                    Message = "Department updated successfully.",
                    Data = department
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while updating the Department.",
                    error = ex.Message
                });
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveDepartment(int id)
        {
            try
            {
                var department = await _departmentService.RemoveDepartment(id);
                if (department == null)
                {
                    return NotFound(new
                    {
                        Success = false,
                        Message = "Department not found."
                    });
                }

                return Ok(new
                {
                    Success = true,
                    Message = "Department remving successfully.",
                    Data = department
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while removing the Department.",
                    error = ex.Message
                });
            }
        }
    }
}