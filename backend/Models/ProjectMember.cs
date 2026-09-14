namespace backend.Models;

public enum ProjectRole {
    Owner,
    Editor,
    Viewer
}
public class ProjectMember
{

    public Guid ProjectId {get; set;} 
    public Guid UserId {get; set;} 
    
    public ProjectRole Role {get; set;}

    public DateTime JoinedAt {get; set;} = DateTime.UtcNow;

    public Project Project {get; set;} = null!;
    
    public ApplicationUser User {get; set;} = null!;
    
}