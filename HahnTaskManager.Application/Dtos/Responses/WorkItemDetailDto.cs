using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManager.Domain.Enums;

namespace HahnTaskManager.Application.Dtos.Responses
{
    public record WorkItemDetailDto(
    Guid Id,
    string Title,
    string? Description,
    DateTime DueDate,
    Priority Priority,
    WorkItemStatus Status,
    UserDto? Assignee,
    List<CommentDto> Comments);
}
