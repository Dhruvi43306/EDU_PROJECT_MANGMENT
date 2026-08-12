using Microsoft.AspNetCore.Mvc;
using student_Project_Managment_System.DTOs;
using student_Project_Managment_System.Services.Interfaces;

namespace student_Project_Managment_System.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WeeklyProgressController : ControllerBase
    {
        private readonly IWeeklyProgressService _service;

        public WeeklyProgressController(
            IWeeklyProgressService service)
        {
            _service = service;
        }



        [HttpPost("add")]
        public async Task<IActionResult> Add(
            [FromBody] AddWeeklyProgressDto dto)
        {
            try
            {
                int id =
                    await _service.AddWeeklyProgress(dto);

                return Ok(new
                {
                    success = true,
                    message = "Weekly progress added successfully",
                    progressId = id
                });
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


        [HttpGet("studentProject/{studentProjectId}")]
        public async Task<IActionResult>
            GetByStudentProject(int studentProjectId)
        {
            try
            {
                var result =
                    await _service
                    .GetWeeklyProgressByStudentProject(
                        studentProjectId);

                return Ok(new
                {
                    success = true,
                    data = result
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Success = false,
                    Message = "An error occurred while getting student project weekly progress.",
                    error = ex.Message
                });
            }
        }


        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var result =
                    await _service.GetAllWeeklyProgress();

                return Ok(new
                {
                    success = true,
                    data = result
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Success = false,
                    Message = "An error occurred while getting all weekly progress.",
                    error = ex.Message
                });
            }
        }


       

        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update(
            int id,
            [FromBody] AddWeeklyProgressDto dto)
        {
            try
            {
                bool result =
                    await _service
                    .UpdateWeeklyProgress(id, dto);

                if (!result)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Weekly progress not found"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Weekly progress updated successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Success = false,
                    Message = "An error occurred while updating weekly progress.",
                    error = ex.Message
                });
            }
        }


       

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                bool result =
                    await _service
                    .DeleteWeeklyProgress(id);

                if (!result)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Weekly progress not found"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Weekly progress deleted successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Success = false,
                    Message = "An error occurred while deleting weekly progress.",
                    error = ex.Message
                });
            }
        }
    }
}