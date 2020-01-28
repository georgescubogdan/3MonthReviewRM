using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ContrAllStudioManagementBackend.Models;
using CoreDatabase;
using Microsoft.AspNetCore.Authorization;

namespace ContrAllStudioManagementBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class LegalDaysController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public LegalDaysController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/LegalDays
        [HttpGet]
        [Authorize]

        public async Task<ActionResult<IEnumerable<LegalDay>>> GetLegalDays()
        {
            return await _context.LegalDays.ToListAsync();
        }

        // GET: api/LegalDays/5
        [HttpGet("{id}")]
        [Authorize]

        public async Task<ActionResult<LegalDay>> GetLegalDay(int id)
        {
            var legalDay = await _context.LegalDays.FindAsync(id);

            if (legalDay == null)
            {
                return NotFound();
            }

            return legalDay;
        }

        // PUT: api/LegalDays/5
        [HttpPut("{id}")]
        [Authorize]

        public async Task<IActionResult> PutLegalDay(int id, LegalDay legalDay)
        {
            if (id != legalDay.LegalDayID)
            {
                return BadRequest();
            }

            _context.Entry(legalDay).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LegalDayExists(id))
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

        // POST: api/LegalDays
        [HttpPost]
        [Authorize]

        public async Task<ActionResult<LegalDay>> PostLegalDay(LegalDay legalDay)
        {
            _context.LegalDays.Add(legalDay);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLegalDay", new { id = legalDay.LegalDayID }, legalDay);
        }

        // DELETE: api/LegalDays/5
        [HttpDelete("{id}")]
        [Authorize]

        public async Task<ActionResult<LegalDay>> DeleteLegalDay(int id)
        {
            var legalDay = await _context.LegalDays.FindAsync(id);
            if (legalDay == null)
            {
                return NotFound();
            }

            _context.LegalDays.Remove(legalDay);
            await _context.SaveChangesAsync();

            return legalDay;
        }

        private bool LegalDayExists(int id)
        {
            return _context.LegalDays.Any(e => e.LegalDayID == id);
        }
    }
}
