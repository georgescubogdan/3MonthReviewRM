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
    public class DatesController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public DatesController(DatabaseContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet("GetFilteredDates/{year}/{month}")]
        public async Task<ActionResult<IEnumerable<Date>>> GetFilteredDates(int year, int month)
        {
            return await _context.Dates.Include(date => date.User)
                                 .Where(date => date.CurrentDate.Year == year
                                                && date.CurrentDate.Month == month)
                                 .ToListAsync();
        }

        [Authorize]
        [HttpGet("GetYears")]
        public async Task<ActionResult<IEnumerable<int>>> GetYears()
        {
            return await _context.Dates
                                 .Select(date => date.CurrentDate.Year)
                                 .Distinct()
                                 .ToListAsync();
        }
        [Authorize]
        [HttpGet("GetMonths/{year}")]
        public async Task<ActionResult<IEnumerable<int>>> GetMonths(int year)
        {
            return await _context.Dates
                                 .Where(date => date.CurrentDate.Year == year)
                                 .Select(date => date.CurrentDate.Month)
                                 .ToListAsync();
        }
        [Authorize]
        [HttpGet("GetDays/{year}/{month}")]
        public async Task<ActionResult<IEnumerable<int>>> GetDays(int year , int month)
        {
            return await _context.Dates
                                 .Where(date => date.CurrentDate.Year == year
                                 && date.CurrentDate.Month== month)
                                 .Select(date => date.CurrentDate.Day)
                                 .ToListAsync();
        }
        [Authorize]
        [HttpGet("GetDatesByUser/{id}")]
        public async Task<ActionResult<IEnumerable<Date>>> GetDatesByUser(int id)
        {
            return await _context.Dates
                                 .Where(data => data.UserId == id)
                                 .ToListAsync();
        }


        // GET: api/Dates/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<Date>> GetDates(int id)
        {
            var dates = await _context.Dates
                                       .FirstOrDefaultAsync(date => date.DateId == id);


            if (dates == null)
            {
                return NotFound();
            }

            return dates;
        }



        // PUT: api/Dates/5
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDates(int id, Date dates)
        {
            if (id != dates.DateId)
            {
                return BadRequest();
            }

            _context.Entry(dates).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DatesExists(id))
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

        // POST: api/Dates
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Date>> PostDates(Date dates)
        {
            _context.Dates.Add(dates);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDates", new { id = dates.DateId }, dates);
        }


        // DELETE: api/Dates/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult<Date>> DeleteDates(int id)
        {
            var dates = await _context.Dates.FindAsync(id);
            if (dates == null)
            {
                return NotFound();
            }

            _context.Dates.Remove(dates);
            await _context.SaveChangesAsync();

            return dates;
        }

        private bool DatesExists(int id)
        {
            return _context.Dates.Any(e => e.DateId == id);
        }
    }
}
