using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using student_Project_Managment_System.Dto.StatusMaster;
using student_Project_Managment_System.Models;
using student_Project_Managment_System.Services.Interface;
using student_Project_Managment_System.Services.Service;

namespace student_Project_Managment_System.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatusMasterController : ControllerBase
    {
        private readonly IStatusMasterService _statusMaster;

        public StatusMasterController(IStatusMasterService statusMaster)
        {
            _statusMaster = statusMaster;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllStatusMaster()
        {
            try
            {
                var staus = await _statusMaster.GetAllStatusMaster();
                return Ok(staus);
             }
            catch(Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while getting all status.",
                    error = ex.Message
                });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetStatusMasterById(int id)
        {
            try
            {
                var status = await _statusMaster.GetStatusMasterById(id);
                return Ok(status);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while getting the status.",
                    error = ex.Message
                });

            }
        }

        [HttpPost]
        public async Task<IActionResult> AddStatusMaster(StatusMasterDto statusMasterDto)
        {
            try
            {
                var status = await _statusMaster.AddStatusMaster(statusMasterDto);
                return Ok(status);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while aedding status.",
                    error = ex.Message
                });

            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStatusMaster(StatusMasterDto statusMasterDto,int id)
        {
            try
            {
                var status =  await _statusMaster.UpdateStatusMaster(statusMasterDto, id);
                return Ok(status);
            }

            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while updating  status.",
                    error = ex.Message
                });

            }

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveStatusMaster(int id)
        {
            try
            {
                var status = await _statusMaster.RemoveStatusMaster(id);
                return Ok(status);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while removing  status.",
                    error = ex.Message
                });

            }
        }
    }
}
