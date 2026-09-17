
using backend.AppExceptions;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

public class ProjectAccessService : IProjectAccessService
{
    
    private readonly AppDbContext _context;

    public ProjectAccessService(AppDbContext context) => _context = context;

    public async Task<ProjectMember> GetMembershipOrThrowAsync(Guid userId, Guid projectId)
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
        return membership ?? throw new NotFoundException("Proyecto no encontrado");
    }

    public void EnsureCanEdit(ProjectMember membership)
    {
        if(membership.Role == ProjectRole.Viewer)
            throw new ForbiddenException("No tienes permiso de edicion en este proyecto");
    }

    public void EnsureIsOwner(ProjectMember membership)
    {
        if(membership.Role != ProjectRole.Owner)
            throw new ForbiddenException("Solo el Owner puede hacer esta accion");
    }



}