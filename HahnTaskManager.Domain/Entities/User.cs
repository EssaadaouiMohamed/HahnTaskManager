// Domain/Entities/User.cs
using Microsoft.AspNetCore.Identity;

namespace TaskManager.Domain.Entities;

public class User : IdentityUser<Guid>
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty; 

    // Navigation properties
    public ICollection<WorkItem> AssignedWorkItems { get; set; } = new List<WorkItem>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}