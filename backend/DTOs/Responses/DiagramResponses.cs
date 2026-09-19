using backend.Models;

namespace backend.DTOs.Responses.DiagramResponses
{
    
    //Its for the diagrams list in the preview
    public class DiagramSummaryResponse {
        public Guid Id {get; set;}
        public string Name {get; set;} = string.Empty;
        public DateTime UpdatedAt { get; set;} 

        public static DiagramSummaryResponse MapFrom(Diagram diagram) => new()
        {
            Id = diagram.Id,
            Name = diagram.Name,
            UpdatedAt = diagram.UpdatedAt,
        };

        public static DiagramSummaryResponse MapFrom(Guid xid, string xname, DateTime xupdatedAt) => new()
        {
            Id = xid,
            Name = xname,
            UpdatedAt = xupdatedAt,
        };

    }

    //is for the diagram whole response
    public class DiagramResponse
    {
        public Guid Id {get; set;}
        public Guid ProjectId {get; set;}
        public string Name {get;set;} = string.Empty;
        public string Content {get; set;} = string.Empty;
        public DateTime UpdatedAt {get;set;}
        public string RowVersion {get;set;} = string.Empty;

        public static DiagramResponse MapFrom(Diagram diagram, uint xmin) => new()
        {
            Id = diagram.Id,
            ProjectId = diagram.ProjectId,
            Name = diagram.Name,
            Content = diagram.Content,
            UpdatedAt = diagram.UpdatedAt,
            RowVersion = xmin.ToString()
        };

        public static DiagramResponse MapFrom(
            Guid xid,
            Guid xprojectid,
            string xname,
            string xcontent,
            DateTime xupdatedat,
            uint xmin
        ) => new()
        {
            Id = xid,
            ProjectId = xprojectid,
            Name = xname,
            Content = xcontent,
            UpdatedAt = xupdatedat,
            RowVersion = xmin.ToString()
        };

    }

}