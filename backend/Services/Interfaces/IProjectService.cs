
using backend.DTOs.Requests.ProjectRequests;
using backend.DTOs.Responses.ProjectResponses;
using backend.Models;

//Interface to ProjectService
public interface IProjectService
{
    Task<ProjectResponse> CreateAsync(Guid userId, CreateProjectRequest request);
    Task<List<ProjectResponse>> GetMyProjectsAsync(Guid userId);
    Task<ProjectResponse> GetByIdAsync(Guid userId, Guid projectId);
    Task<ProjectResponse> UpdateAsync(Guid userId, Guid projectId,UpdateProjectRequest request);
    Task DeleteAsync(Guid userId, Guid projectId);

}