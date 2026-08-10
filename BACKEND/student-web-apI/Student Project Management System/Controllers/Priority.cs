using Microsoft.AspNetCore.Mvc;
using student_Project_Managment_System.Models;
using student_Project_Managment_System.Services.Interface;

namespace student_Project_Managment_System.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PriorityController : ControllerBase
    {
        private readonly IPriorityService _priorityService;

        public PriorityController(IPriorityService priorityService)
        {
            _priorityService = priorityService;
        }

        [HttpGet]
        public async Task<IActionResult> GetPriorities()
        {
            var result = await _priorityService.GetPriorities();

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPriorityById(int id)
        {
            var result = await _priorityService.GetPriorityById(id);

            if (result == null)
            {
                return NotFound(new
                {
                    Message = "Priority not found."
                });
            }

            return Ok(result);
        }
        [HttpPost]
        public async Task<IActionResult> AddPriority(Priority priority)
        {
            var result = await _priorityService.AddPriority(priority);
            if (result == null)
            {
                return NotFound(new
                {
                    Message = "Priority not found."
                });
            }

            return Ok(result);

        }
    }
}