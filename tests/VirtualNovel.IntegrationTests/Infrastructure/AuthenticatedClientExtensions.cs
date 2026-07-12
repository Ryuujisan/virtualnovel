using System.Net.Http.Headers;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;

namespace VirtualNovel.IntegrationTests.Infrastructure;

public static class AuthenticatedClientExtensions
{
    public static async Task<AuthenticatedTestClient> CreateAuthenticatedClientAsync<TEntryPoint>(
        this WebApplicationFactory<TEntryPoint> factory,
        CancellationToken cancellationToken = default)
        where TEntryPoint : class
    {
        await using var scope = factory.Services.CreateAsyncScope();
        var firebase = scope.ServiceProvider
            .GetRequiredService<FirebaseTokenGenerator>();
        var session = await firebase.CreateSessionAsync(cancellationToken);
        var client = factory.CreateClient();

        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", session.IdToken);

        return new AuthenticatedTestClient(client, session);
    }
}

public sealed record AuthenticatedTestClient(
    HttpClient Client,
    FirebaseSession Session);
