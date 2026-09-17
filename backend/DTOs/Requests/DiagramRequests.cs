
namespace backend.DTOs.Requests.DiagramRequests
{
    
    public class CreateDiagramRequest
    {
        public string Name {get; set;} = string.Empty;
    }

    public class UpdateDiagramNameRequest
    {
        public string Name {get; set;} = string.Empty;
    }

    public class UpdateDiagramRequest
    {
        public string Name {get; set;} = string.Empty;  
        public string Content {get; set;} = string.Empty;
        public string RowVersion {get; set;} = string.Empty;

    }

}