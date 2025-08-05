using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HahnTaskManager.Application.Dtos.Responses
{
    public record UserDto(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    string Position);
}
