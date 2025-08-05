using HahnTaskManager.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace HahnTaskManager.Application.Services
{
    public class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public Guid UserId =>
            Guid.Parse(_httpContextAccessor.HttpContext?.User?
                .FindFirstValue(ClaimTypes.NameIdentifier) ?? Guid.Empty.ToString());

        public string Email =>
            _httpContextAccessor.HttpContext?.User?
                .FindFirstValue(ClaimTypes.Email) ?? string.Empty;
    }
}
