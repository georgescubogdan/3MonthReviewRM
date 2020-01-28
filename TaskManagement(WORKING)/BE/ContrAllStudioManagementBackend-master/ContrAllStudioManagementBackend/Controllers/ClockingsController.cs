using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CoreDatabase;
using CoreModels.Models;
using Microsoft.AspNetCore.Authorization;

namespace ContrAllStudioManagementBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClockingsController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public ClockingsController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/Clockings
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Clocking>>> GetClocking()
        {
            return await _context.Clockings.Include(clocking => clocking.Date).ToListAsync();
        }

       
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<Clocking>> GetClockings(int id)
        {
            var clockings = await _context.Clockings.FindAsync(id);

            if (clockings == null)
            {
                return NotFound();
            }

            return clockings;
        }

        // PUT: api/Clockings/5
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutClockings(int id, Clocking clockings)
        {
            if (id != clockings.ClockingId)
            {
                return BadRequest();
            }

            _context.Entry(clockings).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClockingsExists(id))
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

        // POST: api/Clockings
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Clocking>> PostClockings(Clocking clockings)
        {
            _context.Clockings.Add(clockings);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetClockings", new { id = clockings.ClockingId }, clockings);
        }

        // DELETE: api/Clockings/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult<Clocking>> DeleteClockings(int id)
        {
            var clockings = await _context.Clockings.FindAsync(id);
            if (clockings == null)
            {
                return NotFound();
            }

            _context.Clockings.Remove(clockings);
            await _context.SaveChangesAsync();

            return clockings;
        }

        private bool ClockingsExists(int id)
        {
            return _context.Clockings.Any(e => e.ClockingId == id);
        }
    }
}
