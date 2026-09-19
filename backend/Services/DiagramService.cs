

using backend.AppExceptions;
using backend.Data;
using backend.DTOs.Requests.DiagramRequests;
using backend.DTOs.Responses.DiagramResponses;
using backend.Models;
using Microsoft.EntityFrameworkCore;

public class DiagramService : IDiagramService
{
    private readonly AppDbContext _context;

    private readonly IProjectAccessService _access;

    public DiagramService( AppDbContext context, IProjectAccessService access)
    {
        _context = context;
        _access = access;
    }

    public async Task<DiagramResponse> CreateAsync(Guid userId, Guid projectId, CreateDiagramRequest request)
    {   
        var membership = await _access.GetMembershipOrThrowAsync(userId, projectId);

        _access.EnsureCanEdit(membership);

        var diagram = new Diagram
        {
            Id = new Guid(),
            ProjectId = projectId,
            Name = request.Name,
            Project = membership.Project,
            Content = "{\"nodes\":[],\"edges\":[]}"
        };

        _context.Diagrams.Add(diagram);
        await _context.SaveChangesAsync();

        var xmin = _context.Entry(diagram).Property<uint>("xmin").CurrentValue;
        return DiagramResponse.MapFrom(diagram, xmin);

    }

    public async Task<List<DiagramSummaryResponse>> GetProjectDiagramsAsync(Guid userId, Guid projectId)
    {
        
        var membership = await _access.GetMembershipOrThrowAsync(userId, projectId);

        return await _context.Diagrams
                .Where(d => d.ProjectId == projectId)
                .OrderByDescending(d => d.UpdatedAt)
                .Select(d => DiagramSummaryResponse.MapFrom(d))
                .ToListAsync(); 
    }

    public async Task<DiagramResponse> GetByIdAsync(Guid userId, Guid projectId, Guid diagramId)
    {
        
        var membership = await _access.GetMembershipOrThrowAsync(userId, projectId);

        var diagram = await GetDiagramOrThrowAsync(projectId, diagramId );

        var xmin = _context.Entry(diagram).Property<uint>("xmin").CurrentValue;
        return DiagramResponse.MapFrom(diagram, xmin);

    }

    public async Task<DiagramSummaryResponse> UpdateNameAsync(Guid userId, Guid projectId, Guid diagramId, UpdateDiagramNameRequest request)
    {
        
        var membership = await _access.GetMembershipOrThrowAsync(userId, projectId);
        _access.EnsureCanEdit(membership);

        var diagram = await GetDiagramOrThrowAsync(projectId, diagramId);

        diagram.Name = request.Name;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            throw new ConcurrencyConflictException
            ("Este diagrama fue modificado por alguien mas. Recarga y vuelve a intentarlo ");

        }

        return DiagramSummaryResponse.MapFrom(diagram);
    }

    public async Task<DiagramResponse> UpdateAsync(Guid userId, Guid projectId, Guid diagramId, UpdateDiagramRequest request)
    {
        
        
        var membership = await _access.GetMembershipOrThrowAsync(userId, projectId);
        _access.EnsureCanEdit(membership);

        var diagram = await GetDiagramOrThrowAsync(projectId, diagramId);

        diagram.Name = request.Name;
        diagram.Content = request.Content;
        diagram.UpdatedAt = DateTime.UtcNow;

        //Tells EF: "I read this versions --if the DB changed, it is a conflict"
        //How?
        //1: It tells context to take the diagram "following" object
        //(is an object that ocntains info about the object in EF)
        //2: accss the property row version
        //3:It tells that row version to take 
        //its original value as the requester value
        //this is because, in EF(with row version) usually
        //uses the OriginalValue as "Where RowVersion = OriginalValue"
        //so, it will always look for the original value
        //If requester version and the original value 
        //is the same, it means that they are in the same version
        //if it is not the same, the update will try to update "Where Rowversion = a value that is not there"
        //and will change 0 rows.
        //Also, EF only updatess if CurrentValue != OriginalValue

        _context.Entry(diagram)
                .Property<uint>("xmin")
                .OriginalValue = uint.Parse(request.RowVersion);

        

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            throw new ConcurrencyConflictException
            ("Este diagrama fue modificado por alguien mas. Recarga y vuelve a intentar.");
        }

        var xmin = _context.Entry(diagram).Property<uint>("xmin").CurrentValue;

        return DiagramResponse.MapFrom(diagram, xmin);

    }

    public async Task DeleteAsync(Guid userId, Guid projectId, Guid diagramId)
    {
        var membership = await _access.GetMembershipOrThrowAsync(userId, projectId);
        _access.EnsureIsOwner(membership);

        var diagram = await GetDiagramOrThrowAsync(projectId, diagramId);
        _context.Diagrams.Remove(diagram);
        await _context.SaveChangesAsync();
        
    }

    private async Task<Diagram> GetDiagramOrThrowAsync(Guid projectId, Guid diagramId)
    {
        var diagram = await _context.Diagrams
                .FirstOrDefaultAsync( d => d.Id == diagramId && d.ProjectId == projectId);
        
        return diagram ?? throw new NotFoundException("Diagrama no encontrado");
    }

}