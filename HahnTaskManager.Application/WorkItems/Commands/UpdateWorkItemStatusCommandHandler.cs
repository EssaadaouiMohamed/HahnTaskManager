using TaskManager.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskManager.Infrastructure.Data;

namespace HahnTaskManager.Application.WorkItems.Commands
{
    public class UpdateWorkItemStatusCommandHandler : IRequestHandler<UpdateWorkItemStatusCommand>
    {
        private readonly AppDbContext _dbContext;

        public UpdateWorkItemStatusCommandHandler(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task Handle(UpdateWorkItemStatusCommand request, CancellationToken cancellationToken)
        {
            var workItem = await _dbContext.WorkItems
                .FirstOrDefaultAsync(w => w.Id == request.WorkItemId, cancellationToken);

            if (workItem == null)
                throw new Exception("Work item not found.");

            workItem.Status = request.NewStatus;
            await _dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}