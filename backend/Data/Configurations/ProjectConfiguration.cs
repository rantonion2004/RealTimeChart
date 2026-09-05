

using Microsoft.EntityFrameworkCore;
using backend.Models;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
public class ProjectConfiguration : IEntityTypeConfiguration<Project>
{

    public void Configure(EntityTypeBuilder<Project> builder)
    {
        builder.Property( p => p.Name)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property( p => p.CreatedAt)
            .HasDefaultValueSql("now()");

        builder.HasOne(p =>p.Owner)
            .WithMany(u => u.OwnedProjects)
            .HasForeignKey(p => p.OwnerId)
            .OnDelete(DeleteBehavior.Restrict);
    }

}