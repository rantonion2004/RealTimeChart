using backend.DTOs.Requests.DiagramRequests;
using backend.DTOs.Responses.DiagramResponses;

public interface IDiagramService
{
    //create diagram
    Task<DiagramResponse> CreateAsync(Guid userId, Guid projectId, CreateDiagramRequest request);
    //Get diagram of a project
    Task<List<DiagramSummaryResponse>> GetProjectDiagramsAsync(Guid userId, Guid projectId);
    //Get Diagram by Diagram ID and the project id
    Task<DiagramResponse> GetByIdAsync(Guid userId, Guid projectId, Guid diagramId);
    Task<DiagramSummaryResponse> UpdateNameAsync(Guid userId, Guid projectId, Guid diagramId, UpdateDiagramNameRequest request);
    //update the diagram (whole diagram)
    Task<DiagramResponse> UpdateAsync(Guid userId, Guid projectId, Guid diagramId, UpdateDiagramRequest request);
    Task DeleteAsync(Guid userId, Guid projectId, Guid diagramId);
}