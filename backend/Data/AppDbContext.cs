using Microsoft.EntityFrameworkCore;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;


namespace backend.Data;

public class AppDbContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
{

    public AppDbContext(DbContextOptions<AppDbContext> options): base(options){}

    public DbSet<Project> Projects => Set<Project>();
    public DbSet<ProjectMember> ProjectMembers => Set<ProjectMember>();
    public DbSet<Diagram> Diagrams => Set<Diagram>();


    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);// necesario para que Identity configure sus tablas
        
        //con esto hace que la configuracion se escaneen todas las clases
        //que tienen IEntityTypeConfiguration para que las aplique automaticamente
        builder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }


}