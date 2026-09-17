using backend.Models;

//punto para verificar los permisos del proyecto
public interface IProjectAccessService
{
    Task<ProjectMember> GetMembershipOrThrowAsync(Guid userId, Guid projectId);
    void EnsureCanEdit(ProjectMember membership);
    void EnsureIsOwner(ProjectMember membership);
}