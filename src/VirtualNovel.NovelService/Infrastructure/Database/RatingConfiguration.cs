using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VirtualNovel.NovelService.Entities;

namespace VirtualNovel.NovelService.Infrastructure.Database;

public class RatingConfiguration 
                :IEntityTypeConfiguration<Rating>
{
    public void Configure(EntityTypeBuilder<Rating> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.UserId).IsRequired();
        builder.Property(x => x.NovelId).IsRequired();
        
        builder.HasIndex(x => new
            {
                x.UserId,
                x.NovelId
            })
            .IsUnique();
    }
}