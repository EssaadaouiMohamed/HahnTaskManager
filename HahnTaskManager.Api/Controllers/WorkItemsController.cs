using HahnTaskManager.Application;
using HahnTaskManager.Application.Dtos.Requests;
using HahnTaskManager.Application.Dtos.Responses;
using HahnTaskManager.Application.WorkItems.Commands;
using HahnTaskManager.Application.WorkItems.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Application.Dtos.Requests;
using TaskManager.Domain.Enums;

namespace HahnTaskManager.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class WorkItemsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public WorkItemsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<ActionResult<Guid>> CreateWorkItem(
            [FromBody] CreateUpdateWorkItemDto createDto)
        {
            var command = new CreateWorkItemCommand(createDto);

            var result = await _mediator.Send(command);

            return Ok(result);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(WorkItemDetailDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<WorkItemDetailDto>> GetById(Guid id)
        {
            var query = new GetWorkItemByIdQuery(id);
            var result = await _mediator.Send(query);

            return result != null
                ? Ok(result)
                : NotFound();
        }

        [HttpGet]
        public async Task<ActionResult<PaginatedResult<WorkItemDto>>> GetWorkItems([FromQuery] GetWorkItemsQuery query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateWorkItem(Guid id, [FromBody] CreateUpdateWorkItemDto dto)
        {
            var command = new UpdateWorkItemCommand(id, dto);
            await _mediator.Send(command);
            return NoContent();
        }

        [HttpPost("search")]
        public async Task<ActionResult<PaginatedResult<WorkItemDto>>> SearchWorkItems([FromBody] GetWorkItemsQuery query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> ChangeStatus(Guid id, [FromBody] WorkItemStatus newStatus)
        {
            var command = new UpdateWorkItemStatusCommand(id, newStatus);
            await _mediator.Send(command);
            return NoContent();
        }
    }
}
