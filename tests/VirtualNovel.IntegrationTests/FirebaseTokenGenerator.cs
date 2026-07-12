using System.Net.Http.Json;
using System.Text.Json.Serialization;

namespace VirtualNovel.IntegrationTests;

public sealed class FirebaseTokenGenerator(HttpClient httpClient, string emulatorHost)
{
    public async Task<FirebaseSession> CreateSessionAsync(
        CancellationToken cancellationToken = default)
    {
        var host = emulatorHost
            .Replace("http://", string.Empty, StringComparison.OrdinalIgnoreCase)
            .Replace("https://", string.Empty, StringComparison.OrdinalIgnoreCase)
            .TrimEnd('/');
        var requestUrl =
            $"http://{host}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key";

        using var response = await httpClient.PostAsJsonAsync(
            requestUrl,
            new { returnSecureToken = true },
            cancellationToken);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<AuthTokenResponse>(
            cancellationToken: cancellationToken);
        return result is null
            ? throw new InvalidOperationException("Firebase emulator did not return a user session.")
            : new FirebaseSession(result.IdToken, result.LocalId);
    }

    private sealed class AuthTokenResponse
    {
        [JsonPropertyName("idToken")]
        public required string IdToken { get; init; }

        [JsonPropertyName("localId")]
        public required string LocalId { get; init; }
    }
}

public sealed record FirebaseSession(string IdToken, string UserId);
