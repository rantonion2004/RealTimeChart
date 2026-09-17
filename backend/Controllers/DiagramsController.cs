

using backend.DTOs.Requests.DiagramRequests;
using backend.DTOs.Responses.DiagramResponses;
using backend.Extenions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Models;

[ApiController]
[Route("/api/projects/{projectId}/diagrams")]
[Authorize]
public class DiagramController: ControllerBase
{
    private readonly IDiagramService _diagramService;

    public DiagramController(IDiagramService diagramService) => _diagramService = diagramService;

    [HttpPost]
    
    public async Task<ActionResult<DiagramResponse>> Create(Guid projectId, CreateDiagramRequest request)
    {
        var result = await _diagramService.CreateAsync(User.GetUserId(),projectId, request);
        return CreatedAtAction(nameof(GetById), new {projectId, diagramId = result.Id}, result);
    }

    [HttpGet]
    public async Task<ActionResult<List<DiagramSummaryResponse>>> GetAll(Guid projectId)
        => Ok(await _diagramService.GetProjectDiagramsAsync(User.GetUserId(), projectId));

    [HttpGet("{diagramId}")]
    public async Task<ActionResult<DiagramResponse>> GetById(Guid projectId, Guid diagramId)
        => Ok(await _diagramService.GetByIdAsync(User.GetUserId(), projectId, diagramId));

    [HttpPut("/name/{diagramId}")]
    public async Task<ActionResult<DiagramSummaryResponse>> UpdateName(Guid projectId, Guid diagramId, UpdateDiagramNameRequest request)
        => Ok(await _diagramService.UpdateNameAsync(User.GetUserId(), projectId, diagramId, request));

    [HttpPut("{diagramId}")]
    public async Task<ActionResult<DiagramResponse>> Update(Guid projectId, Guid diagramId, UpdateDiagramRequest request)
        => Ok(await _diagramService.UpdateAsync(User.GetUserId(), projectId, diagramId, request));

    [HttpDelete("{diagramId}")]
    public async Task<IActionResult> Delete(Guid projectId, Guid diagramId)
    {
        await _diagramService.DeleteAsync(User.GetUserId(), projectId, diagramId);
        return NoContent();
    }

}