using Microsoft.EntityFrameworkCore;
using VirtualNovel.NovelService.Entities;

namespace VirtualNovel.NovelService.Infrastructure.Database;

public class NovelDbContext(DbContextOptions<NovelDbContext> options) : DbContext(options)
{
    public DbSet<Novel> Novels { get; set; }
    public DbSet<Chapter> Chapters { get; set; }
    public DbSet<Rating> Ratings { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(NovelDbContext).Assembly);
    }
}