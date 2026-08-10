using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using student_Project_Managment_System.Dto.Task;
using student_Project_Managment_System.Services.Interface;
using System.Security.Claims;


namespace student_Project_Managment_System.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public TaskController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        [HttpGet("getTask")]

        public async Task<IActionResult> GetAllTask()
        {
            try
            {
                var task = await _taskService.GetAllTask();
                if(task == null)
                {
                    return NotFound(new
                    {
                        Success = false,
                        Message = "No tasks found."
                    });
                }
                return Ok(new
                {
                    Success = true,
                    Message = "Tasks retrieved successfully.",
                    Data = task
                });
            }
            catch(Exception ex)
            {

                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving tasks.",
                    Error = ex.Message
                });
            }

           
        }
        [Authorize]
        [HttpPost("AddTask")]
        public async Task<IActionResult> AddTask(TaskDto taskDto)
        {
            try
            {
                var role = User.FindFirst(ClaimTypes.Role)?.Value;
                if (role != "Admin" && role != "Faculty")
                {
                    return Forbid();
                }
                var userId = Convert.ToInt32(
                    User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ); var task = await _taskService.AddTask(taskDto,userId);
                return StatusCode(StatusCodes.Status201Created, new
                {
                    Success = true,
                    Message = "Task created successfully.",
                    data = task
                });
                
            }
            catch(Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while creating the task.",
                    error = ex.Message
                });
            }
        }
    }
}
