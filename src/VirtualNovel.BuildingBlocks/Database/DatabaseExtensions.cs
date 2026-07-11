using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace VirtualNovel.BuildingBlocks.Database;

public static class DatabaseExtensions
{
    public static IServiceCollection AddPostgresql<T>(
        this IServiceCollection services,
        IConfiguration configuration)
        where T : DbContext
    {
        var connectionString =
            configuration.GetConnectionString("Database")
            ?? throw new InvalidOperationException(
                "Connection string 'Database' is missing.");
        
        
        services.AddDbContext<T>(options =>
            options.UseNpgsql(connectionString));
        
        return services;
    }
}
