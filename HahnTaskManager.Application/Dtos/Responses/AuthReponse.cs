
namespace HahnTaskManager.Application.Dtos.Responses
{
    public record AuthResponse(
    string Token,
    DateTime Expiry);
}
