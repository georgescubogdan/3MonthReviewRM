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
    public class ClientController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public ClientController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/ClientModels
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClientModel>>> GetUserModels()
        {
            return await _context.UserModels.ToListAsync();
        }

        // GET: api/ClientModels/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<ClientModel>> GetClientModel(string id)
        {
            var clientModel = await _context.UserModels.FindAsync(id);

            if (clientModel == null)
            {
                return NotFound();
            }
            return clientModel;

        }

        // PUT: api/ClientModels/5
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutClientModel(string id, ClientModel clientModel)
        {
            if (id != clientModel.ClientId)
            {
                return BadRequest();
            }

            _context.Entry(clientModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClientModelExists(id))
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

        // POST: api/ClientModels
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<ClientModel>> PostClientModel(ClientModel clientModel)
        {
            _context.UserModels.Add(clientModel);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetClientModel", new { id = clientModel.ClientId }, clientModel);
        }

        // DELETE: api/ClientModels/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult<ClientModel>> DeleteClientModel(string id)
        {
            var clientModel = await _context.UserModels.FindAsync(id);
            if (clientModel == null)
            {
                return NotFound();
            }

            _context.UserModels.Remove(clientModel);
            await _context.SaveChangesAsync();

            return clientModel;
        }

        private bool ClientModelExists(string id)
        {
            return _context.UserModels.Any(e => e.ClientId == id);
        }
    }
}
