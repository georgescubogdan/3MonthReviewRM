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
    public class UserRoleModelsController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public UserRoleModelsController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/UserRoleModels
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserRoleModel>>> GetAppUserRoleModel()
        {
            return await _context.AppUserRoleModel.ToListAsync();
        }

        // GET: api/UserRoleModels/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserRoleModel>> GetUserRoleModel(int id)
        {
            var userRoleModel = await _context.AppUserRoleModel.FindAsync(id);

            if (userRoleModel == null)
            {
                return NotFound();
            }

            return userRoleModel;
        }

        // PUT: api/UserRoleModels/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserRoleModel(int id, UserRoleModel userRoleModel)
        {
            if (id != userRoleModel.UserId)
            {
                return BadRequest();
            }

            _context.Entry(userRoleModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserRoleModelExists(id))
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

        // POST: api/UserRoleModels
        [HttpPost]
        public async Task<ActionResult<UserRoleModel>> PostUserRoleModel(UserRoleModel userRoleModel)
        {
            _context.AppUserRoleModel.Add(userRoleModel);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (UserRoleModelExists(userRoleModel.UserId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetUserRoleModel", new { id = userRoleModel.UserId }, userRoleModel);
        }

        // DELETE: api/UserRoleModels/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<UserRoleModel>> DeleteUserRoleModel(int id)
        {
            var userRoleModel = await _context.AppUserRoleModel.FindAsync(id);
            if (userRoleModel == null)
            {
                return NotFound();
            }

            _context.AppUserRoleModel.Remove(userRoleModel);
            await _context.SaveChangesAsync();

            return userRoleModel;
        }

        private bool UserRoleModelExists(int id)
        {
            return _context.AppUserRoleModel.Any(e => e.UserId == id);
        }
    }
}
