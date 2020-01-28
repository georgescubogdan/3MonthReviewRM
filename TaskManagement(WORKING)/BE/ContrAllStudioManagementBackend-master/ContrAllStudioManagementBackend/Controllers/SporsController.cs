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
    public class SporsController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public SporsController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/Spors
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<SRModel>>> GetSRModels()
        {
            return await _context.SRModels.Where(sr => sr.IsSpor).ToListAsync();
        }

        // GET: api/Spors/5
        [HttpGet("{id}")]
        [Authorize]

        public async Task<ActionResult<SRModel>> GetSRModel(int id)
        {
            var sRModel = await _context.SRModels.FirstAsync(sr => sr.SRModelId == id);


            if (sRModel.IsSpor == false)
            {
                return NotFound();
            }

            if (sRModel == null)
            {
                return NotFound();
            }


            return sRModel;
        }

        // PUT: api/Spors/5
        [HttpPut("{id}")]
        [Authorize]

        public async Task<IActionResult> PutSRModel(int id, SRModel sRModel)
        {
            if (id != sRModel.SRModelId)
            {
                return BadRequest();
            }
            if (!sRModel.IsSpor)
            {
                return BadRequest();
            }

            _context.Entry(sRModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SRModelExists(id))
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

        // POST: api/Spors
        [HttpPost]
        [Authorize]

        public async Task<ActionResult<SRModel>> PostSRModel(SRModel sRModel)
        {
            _context.SRModels.Add(sRModel);
            sRModel.IsSpor = true;
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSRModel", new { id = sRModel.SRModelId }, sRModel);
        }

        // DELETE: api/Spors/5
        [HttpDelete("{id}")]
        [Authorize]

        public async Task<ActionResult<SRModel>> DeleteSRModel(int id)
        {
            var sRModel = await _context.SRModels.FindAsync(id);
            if (sRModel == null)
            {
                return NotFound();
            }

            _context.SRModels.Remove(sRModel);
            await _context.SaveChangesAsync();

            return sRModel;
        }

        private bool SRModelExists(int id)
        {
            return _context.SRModels.Any(e => e.SRModelId == id);
        }
    }
}
