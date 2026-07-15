using System.Text.Json.Serialization;
using Microsoft.Extensions.DependencyInjection;

namespace VirtualNovel.BuildingBlocks.Serialization;

public static class JsonSerializationExtensions
{
    public static IMvcBuilder AddEnumSerialization(this IMvcBuilder builder)
    {
        return builder.AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.Converters.Add(
                new JsonStringEnumConverter());
        });
    }
}
