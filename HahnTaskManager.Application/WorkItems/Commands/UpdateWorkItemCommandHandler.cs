using HahnTaskManager.Application.Dtos.Responses;
using HahnTaskManager.Application.Interfaces;
using TaskManager.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskManager.Domain.Entities;

namespace HahnTaskManager.Application.WorkItems.Commands
{
    // Application/WorkItems/Commands/UpdateWorkItemCommandHandler.cs
    public class UpdateWorkItemCommandHandler : IRequestHandler<UpdateWorkItemCommand, Unit>
    {
        private readonly AppDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public UpdateWorkItemCommandHandler(
            AppDbContext context,
            ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<Unit> Handle(
            UpdateWorkItemCommand command,
            CancellationToken ct)
        {
            // Load work item with comments
            var workItem = await _context.WorkItems
                .Include(w => w.Comments)
                .FirstOrDefaultAsync(w => w.Id == command.WorkItemId, ct);

            if (workItem == null)
                throw new ArgumentException("WorkItem not found");

            // Update core fields
            workItem.Title = command.Dto.Title;
            workItem.Description = command.Dto.Description;
            workItem.DueDate = command.Dto.DueDate;
            workItem.Priority = command.Dto.Priority;
            workItem.Status = command.Dto.Status;
            workItem.AssigneeId = command.Dto.AssigneeId;

            // Comment management
            await HandleComments(workItem, command.Dto.Comments, ct);

            await _context.SaveChangesAsync(ct);
            return Unit.Value;
        }

        private async Task HandleComments(
            WorkItem workItem,
            List<CommentDto> commentDtos,
            CancellationToken ct)
        {
            // Delete comments not in DTO
            var commentsToRemove = workItem.Comments
                .Where(c => !commentDtos.Any(dto => dto.Id == c.Id))
                .ToList();

            _context.Comments.RemoveRange(commentsToRemove);

            // Add/Update comments
            foreach (var commentDto in commentDtos)
            {
                if (commentDto.Id == null)
                {
                    // Add new comment
                    workItem.Comments.Add(new Comment
                    {
                        Text = commentDto.Text,
                        AuthorId = _currentUserService.UserId
                    });
                }
                else
                {
                    // Update existing comment
                    var existingComment = workItem.Comments
                        .FirstOrDefault(c => c.Id == commentDto.Id);

                    if (existingComment != null)
                    {
                        existingComment.Text = commentDto.Text;
                    }
                }
            }
        }
    }
}
