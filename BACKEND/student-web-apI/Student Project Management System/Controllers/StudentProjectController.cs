using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using student_Project_Managment_System.Dto.StudentProject;
using student_Project_Managment_System.DTOs;
using student_Project_Managment_System.Services.Interface;
using System.Security.Claims;

namespace student_Project_Managment_System.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentProjectController : ControllerBase
    {
        private readonly IStudentProjectService _studentProjectService;

        public StudentProjectController(
            IStudentProjectService studentProjectService)
        {
            _studentProjectService = studentProjectService;
        }




        [Authorize(Roles = "Student")]
        [HttpPost("Apply")]
        public async Task<IActionResult> ApplyStudentProject(
        [FromBody] StudentProjectDto dto)
        {
            try
            {
                var userIdClaim =
                    User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userIdClaim))
                {
                    return Unauthorized(new
                    {
                        Success = false,
                        Message = "User ID not found in token."
                    });
                }

                if (!int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new
                    {
                        Success = false,
                        Message = "Invalid user ID in token."
                    });
                }

                var result =
                    await _studentProjectService
                        .ApplyStudentProject(dto, userId);

                if (result == null)
                {
                    return BadRequest(new
                    {
                        Success = false,
                        Message = "Unable to apply for project."
                    });
                }

                return Ok(new
                {
                    Success = true,
                    Message = "Project applied successfully.",
                    Data = result
                });
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(
                    "already applied",
                    StringComparison.OrdinalIgnoreCase))
                {
                    return Conflict(new
                    {
                        Success = false,
                        Message = "You have already applied for this project."
                    });
                }

                return StatusCode(500, new
                {
                    Success = false,
                    Message = "An error occurred while applying for project.",
                    Error = ex.Message
                });
            }
        }



        [HttpGet]
        public async Task<IActionResult> GetAllStudentProjects()
        {
            try
            {
                var result =
                    await _studentProjectService
                        .GetAllStudentProject();

                return Ok(new
                {
                    Success = true,
                    Data = result
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    Success = false,
                    Message = ex.Message
                });
            }
        }


        

       
        [HttpGet("{studentId}")]
        public async Task<IActionResult> GetStudentProjectsByStudentId(
            int studentId)
        {
            try
            {
                var result =
                    await _studentProjectService
                        .GetStudentProjectsByStudentId(studentId);

                return Ok(new
                {
                    Success = true,
                    Data = result
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    Success = false,
                    Message = ex.Message
                });
            }
        }


       

        [Authorize(Roles = "Faculty")]
        [HttpPut("Approve/{studentProjectId}")]
        public async Task<IActionResult> ApproveStudentProject(
            int studentProjectId)
        {
            try
            {
                var userIdClaim =
                    User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userIdClaim))
                {
                    return Unauthorized(new
                    {
                        Success = false,
                        Message = "User ID not found in token."
                    });
                }

                if (!int.TryParse(userIdClaim, out int facultyUserId))
                {
                    return Unauthorized(new
                    {
                        Success = false,
                        Message = "Invalid user ID in token."
                    });
                }

                if (studentProjectId <= 0)
                {
                    return BadRequest(new
                    {
                        Success = false,
                        Message = "Invalid Student Project ID."
                    });
                }

                bool result =
                    await _studentProjectService
                        .ApproveStudentProject(
                            studentProjectId,
                            facultyUserId
                        );

                if (!result)
                {
                    return BadRequest(new
                    {
                        Success = false,
                        Message = "Approval failed."
                    });
                }

                return Ok(new
                {
                    Success = true,
                    Message = "Student project approved successfully."
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    Success = false,
                    Message = ex.Message
                });
            }
        }


        [Authorize(Roles = "Faculty")]
        [HttpPut("Reject/{studentProjectId}")]
        public async Task<IActionResult> RejectStudentProject(
            int studentProjectId)
        {
            try
            {
                var userIdClaim =
                    User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userIdClaim))
                {
                    return Unauthorized(new
                    {
                        Success = false,
                        Message = "User ID not found in token."
                    });
                }

                if (!int.TryParse(userIdClaim, out int facultyUserId))
                {
                    return Unauthorized(new
                    {
                        Success = false,
                        Message = "Invalid user ID in token."
                    });
                }

                if (studentProjectId <= 0)
                {
                    return BadRequest(new
                    {
                        Success = false,
                        Message = "Invalid Student Project ID."
                    });
                }

                bool result =
                    await _studentProjectService
                        .RejectStudentProject(
                            studentProjectId,
                            facultyUserId
                        );

                if (!result)
                {
                    return BadRequest(new
                    {
                        Success = false,
                        Message = "Rejection failed."
                    });
                }

                return Ok(new
                {
                    Success = true,
                    Message = "Student project rejected successfully."
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    Success = false,
                    Message = ex.Message
                });
            }
        }



        [Authorize]
        [HttpPut("AssignCoordinator/{studentProjectId}")]
        public async Task<IActionResult> AssignCoordinator(
            int studentProjectId,
            [FromQuery] int coordinatorId)
        {
            try
            {
                if (studentProjectId <= 0)
                {
                    return BadRequest(new
                    {
                        Success = false,
                        Message = "Invalid Student Project ID."
                    });
                }

                if (coordinatorId <= 0)
                {
                    return BadRequest(new
                    {
                        Success = false,
                        Message = "Invalid Coordinator ID."
                    });
                }

                bool result =
                    await _studentProjectService
                        .AssignCoordinator(
                            studentProjectId,
                            coordinatorId
                        );

                if (!result)
                {
                    return BadRequest(new
                    {
                        Success = false,
                        Message = "Coordinator assignment failed."
                    });
                }

                return Ok(new
                {
                    Success = true,
                    Message = "Coordinator assigned successfully."
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    Success = false,
                    Message = ex.Message
                });
            }
        }


        [HttpPut("updateStudentProject")]
        public async Task<IActionResult> UpdateStudentProject(
            [FromBody] UpdateStudentProjectDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Invalid update data.",
                    errors = ModelState
                });
            }

            try
            {
                bool result =
                    await _studentProjectService
                        .UpdateStudentProject(dto);

                if (!result)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Student project not found or update failed."
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Student project updated successfully."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        [HttpDelete("deleteStudentProject/{studentId}")]
        public async Task<IActionResult> DeleteStudentProject(
    int studentId)
        {
            if (studentId <= 0)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Invalid Student ID."
                });
            }

            try
            {
                bool result =
                    await _studentProjectService
                        .DeleteStudentProject(studentId);

                if (!result)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Student project not found or delete failed."
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Student project deleted successfully."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }
    }
}


            
       