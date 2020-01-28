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
    public class UsersTasksController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public UsersTasksController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/UsersTasks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserTaskModel>>> GetUserTaskModels()
        {
            return await _context.UserTaskModels.ToListAsync();
        }

        // GET: api/UsersTasks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserTaskModel>> GetUserTaskModel(int id)
        {
            var userTaskModel = await _context.UserTaskModels.FindAsync(id);

            if (userTaskModel == null)
            {
                return NotFound();
            }

            return userTaskModel;
        }

        // PUT: api/UsersTasks/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserTaskModel(int id, UserTaskModel userTaskModel)
        {
            if (id != userTaskModel.UserID)
            {
                return BadRequest();
            }

            _context.Entry(userTaskModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserTaskModelExists(id))
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

        // POST: api/UsersTasks
        [HttpPost]
        public async Task<ActionResult<UserTaskModel>> PostUserTaskModel(UserTaskModel userTaskModel)
        {
            _context.UserTaskModels.Add(userTaskModel);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (UserTaskModelExists(userTaskModel.UserID))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetUserTaskModel", new { id = userTaskModel.UserID }, userTaskModel);
        }

        // DELETE: api/UsersTasks/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<UserTaskModel>> DeleteUserTaskModel(int id)
        {
            var userTaskModel = await _context.UserTaskModels.FindAsync(id);
            if (userTaskModel == null)
            {
                return NotFound();
            }

            _context.UserTaskModels.Remove(userTaskModel);
            await _context.SaveChangesAsync();

            return userTaskModel;
        }

        private bool UserTaskModelExists(int id)
        {
            return _context.UserTaskModels.Any(e => e.UserID == id);
        }
    }
}
