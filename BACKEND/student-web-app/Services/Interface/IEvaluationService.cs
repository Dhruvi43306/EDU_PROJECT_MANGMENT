using Microsoft.AspNetCore.Mvc;
using student_Project_Managment_System.DTOs;

namespace student_Project_Managment_System.Services.Interfaces
{
    public interface IEvaluationService
    {
        Task<int> AddEvaluation(AddEvaluationDto dto);

        Task<EvaluationDto?> GetEvaluationById(int evaluationId);

        Task<List<EvaluationDto>> GetAllEvaluations();

        Task<bool> UpdateEvaluation(int evaluationId, AddEvaluationDto dto);

        Task<bool> DeleteEvaluation(int evaluationId);

        Task<NextEvaluationTaskDto?> GetNextEvaluationTask(int studentProjectId);

        Task<bool> UpdateStudentProjectStatus(int studentProjectId);
    }
}