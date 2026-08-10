using Microsoft.AspNetCore.Mvc;
using student_Project_Managment_System.DTOs;
using student_Project_Managment_System.Services.Interfaces;

namespace student_Project_Managment_System.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EvaluationController : ControllerBase
    {
        private readonly IEvaluationService _evaluationService;

        public EvaluationController(
            IEvaluationService evaluationService)
        {
            _evaluationService = evaluationService;
        }

        [HttpPost("addEvaluation")]
        public async Task<IActionResult> AddEvaluation(
            [FromBody] AddEvaluationDto dto)
        {
            try
            {
                int id = await _evaluationService
                    .AddEvaluation(dto);

                return Ok(new
                {
                    success = true,
                    message = "Evaluation added successfully",
                    evaluationId = id
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine("========== ADD EVALUATION ERROR ==========");
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);

                if (ex.InnerException != null)
                {
                    Console.WriteLine("INNER EXCEPTION:");
                    Console.WriteLine(ex.InnerException.Message);
                }

                Console.WriteLine("==========================================");

                return StatusCode(500, new
                {
                    message = "An error occurred while adding evaluation.",
                    error = ex.Message,
                    innerError = ex.InnerException?.Message
                });
            }
        }


        [HttpGet("getAllEvaluation")]
        public async Task<IActionResult> GetAllEvaluation()
        {
            try
            {
                var result = await _evaluationService
                    .GetAllEvaluations();

                return Ok(new
                {
                    success = true,
                    data = result
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    success = false,
                    Message = "An error occurred while getting all evaluations.",
                    error = ex.Message
                });
            }
        }



        [HttpGet("getEvaluationById/{id}")]
        public async Task<IActionResult> GetEvaluationById(
            int id)
        {
            try
            {
                var result = await _evaluationService
                    .GetEvaluationById(id);

                if (result == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Evaluation not found"
                    });
                }

                return Ok(new
                {
                    success = true,
                    data = result
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    success = false,
                    Message = "An error occurred while getting evaluation.",
                    error = ex.Message
                });
            }
        }



        [HttpPut("updateEvaluation/{id}")]
        public async Task<IActionResult> UpdateEvaluation(
            int id,
            [FromBody] AddEvaluationDto dto)
        {
            try
            {
                bool result = await _evaluationService
                    .UpdateEvaluation(id, dto);

                if (!result)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Evaluation not found"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Evaluation updated successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    success = false,
                    Message = "An error occurred while updating evaluation.",
                    error = ex.Message
                });
            }
        }



        [HttpDelete("deleteEvaluation/{id}")]
        public async Task<IActionResult> DeleteEvaluation(
            int id)
        {
            try
            {
                bool result = await _evaluationService
                    .DeleteEvaluation(id);

                if (!result)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Evaluation not found"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Evaluation deleted successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    success = false,
                    Message = "An error occurred while deleting evaluation.",
                    error = ex.Message
                });
            }
        }


   

        [HttpGet("nextTask/{studentProjectId}")]
        public async Task<IActionResult> GetNextTask(
            int studentProjectId)
        {
            try
            {
                var result = await _evaluationService
                    .GetNextEvaluationTask(studentProjectId);

                if (result == null)
                {
                    return Ok(new
                    {
                        success = true,
                        completed = true,
                        message = "All tasks have been evaluated",
                        data = (object?)null
                    });
                }

                return Ok(new
                {
                    success = true,
                    completed = false,
                    data = result
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    success = false,
                    Message = "An error occurred while getting student project evaluations.",
                    error = ex.Message
                });
            }
        }
        [HttpPut("updateStudentProjectStatus/{studentProjectId}")]
        public async Task<IActionResult> UpdateStudentProjectStatus(int studentProjectId)
        {
            var result = await _evaluationService.UpdateStudentProjectStatus(studentProjectId);

            if (!result)
            {
                return BadRequest(new
                {
                    message = "Failed to update student project status."
                });
            }

            return Ok(new
            {
                message = "Student project status updated successfully."
            });
        }
    }
}