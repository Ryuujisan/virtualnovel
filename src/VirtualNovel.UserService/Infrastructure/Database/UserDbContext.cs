using Microsoft.EntityFrameworkCore;
using VirtualNovel.IdentityService.Entities;

namespace VirtualNovel.IdentityService.Infrastructure.Database;

public sealed class UserDbContext(
    DbContextOptions<UserDbContext> options)
    : DbContext(options)
{
    public DbSet<UserProfile> Users => Set<UserProfile>();
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(UserDbContext).Assembly);
    }
}