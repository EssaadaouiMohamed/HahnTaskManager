using TaskManager.Application.Dtos.Requests;
using MediatR;

namespace HahnTaskManager.Application.WorkItems.Commands
{
    public record UpdateWorkItemCommand(
    Guid WorkItemId,
    CreateUpdateWorkItemDto Dto) : IRequest<Unit>;
}
