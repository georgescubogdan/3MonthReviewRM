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
    public class ProfileModelsController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public ProfileModelsController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/ProfileModels
        [HttpGet]
        [Authorize]

        public async Task<ActionResult<IEnumerable<ProfileModel>>> GetProfileModels()
        {
            return await _context.ProfileModels.ToListAsync();
        }

        // GET: api/ProfileModels/5
        [HttpGet("{id}")]
        [Authorize]

        public async Task<ActionResult<ProfileModel>> GetProfileModel(int id)
        {
            var profileModel = await _context.ProfileModels.FindAsync(id);

            if (profileModel == null)
            {
                return NotFound();
            }

            return profileModel;
        }

        // PUT: api/ProfileModels/5
        [HttpPut("{id}")]
        [Authorize]

        public async Task<IActionResult> PutProfileModel(int id, ProfileModel profileModel)
        {
            if (id != profileModel.ProfileModelId)
            {
                return BadRequest();
            }

            _context.Entry(profileModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProfileModelExists(id))
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

        // POST: api/ProfileModels
        [HttpPost]
        [Authorize]

        public async Task<ActionResult<ProfileModel>> PostProfileModel(ProfileModel profileModel)
        {
            _context.ProfileModels.Add(profileModel);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProfileModel", new { id = profileModel.ProfileModelId }, profileModel);
        }

        // DELETE: api/ProfileModels/5
        [HttpDelete("{id}")]
        [Authorize]

        public async Task<ActionResult<ProfileModel>> DeleteProfileModel(int id)
        {
            var profileModel = await _context.ProfileModels.Include(prf => prf.Ibans).FirstAsync(prf => prf.ProfileModelId == id);
            //var subDomainModel = await _context.SubDomainModels.Include(sdm => sdm.Profiles).ThenInclude(p => p.Ibans).FirstAsync(sdm => sdm.SubDomainId == id);

            if (profileModel == null)
            {
                return NotFound();
            }
            foreach (var iban in profileModel.Ibans)
            {
                _context.IbanModels.Remove(iban);
            }
            _context.ProfileModels.Remove(profileModel);
            await _context.SaveChangesAsync();

            return profileModel;
        }

        private bool ProfileModelExists(int id)
        {
            return _context.ProfileModels.Any(e => e.ProfileModelId == id);
        }
    }
}
