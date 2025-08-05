using TaskManager.Domain.Enums;
using MediatR;
using TaskManager.Domain.Enums;

namespace HahnTaskManager.Application.WorkItems.Commands
{
    public record UpdateWorkItemStatusCommand(Guid WorkItemId, WorkItemStatus NewStatus) : IRequest;
}