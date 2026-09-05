using Microsoft.AspNetCore.Identity;

namespace backend.Models;

public class User: IdentityUser<Guid>
{
    public string DisplayName{get; set;} = string.Empty;
    public DateTime CreatedAt{get; set;} = DateTime.UtcNow;
    
    public ICollection<Project> OwnedProjects { get; set; } = new List<Project>();

    

}
