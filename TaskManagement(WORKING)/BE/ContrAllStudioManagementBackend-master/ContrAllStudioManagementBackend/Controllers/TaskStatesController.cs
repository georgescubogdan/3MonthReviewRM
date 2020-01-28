using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CoreDatabase;
using CoreModels.Models;

namespace ContrAllStudioManagementBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskStatesController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public TaskStatesController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/TaskStates
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskStateModel>>> GetTaskStateModels()
        {
            return await _context.TaskStateModels.Include(s => s.Tasks).ToListAsync();
        }

        // GET: api/TaskStates/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TaskStateModel>> GetTaskStateModel(int id)
        {
            var taskStateModel = await _context.TaskStateModels.FindAsync(id);

            if (taskStateModel == null)
            {
                return NotFound();
            }

            return taskStateModel;
        }

        // PUT: api/TaskStates/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTaskStateModel(int id, TaskStateModel taskStateModel)
        {
            if (id != taskStateModel.TaskStateID)
            {
                return BadRequest();
            }

            _context.Entry(taskStateModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TaskStateModelExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/TaskStates
        [HttpPost]
        public async Task<ActionResult<TaskStateModel>> PostTaskStateModel(TaskStateModel taskStateModel)
        {
            _context.TaskStateModels.Add(taskStateModel);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTaskStateModel", new { id = taskStateModel.TaskStateID }, taskStateModel);
        }

        // DELETE: api/TaskStates/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<TaskStateModel>> DeleteTaskStateModel(int id)
        {
            var taskStateModel = await _context.TaskStateModels.FindAsync(id);
            if (taskStateModel == null)
            {
                return NotFound();
            }

            _context.TaskStateModels.Remove(taskStateModel);
            await _context.SaveChangesAsync();

            return taskStateModel;
        }

        private bool TaskStateModelExists(int id)
        {
            return _context.TaskStateModels.Any(e => e.TaskStateID == id);
        }
    }
}
