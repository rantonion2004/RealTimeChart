
using backend.Models;

namespace backend.DTOs.Responses.ProjectResponses
{

    public class ProjectResponse
    {
        public Guid Id {get; set;}
        public string Name {get; set;} = string.Empty;
        public Guid OwnerId{get; set;}
        public ProjectRole MyRole {get; set;} //rol del usuario que hizo el request
        public DateTime CreatedAt {get; set;}
        public DateTime UpdatedAt {get; set;}

    }


}