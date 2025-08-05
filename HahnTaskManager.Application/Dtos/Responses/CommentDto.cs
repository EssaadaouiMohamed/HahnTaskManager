using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HahnTaskManager.Application.Dtos.Responses
{
    public record CommentDto(
    Guid? Id,
    [Required][MaxLength(1000)] string Text,
    DateTime? CreatedAt,
    UserDto? Author);
}
