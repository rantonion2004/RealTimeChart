

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs.Responses;
using backend.DTOs.Responses.ProjectResponses;
using backend.DTOs.Requests.ProjectRequests;
using backend.Models;
using backend.Extenions;

[Route("/api/[controller]")]
[ApiController]
[Authorize]
public class ProjectsController
{

    private readonly IProjectService _projectService;

    public ProjectsController(IProjectService projectService) 
            => _projectService = projectService;
    
    [HttpPost]
    public async Task<ActionResult<ProjectResponse>> Create(CreateProjectRequest request)
    {
        var result = await _projectService.CreateAsync(User.GetUserId(), request);

    }

}