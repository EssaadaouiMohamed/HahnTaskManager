
using MediatR;
using TaskManager.Application.Dtos.Requests;

namespace HahnTaskManager.Application.WorkItems.Commands
{
    public record CreateWorkItemCommand(
    CreateUpdateWorkItemDto Dto) : IRequest<Guid>;
}
