using System.ComponentModel.DataAnnotations;

namespace HahnTaskManager.Application.Dtos.Requests
{
    public record LoginDto(
    [Required][EmailAddress] string Email,
    [Required][MinLength(8)] string Password);
}
