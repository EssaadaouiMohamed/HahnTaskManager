using HahnTaskManager.Application.Dtos.Responses;
using MediatR;
using TaskManager.Domain.Entities;
using TaskManager.Domain.Enums;
using TaskManager.Infrastructure.Data;

namespace HahnTaskManager.Application.WorkItems.Commands
{
    public class CreateWorkItemCommandHandler : IRequestHandler<CreateWorkItemCommand, Guid>
    {
        private readonly AppDbContext _context;

        public CreateWorkItemCommandHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Guid> Handle(
        CreateWorkItemCommand command,
        CancellationToken ct)
        {
            var workItem = new WorkItem
            {
                Title = command.Dto.Title,
                Description = command.Dto.Description,
                DueDate = command.Dto.DueDate,
                Priority = command.Dto.Priority,
                Status = WorkItemStatus.ToDo, // Default status
                AssigneeId = command.Dto.AssigneeId
            };

            await _context.WorkItems.AddAsync(workItem, ct);
            await _context.SaveChangesAsync(ct);

            // Manual mapping back to DTO
            return workItem.Id;
        }
    }
}
