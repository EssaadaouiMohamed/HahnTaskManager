// Domain/Entities/Comment.cs
namespace TaskManager.Domain.Entities;

public class Comment
{
    public Guid Id { get; private set; }
    public string Text { get; set; } = string.Empty;
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;  

    // Foreign keys
    public Guid WorkItemId { get; set; }
    public Guid AuthorId { get; set; }

    // Navigation properties
    public WorkItem WorkItem { get; set; } = null!;
    public User Author { get; set; } = null!;
}