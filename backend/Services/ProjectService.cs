

using backend.DTOs.Requests.ProjectRequests;
using backend.DTOs.Responses.ProjectResponses;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using backend.Data;

public class ProjectService : IProjectService
{
    
    private readonly AppDbContext _context;
    public ProjectService(AppDbContext context) => context = _context;

    public async Task<ProjectResponse> CreateAsync(Guid userId, CreateProjectRequest request)
    {
        
        //crear el proyecto base
        var project = new Project
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            OwnerId = userId
        };

        //agreagr el project member como miembro inicial
        project.Members.Add(new ProjectMember
        {
            ProjectId = project.Id,
            UserId = userId,
            Role = ProjectRole.Owner

        });

        //Agregar projectos al set de proyectos y guardar cambios
        _context.Projects.Add(project);
        await _context.SaveChangesAsync();

        return MapToResponse(project, ProjectRole.Owner);

    }

    public async Task<List<ProjectResponse>> GetMyProjectsAsync(Guid userId)
    {   
        //obtiene todos PM donde esta el userId, incluye sus proyectos si se encuentra,
        // los ordena por fecha de actualizacion y los lista
        var memberships = await _context.ProjectMembers
            .Where(pm => pm.UserId == userId)
            .Include(pm => pm.Project)
            .OrderByDescending(pm => pm.Project.UpdatedAt)
            .ToListAsync();
        
        return memberships
                .Select(pm => MapToResponse(pm.Project, pm.Role))
                .ToList();
                        
    }

    public async Task<ProjectResponse> GetByIdAsync(Guid userId, Guid projectId)
    {
        var membership = await GetMembershipOrThrowAsync(userId, projectId);

        return MapToResponse(membership.Project, membership.Role);
        
    }

    public async Task<ProjectResponse> UpdateAsync(Guid userId, Guid projectId, UpdateProjectRequest request)
    {
        
        var membership = await GetMembershipOrThrowAsync(userId, projectId);

        if(membership.Role != ProjectRole.Owner)
            throw new UnauthorizedAccessException("Solo el creador puede renombrar el proyecto");
        
        membership.Project.Name = request.Name;
        membership.Project.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToResponse(membership.Project, membership.Role);

    }

    public async Task DeleteAsync(Guid userId, Guid projectId)
    {
        
        var membership = await GetMembershipOrThrowAsync(userId, projectId);

        if(membership.Role != ProjectRole.Owner )
            throw new UnauthorizedAccessException("Solo el creador puede borrar proyectos");
        
        _context.Projects.Remove(membership.Project);
        await _context.SaveChangesAsync();

    }

    //Metodo para obtener
    private async Task<ProjectMember> GetMembershipOrThrowAsync(Guid userId, Guid projectId)
    {
        //el filtro primero busca el primer registro de ProjectMembers donde:
        // --> ProjectId coincide con project
        // --> UserId coincide con userId
        // --> o sea, donde se encuentre el project member especifico
        // luego de eso, si si encuentra el Project member(el cual es cargado), dice
        // --> incluye tambien su proyecto relacionado
        //, haciendo que igual se cargue el registro del proyecto en el EF(sin esa linea solo)
        // se cargaria ProjectMember
        var membership = await _context.ProjectMembers
                .Include(pm => pm.Project)
                .FirstOrDefaultAsync(pm => pm.ProjectId == projectId && pm.UserId == userId);
        
        //404, si el proyecto no existe o si si existe pero no tiene permiso dice que "no lo encontro"
        return membership ?? throw new KeyNotFoundException("Proyecto no encontrado");
    }

    private static ProjectResponse MapToResponse(Project project, ProjectRole role) => new(){
        Id = project.Id,
        Name = project.Name,
        OwnerId = project.OwnerId,
        MyRole = role,
        CreatedAt = project.CreatedAt,
        UpdatedAt = project.UpdatedAt
    };

}