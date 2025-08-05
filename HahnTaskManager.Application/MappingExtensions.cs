using HahnTaskManager.Application.Dtos.Responses;
using TaskManager.Domain.Entities;

namespace HahnTaskManager.Application
{
    public static class MappingExtensions
    {
        public static UserDto ToDto(this User user)
        {
            return new UserDto(
                user.Id,
                user.Email,
                user.FirstName,
                user.LastName,
                user.Position);
        }

        public static CommentDto ToDto(this Comment comment)
        {
            return new CommentDto(
                comment.Id,
                comment.Text,
                comment.CreatedAt,
                comment.Author.ToDto());
        }

        public static WorkItemDetailDto ToDetailDto(this WorkItem workItem)
        {
            return new WorkItemDetailDto(
                workItem.Id,
                workItem.Title,
                workItem.Description,
                workItem.DueDate,
                workItem.Priority,
                workItem.Status,
                workItem.Assignee?.ToDto(),
                workItem.Comments.Select(c => c.ToDto()).ToList());
        }

        public static WorkItemDto ToDto(this WorkItem workItem)
        {
            return new WorkItemDto(
                workItem.Id,
                workItem.Title,
                workItem.Description,
                workItem.DueDate,
                workItem.Priority,
                workItem.Status,
                workItem.AssigneeId,
                workItem.Assignee != null ? workItem.Assignee.FirstName + " " + workItem.Assignee.LastName : null);
        }
    }
}
