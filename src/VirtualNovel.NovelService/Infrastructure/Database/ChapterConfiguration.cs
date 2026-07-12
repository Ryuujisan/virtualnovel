using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VirtualNovel.NovelService.Entities;

namespace VirtualNovel.NovelService.Infrastructure.Database;

public class ChapterConfiguration 
        :IEntityTypeConfiguration<Chapter>
{
        public void Configure(EntityTypeBuilder<Chapter> builder)
        {
                builder.HasKey(x => x.Id);
                builder.Property(x => x.NovelId).IsRequired();
                builder.Property(x => x.Name).HasMaxLength(128);
                builder.Property(x => x.Description).HasMaxLength(1024);
                builder.Property(x => x.Content).IsRequired();
                
                
        }
}