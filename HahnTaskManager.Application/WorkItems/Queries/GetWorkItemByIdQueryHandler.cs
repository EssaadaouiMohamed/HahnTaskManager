using HahnTaskManager.Application.Dtos.Responses;
using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskManager.Domain.Entities;
using TaskManager.Infrastructure.Data;

namespace HahnTaskManager.Application.WorkItems.Queries
{
    public class GetWorkItemByIdQueryHandler
    : IRequestHandler<GetWorkItemByIdQuery, WorkItemDetailDto>
    {
        private readonly AppDbContext _context;

        public GetWorkItemByIdQueryHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<WorkItemDetailDto> Handle(
            GetWorkItemByIdQuery query,
            CancellationToken ct)
        {
            var workItem = await _context.WorkItems
            .Include(w => w.Assignee)
            .Include(w => w.Comments)
                .ThenInclude(c => c.Author)
            .AsNoTracking()
            .FirstOrDefaultAsync(w => w.Id == query.Id, ct);

            if (workItem is null)
                return null;

            // Manual mapping to DTO
            return workItem.ToDetailDto();
        }
    }
}
