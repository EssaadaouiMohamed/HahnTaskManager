using HahnTaskManager.Application.Dtos.Responses;
using HahnTaskManager.Application.Validation;
using System.ComponentModel.DataAnnotations;
using TaskManager.Domain.Enums;

namespace TaskManager.Application.Dtos.Requests
{
    public record CreateUpdateWorkItemDto(
    [Required][MaxLength(100)] string Title,
    [MaxLength(500)] string? Description,
    [Required] DateTime DueDate,
    [Required] Priority Priority,
    [Required] WorkItemStatus Status,
    Guid? AssigneeId,
    Guid? Id = null,
    List<CommentDto>? Comments = null); 
}
