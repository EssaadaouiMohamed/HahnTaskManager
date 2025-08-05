using HahnTaskManager.Application;
using HahnTaskManager.Application.Dtos.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Domain.Entities;
namespace HahnTaskManager.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<User> _userManager;

        public UsersController(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        [HttpGet]
        public ActionResult<List<UserDto>> GetAllUsers()
        {
            var users = _userManager.Users
                .Select(user => user.ToDto())
                .ToList();

            return Ok(users);
        }
    }
}
