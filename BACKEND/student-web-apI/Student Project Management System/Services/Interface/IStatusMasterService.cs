using student_Project_Managment_System.Dto.StatusMaster;

namespace student_Project_Managment_System.Services.Interface
{
    public interface IStatusMasterService
    {
         Task<List<StatusMasterDto>> GetAllStatusMaster();
         Task<StatusMasterDto?> GetStatusMasterById(int id);
         Task<StatusMasterDto?> AddStatusMaster(StatusMasterDto statusMaster);
         Task<StatusMasterDto?> UpdateStatusMaster(StatusMasterDto statusMaster, int id);
         Task<StatusMasterDto?> RemoveStatusMaster(int id);

    }
}
