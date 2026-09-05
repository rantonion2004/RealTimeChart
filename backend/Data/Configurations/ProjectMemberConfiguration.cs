

using backend.Models;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class ProjectMemberConfiguration : IEntityTypeConfiguration<ProjectMember>
{

    public void Configure(EntityTypeBuilder<ProjectMember> builder)
    {
        builder.HasKey(pm => new {pm.ProjectId, pm.UserId});

        builder.Property(pm => pm.Role)
            .HasConversion<string>()
            .HasMaxLength(20);
        builder.HasOne(pm => pm.Project)
            .WithMany(p => p.Members)
            .HasForeignKey(pm => pm.ProjectId)
            .OnDelete( DeleteBehavior.Cascade);
        
        builder.HasOne(pm => pm.User)
            .WithMany()
            .HasForeignKey( pm => pm.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    
    }

}