using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.JsonWebTokens;

namespace VirtualNovel.BuildingBlocks.Authentication;

public static class AuthenticationExtensions
{
    public static IServiceCollection AddFirebaseAuthentication(
        this IServiceCollection services,
        IConfiguration configuration,
        IWebHostEnvironment environment)
    {
        services
            .AddAuthentication("Bearer")
            .AddJwtBearer("Bearer", options =>
            {
                var projectId = configuration["Firebase:ProjectId"]
                    ?? throw new InvalidOperationException("Firebase:ProjectId is missing.");
                var issuer = $"https://securetoken.google.com/{projectId}";
                var useEmulator = environment.IsEnvironment("Testing")
                    && !string.IsNullOrWhiteSpace(
                        configuration["Firebase:AuthenticationEmulatorHost"]);

                if (!useEmulator)
                {
                    options.Authority = issuer;
                }

                options.TokenValidationParameters = new()
                {
                    ValidateIssuer = true,
                    ValidIssuer = issuer,
                    ValidateAudience = true,
                    ValidAudience = projectId,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = !useEmulator,
                    RequireSignedTokens = !useEmulator,
                    SignatureValidator = useEmulator
                        ? (token, _) => new JsonWebToken(token)
                        : null
                };
            });

        services.AddAuthorization();
        services.AddHttpContextAccessor();
        services.AddScoped<ICurrentUser, CurrentUser>();

        return services;
    }
}
