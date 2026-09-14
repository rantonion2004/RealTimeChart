using Microsoft.AspNetCore.Identity;

namespace backend.Models;

public class Project
{
    
    public Guid Id {get;set;}
    public string Name {get; set;} = string.Empty;
    public Guid OwnerId {get; set;}
    public DateTime CreatedAt {get; set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get; set;} = DateTime.UtcNow;

    public ApplicationUser Owner {get; set;} = null!;

    public ICollection<ProjectMember> Members {get; set;} = new List<ProjectMember>();
    
    public ICollection<Diagram> Diagrams {get; set;} = new List<Diagram>();

}