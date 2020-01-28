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
    public class IbanModelsController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public IbanModelsController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/IbanModels
        [HttpGet("profile={idProfile}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<IbanModel>>> GetIbanModelsByProfile(int idProfile)
        {
            return await _context.IbanModels.Where(iban => iban.ProfileModelId == idProfile).ToListAsync();

        }

        // GET: api/IbanModels/5
        [HttpGet("{id}")]
        [Authorize]

        public async Task<ActionResult<IbanModel>> GetIbanModel(int id)
        {
            var ibanModel = await _context.IbanModels.FindAsync(id);

            if (ibanModel == null)
            {
                return NotFound();
            }

            return ibanModel;
        }

        // PUT: api/IbanModels/5
        [HttpPut("{id}")]
        [Authorize]

        public async Task<IActionResult> PutIbanModel(int id, IbanModel ibanModel)
        {
            if (id != ibanModel.IbanModelId)
            {
                return BadRequest();
            }

            _context.Entry(ibanModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IbanModelExists(id))
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

        // POST: api/IbanModels
        [HttpPost]
        [Authorize]

        public async Task<ActionResult<IbanModel>> PostIbanModel(IbanModel ibanModel)
        {
            _context.IbanModels.Add(ibanModel);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetIbanModel", new { id = ibanModel.IbanModelId }, ibanModel);
        }

        // DELETE: api/IbanModels/5
        [HttpDelete("{id}")]
        [Authorize]

        public async Task<ActionResult<IbanModel>> DeleteIbanModel(int id)
        {
            var ibanModel = await _context.IbanModels.FindAsync(id);
            if (ibanModel == null)
            {
                return NotFound();
            }

            _context.IbanModels.Remove(ibanModel);
            await _context.SaveChangesAsync();

            return ibanModel;
        }

        private bool IbanModelExists(int id)
        {
            return _context.IbanModels.Any(e => e.IbanModelId == id);
        }
    }
}
