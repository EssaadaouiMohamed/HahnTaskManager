
using TaskManager.Domain.Enums;

namespace TaskManager.Domain.Entities;

public class WorkItem
{
    public Guid Id { get; private set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }
    public Priority Priority { get; set; } = Priority.Medium;
    public WorkItemStatus Status { get; set; } = WorkItemStatus.ToDo;

    // Foreign key
    public Guid? AssigneeId { get; set; }

    // Navigation properties
    public User? Assignee { get; set; }
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();

    // Domain method
    public void ChangeStatus(WorkItemStatus newStatus)
    {
        if (Status == newStatus) return;
        Status = newStatus;
        // Raise domain event if needed
    }
}