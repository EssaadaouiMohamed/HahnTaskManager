using HahnTaskManager.Application.Dtos.Responses;
using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskManager.Infrastructure.Data;

namespace HahnTaskManager.Application.WorkItems.Queries
{
    public class GetWorkItemsQueryHandler
    : IRequestHandler<GetWorkItemsQuery, PaginatedResult<WorkItemDto>>
    {
        private readonly AppDbContext _context;

        public GetWorkItemsQueryHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PaginatedResult<WorkItemDto>> Handle(
            GetWorkItemsQuery query,
            CancellationToken ct)
        {
            // Start with base query
            var baseQuery = _context.WorkItems
                .Include(w => w.Assignee)
                .AsQueryable();

            // Apply filters from BaseQuery
            var filteredQuery = query.Apply(baseQuery);

            // Get total count before pagination
            var totalCount = await filteredQuery.CountAsync(ct);

            // Apply pagination and execute
            var items = await filteredQuery
                .Skip((query.PageNumber - 1) * query.PageSize)
                .Take(query.PageSize)
                .ToListAsync(ct);

            var workItemDtos = items.Select(w => w.ToDto()).ToList();  

            return new PaginatedResult<WorkItemDto>(
                workItemDtos,
                totalCount,
                query.PageNumber,
                query.PageSize
            );
        }
    }
}
