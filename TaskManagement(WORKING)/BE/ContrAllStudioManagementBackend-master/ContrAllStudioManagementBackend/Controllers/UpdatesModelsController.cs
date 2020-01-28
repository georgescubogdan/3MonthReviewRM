using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ContrAllStudioManagementBackend.Models;
using Microsoft.AspNetCore.Authorization;
using CoreDatabase;

namespace ContrAllStudioManagementBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UpdatesModelsController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public UpdatesModelsController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/UpdatesModels
        [HttpGet]
        [Authorize]


        public async Task<ActionResult<IEnumerable<UpdatesModel>>> GetUpdates()
        {
            return await _context.UpdatesModels.ToListAsync();
        }

        // GET: api/UpdatesModels/5
        [HttpGet("{id}")]
        [Authorize]

        public async Task<ActionResult<UpdatesModel>> GetUpdatesModel(int id)
        {
            var updatesModel = await _context.UpdatesModels.FindAsync(id);
            Console.WriteLine("DATAAAA: " + DateTime.Now);
            if (updatesModel == null)
            {
                return NotFound();
            }

            return updatesModel;
        }

        // PUT: api/UpdatesModels/5
        [HttpPut("{id}")]
        [Authorize]

        public async Task<IActionResult> PutUpdatesModel(int id, UpdatesModel updatesModel)
        {
            var aux = DateTime.Now;
            _context.Entry(updatesModel).State = EntityState.Modified;
            Console.WriteLine(updatesModel);
            if(id == 0)
            {
                updatesModel.LegalDaysUpdateTime = aux;
            }
            if (id == 1)
            {
                updatesModel.FormulaUpdateTime = aux;
            }
            if (id == 2)
            {
                updatesModel.SRUpdateTime = aux;
            }
            if (id == 3)
            {
                updatesModel.SubDomainsUpdateTime = aux;
            }
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UpdatesModelExists(1))
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

        // POST: api/UpdatesModels
        [HttpPost]
        [Authorize]

        public async Task<ActionResult<UpdatesModel>> PostUpdatesModel(UpdatesModel updatesModel)
        {
            _context.UpdatesModels.Add(updatesModel);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUpdatesModel", new { id = updatesModel.UpdatesModelId }, updatesModel);
        }

        // DELETE: api/UpdatesModels/5
        [HttpDelete("{id}")]
        [Authorize]

        public async Task<ActionResult<UpdatesModel>> DeleteUpdatesModel(int id)
        {
            var updatesModel = await _context.UpdatesModels.FindAsync(id);
            if (updatesModel == null)
            {
                return NotFound();
            }

            _context.UpdatesModels.Remove(updatesModel);
            await _context.SaveChangesAsync();

            return updatesModel;
        }

        private bool UpdatesModelExists(int id)
        {
            return _context.UpdatesModels.Any(e => e.UpdatesModelId == id);
        }
    }
}
