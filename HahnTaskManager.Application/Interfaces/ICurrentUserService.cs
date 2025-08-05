
namespace HahnTaskManager.Application.Interfaces
{
    public interface ICurrentUserService
    {
        Guid UserId { get; }
        string Email { get; }
    }
}
