

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs.Responses;
using backend.DTOs.Responses.ProjectResponses;
using backend.DTOs.Requests.ProjectRequests;
using backend.Models;
using backend.Extenions;



[Route("/api/projects")]
[ApiController]
[Authorize]
public class ProjectsController : ControllerBase
{

    private readonly IProjectService _projectService;

    public ProjectsController(IProjectService projectService) 
            => _projectService = projectService;
    
    [HttpPost]
    public async Task<ActionResult<ProjectResponse>> Create(CreateProjectRequest request)
    {
        var result = await _projectService.CreateAsync(User.GetUserId(), request);

        return Ok(result);
    }

    [HttpGet]
    public async Task<ActionResult<List<ProjectResponse>>> GetMyProjects()
        => Ok(await _projectService.GetMyProjectsAsync(User.GetUserId()));

    [HttpGet("{projectId}")]
    public async Task<ActionResult<ProjectResponse>> GetById(Guid projectId)
        => Ok(await _projectService.GetByIdAsync(User.GetUserId(), projectId));
    
    [HttpPut("{projectId}")]
    public async Task<ActionResult<ProjectResponse>> Update(Guid projectId, UpdateProjectRequest request)
        => Ok(await _projectService.UpdateAsync(User.GetUserId(), projectId, request));
    
    [HttpDelete("{projectId}")]
    public async Task<IActionResult> Delete(Guid projectId)
    {
        await _projectService.DeleteAsync(User.GetUserId(), projectId);
        return NoContent();
    }

}