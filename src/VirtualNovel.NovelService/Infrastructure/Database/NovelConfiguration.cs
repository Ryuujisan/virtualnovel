using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VirtualNovel.NovelService.Entities;

namespace VirtualNovel.NovelService.Infrastructure.Database;

public class NovelConfiguration
                : IEntityTypeConfiguration<Novel>
{
    public void Configure(EntityTypeBuilder<Novel> builder)
    {
        builder.HasKey(n => n.Id);
        builder.Property(n => n.Name).HasMaxLength(100).IsRequired();
        builder.Property(n => n.Description).IsRequired();
        
        builder
            .HasMany(x => x.Chapters)
            .WithOne(x => x.Novel)
            .HasForeignKey(x => x.NovelId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}