using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace VirtualNovel.BuildingBlocks.Authentication;

public static class AuthenticationExtensions
{
    public static IServiceCollection AddFirebaseAuthentication(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services
            .AddAuthentication("Bearer")
            .AddJwtBearer("Bearer", options =>
            {
                options.Authority =
                    $"https://securetoken.google.com/{configuration["Firebase:ProjectId"]}";

                options.TokenValidationParameters =
                    new()
                    {
                        ValidateIssuer = true,
                        ValidIssuer =
                            $"https://securetoken.google.com/{configuration["Firebase:ProjectId"]}",

                        ValidateAudience = true,
                        ValidAudience = configuration["Firebase:ProjectId"],

                        ValidateLifetime = true,
                        
                        // Dodatkowy bezpiecznik dla Firebase
                        ValidateIssuerSigningKey = true
                    };
            });

        services.AddAuthorization();

        services.AddHttpContextAccessor();
        services.AddScoped<ICurrentUser, CurrentUser>();

        return services;
    }
}