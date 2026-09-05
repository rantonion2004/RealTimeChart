
using Microsoft.EntityFrameworkCore;
using backend.Models;

using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class DiagramConfiguration: IEntityTypeConfiguration<Diagram>
{
    
    public void Configure(EntityTypeBuilder<Diagram> builder)
    {
        builder.Property(d => d.Name)
            .HasMaxLength(200)
            .IsRequired();
        
        builder.Property(d => d.Content)
            .HasColumnType("jsonb");
        
        builder.Property(d => d.RowVersion)
            .IsRowVersion();
        
        builder.Property(d => d.CreatedAt)
            .HasDefaultValueSql("now()");
        
        builder.HasOne(d => d.Project)
            .WithMany(p => p.Diagrams)
            .HasForeignKey(d => d.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}