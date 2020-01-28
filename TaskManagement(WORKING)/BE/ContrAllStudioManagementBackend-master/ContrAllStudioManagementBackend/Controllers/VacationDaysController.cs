using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CoreDatabase;
using CoreModels.Models;
using System.Security.Claims;

namespace ContrAllStudioManagementBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VacationDaysController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public VacationDaysController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/VacationDays
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VacationDayModel>>> GetVacationDays()
        {
            return await _context.VacationDays.Include(v => v.User).ToListAsync();
        }

        // GET: api/VacationDays/5
        [HttpGet("{id}")]
        public async Task<ActionResult<VacationDayModel>> GetVacationDayModel(int id)
        {
            var vacationDayModel = await _context.VacationDays.FindAsync(id);

            if (vacationDayModel == null)
            {
                return NotFound();
            }

            return vacationDayModel;
        }

        // GET: api/VacationDays/UserModels/{id}
        [HttpGet("User")]
        public async Task<ActionResult<IEnumerable<VacationDayModel>>> GetUserVacationDays()
        {
            ClaimsPrincipal currentUser = this.User;
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            //var vacationdDaysIds = await _context.VacationDays.Where(vacationDay => vacationDay.UserId == id)
            //                                     .Select(vacationDay => vacationDay.UserId)
            //                                     .ToListAsync();
            //var vacationDays = await _context.VacationDays.Where(vacationDay => vacationdDaysIds.Contains(vacationDay.Id)).ToListAsync();

            var vacation = await _context.VacationDays.Where(vacationDay => vacationDay.UserId == userId).ToListAsync();


            if (vacation == null)
            {
                return NotFound(); 
            }

            return vacation;
            //return await _context.AppRoles.ToListAsync();
        }

        // PUT: api/VacationDays/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVacationDayModel(int id, VacationDayModel vacationDayModel)
        {
            if (id != vacationDayModel.VacationDayID)
            {
                return BadRequest();
            }

            _context.Entry(vacationDayModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VacationDayModelExists(id))
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

        // POST: api/VacationDays
        [HttpPost]
        public async Task<ActionResult<VacationDayModel>> PostVacationDayModel(VacationDayModel vacationDayModel)
        {
            _context.VacationDays.Add(vacationDayModel);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetVacationDayModel", new { id = vacationDayModel.VacationDayID }, vacationDayModel);
        }

        // DELETE: api/VacationDays/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<VacationDayModel>> DeleteVacationDayModel(int id)
        {
            var vacationDayModel = await _context.VacationDays.FindAsync(id);
            if (vacationDayModel == null)
            {
                return NotFound();
            }

            _context.VacationDays.Remove(vacationDayModel);
            await _context.SaveChangesAsync();

            return vacationDayModel;
        }

        private bool VacationDayModelExists(int id)
        {
            return _context.VacationDays.Any(e => e.VacationDayID == id);
        }
    }
}
