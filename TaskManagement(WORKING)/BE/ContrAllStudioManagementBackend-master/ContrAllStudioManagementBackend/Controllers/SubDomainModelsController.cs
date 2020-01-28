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
    public class SubDomainModelsController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public SubDomainModelsController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/SubDomainModels
        [HttpGet]
        [Authorize]

        public async Task<ActionResult<IEnumerable<SubDomainModel>>> GetSubDomainModels()
        {
            var subDomainModels = await _context.SubDomainModels.Include(sdm => sdm.Profiles).ThenInclude(p => p.Ibans).ToListAsync();
            //foreach (var sd in subDomainModels)
            //{
            //    sd.Profiles = await _context.ProfileModels.Where(p => p.SubDomainId == sd.SubDomainId).ToListAsync();
            //    foreach (var pr in sd.Profiles)
            //    {
            //        pr.Ibans = await _context.IbanModels.Where(i => i.ProfileModelId == pr.ProfileModelId).ToListAsync();
            //    }
            //}

            return subDomainModels;
        }

        // GET: api/SubDomainModels/5
        [HttpGet("{id}")]
        [Authorize]

        public async Task<ActionResult<SubDomainModel>> GetSubDomainModel(int id)
        {
            var subDomainModel = await _context.SubDomainModels.Include(sdm => sdm.Profiles).ThenInclude(p => p.Ibans).FirstAsync(sdm => sdm.SubDomainId == id);

            if (subDomainModel == null)
            {
                return NotFound();
            }
            return subDomainModel;
        }

        // PUT: api/SubDomainModels/5
        [HttpPut("{id}")]
        [Authorize]

        public async Task<IActionResult> PutSubDomainModel(int id, SubDomainModel subDomainModel)
        {
            if (id != subDomainModel.SubDomainId)
            {
                return BadRequest();
            }

            _context.Entry(subDomainModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SubDomainModelExists(id))
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

        // POST: api/SubDomainModels
        [HttpPost]
        [Authorize]

        public async Task<ActionResult<SubDomainModel>> PostSubDomainModel(SubDomainModel subDomainModel)
        {
            _context.SubDomainModels.Add(subDomainModel);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSubDomainModel", new { id = subDomainModel.SubDomainId }, subDomainModel);
        }

        // DELETE: api/SubDomainModels/5
        [HttpDelete("{id}")]
        [Authorize]

        public async Task<ActionResult<SubDomainModel>> DeleteSubDomainModel(int id)
        {
            var subDomainModel = await _context.SubDomainModels.Include(sdm => sdm.Profiles).ThenInclude(p => p.Ibans).FirstAsync(sdm => sdm.SubDomainId == id);
            if (subDomainModel == null)
            {
                return NotFound();
            }
            foreach (var pr in subDomainModel.Profiles)
            {
                foreach (var iban in pr.Ibans)
                {
                    _context.IbanModels.Remove(iban);
                }
                _context.ProfileModels.Remove(pr);
            }

            _context.SubDomainModels.Remove(subDomainModel);
            await _context.SaveChangesAsync();

            return subDomainModel;
        }

        private bool SubDomainModelExists(int id)
        {
            return _context.SubDomainModels.Any(e => e.SubDomainId == id);
        }
    }
}
