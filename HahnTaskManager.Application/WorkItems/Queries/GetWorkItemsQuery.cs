using HahnTaskManager.Application.Dtos.Responses;
using MediatR;
using TaskManager.Domain.Entities;

namespace HahnTaskManager.Application.WorkItems.Queries
{
    public class GetWorkItemsQuery : BaseQuery<WorkItem>, IRequest<PaginatedResult<WorkItemDto>>;
}
