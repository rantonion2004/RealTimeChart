namespace backend.Models;

public class Diagram
{

    public Guid Id {get; set;}

    public Guid ProjectId {get; set;}

    public string Name {get; set;} = string.Empty;
    
    //json content that will be passed
    public string Content {get; set;} = "{}";

    //version to manage
    public byte[] RowVersion {get; set;} = null!;

    public DateTime CreatedAt {get; set;} = DateTime.UtcNow;

    public DateTime UpdatedAt {get; set;} = DateTime.UtcNow;

    //a diagram belongs to a project, it is needed to have 
    public Project Project {get; set;} = null!;

}