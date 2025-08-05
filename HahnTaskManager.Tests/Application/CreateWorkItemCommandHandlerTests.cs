using HahnTaskManager.Application.WorkItems.Commands;
using HahnTaskManager.Application.Dtos.Requests;
using TaskManager.Domain.Entities;
using TaskManager.Domain.Enums;
using TaskManager.Infrastructure.Data;
using Moq;
using Moq.EntityFrameworkCore;
using TaskManager.Application.Dtos.Requests;
using HahnTaskManager.Application.Dtos.Responses;

namespace HahnTaskManager.Application.Tests.WorkItems.Commands
{
    [TestFixture]
    public class CreateWorkItemCommandHandlerTests
    {
        private Mock<AppDbContext> _mockContext;
        private CreateWorkItemCommandHandler _handler;
        private List<WorkItem> _workItems;

        [SetUp]
        public void Setup()
        {
            // Initialize mock DB context with empty list
            _workItems = new List<WorkItem>();
            _mockContext = new Mock<AppDbContext>();

            // Setup DbSet mock
            _mockContext.Setup(x => x.WorkItems)
                .ReturnsDbSet(_workItems);

            // Setup SaveChangesAsync mock
            _mockContext.Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(1) // 1 entity affected
                .Verifiable();

            _handler = new CreateWorkItemCommandHandler(_mockContext.Object);
        }

        [Test]
        public async Task Handle_ValidCommand_ShouldCreateWorkItem()
        {
            // Arrange
            var command = new CreateWorkItemCommand(
                new CreateUpdateWorkItemDto
                (
                    Title: "Test Work Item",
                    Description: "Test Description",
                    DueDate: DateTime.Now.AddDays(7),
                    Priority: Priority.Medium,
                    AssigneeId: Guid.NewGuid(),
                    Status: WorkItemStatus.ToDo
                ));

            // Act
            var result = await _handler.Handle(command, CancellationToken.None);

            // Assert
            _mockContext.Verify(x => x.WorkItems.AddAsync(
                It.IsAny<WorkItem>(),
                It.IsAny<CancellationToken>()),
                Times.Once);

            _mockContext.Verify(x => x.SaveChangesAsync(
                It.IsAny<CancellationToken>()),
                Times.Once);

            Assert.That(result, Is.Not.EqualTo(Guid.Empty));
            Assert.That(_workItems, Has.Exactly(1).Items);
            Assert.That(_workItems[0].Title, Is.EqualTo(command.Dto.Title));
            Assert.That(_workItems[0].Status, Is.EqualTo(WorkItemStatus.ToDo));
        }

        [Test]
        public void Handle_NullCommand_ShouldThrowArgumentNullException()
        {
            // Arrange
            CreateWorkItemCommand command = null;

            // Act & Assert
            Assert.ThrowsAsync<ArgumentNullException>(() =>
                _handler.Handle(command, CancellationToken.None));
        }

        [Test]
        public async Task Handle_EmptyTitle_ShouldStillCreateWorkItem()
        {
            // Arrange
            var command = new CreateWorkItemCommand(
                new CreateUpdateWorkItemDto(
                    Title: "",
                    Description: "Test",
                    DueDate: DateTime.Now,
                    Priority: Priority.Low,
                    Status: WorkItemStatus.ToDo,
                    AssigneeId: null,
                    Id: null,
                    Comments: null
                ));

            // Act
            var result = await _handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.That(result, Is.Not.EqualTo(Guid.Empty));
            Assert.That(_workItems[0].Title, Is.EqualTo(""));
        }

        [Test]
        public async Task Handle_NoAssignee_ShouldCreateUnassignedWorkItem()
        {
            // Arrange
            var command = new CreateWorkItemCommand(
                new CreateUpdateWorkItemDto(
                    Title: "Unassigned Task",
                    Description: "Test",
                    DueDate: DateTime.Now,
                    Priority: Priority.Low,
                    Status: WorkItemStatus.ToDo,
                    AssigneeId: null,
                    Id: null,
                    Comments: null
                ));

            // Act
            var result = await _handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.That(_workItems[0].AssigneeId, Is.Null);
        }
    }
}