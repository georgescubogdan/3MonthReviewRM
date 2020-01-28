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
    public class RoleModelsController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public RoleModelsController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/RoleModels
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoleModel>>> GetAppRoles()
        {
            return await _context.AppRoles.ToListAsync();
        }

        // GET: api/UserRoleModels/userId
        [HttpGet("UserRoleModels/{id}")]
        public async Task<ActionResult<IEnumerable<RoleModel>>> GetUserAppRoles(int id)
        {
            var roleIds = await _context.AppUserRoleModel.Where(userRole => userRole.UserId == id)
                                                 .Select(userRole => userRole.RoleId)
                                                 .ToListAsync();
            var roles = await _context.AppRoles.Where(role => roleIds.Contains(role.Id)).ToListAsync();

            if (roles == null)
            {
                return NotFound();
            }

            return roles;
            //return await _context.AppRoles.ToListAsync();
        }

        // GET: api/RoleModels/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RoleModel>> GetRoleModel(int id)
        {
            var roleModel = await _context.AppRoles.FindAsync(id);

            if (roleModel == null)
            {
                return NotFound();
            }

            return roleModel;
        }

        // PUT: api/RoleModels/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRoleModel(int id, RoleModel roleModel)
        {
            if (id != roleModel.Id)
            {
                return BadRequest();
            }

            _context.Entry(roleModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RoleModelExists(id))
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

        // POST: api/RoleModels
        [HttpPost]
        public async Task<ActionResult<RoleModel>> PostRoleModel(RoleModel roleModel)
        {
            _context.AppRoles.Add(roleModel);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRoleModel", new { id = roleModel.Id }, roleModel);
        }

        // DELETE: api/RoleModels/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<RoleModel>> DeleteRoleModel(int id)
        {
            var roleModel = await _context.AppRoles.FindAsync(id);
            if (roleModel == null)
            {
                return NotFound();
            }

            _context.AppRoles.Remove(roleModel);
            await _context.SaveChangesAsync();

            return roleModel;
        }

        private bool RoleModelExists(int id)
        {
            return _context.AppRoles.Any(e => e.Id == id);
        }
    }
}
