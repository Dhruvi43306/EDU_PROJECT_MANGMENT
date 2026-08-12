using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using student_Project_Managment_System.Dto.Project;
using student_Project_Managment_System.Services.Interface;
using System.Security.Claims;

namespace student_Project_Managment_System.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class ProjectController : ControllerBase
    {
        private readonly IProjectService _projectService;
        public ProjectController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProject()
        {
            try
            {
                var projects = await _projectService.GetAllProject();
                return Ok(projects);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while getting the project.",
                    error = ex.Message
                });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProjectById(int id)
        {
            try
            {
                var project = await _projectService.GetProjectById(id);
                return Ok(project);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while geting the Project.",
                    error = ex.Message
                });
            }

        }
        [Authorize(Roles = "Admin,Faculty")]
        [HttpPost]
        public async Task<IActionResult> AddProject([FromBody] ProjectDto dto)
        {
            try
            {
                string? userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userIdClaim))
                {
                    return Unauthorized("UserId not found.");
                }

                int userId = Convert.ToInt32(userIdClaim);


                var result = await _projectService.AddProject(dto, userId);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Success = false,
                    Message = ex.Message
                });
            }
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(UpdateProjectDto projectDto, int id)
        {
            try
            {
                var project = await _projectService.UpdateProject(projectDto,id);
                return Ok(project);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while updating the project.",
                    error = ex.Message
                });
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveProject(int id)
        {
            try
            {
                var project = await _projectService.RemoveProject(id);
                return Ok(project);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while deleting the project.",
                    error = ex.Message
                });
            }
        }

    }
}
