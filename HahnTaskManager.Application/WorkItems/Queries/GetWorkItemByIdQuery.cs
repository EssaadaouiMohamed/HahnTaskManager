using HahnTaskManager.Application.Dtos.Responses;
using MediatR;

namespace HahnTaskManager.Application.WorkItems.Queries
{
    public record GetWorkItemByIdQuery(Guid Id) : IRequest<WorkItemDetailDto>;
}
