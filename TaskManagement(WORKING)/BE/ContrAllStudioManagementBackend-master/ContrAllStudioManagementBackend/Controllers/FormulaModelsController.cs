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
    public class FormulaModelsController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public FormulaModelsController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/FormulaModels
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<FormulaModel>>> GetFormulaModels()
        {
            return await _context.FormulaModels.ToListAsync();
        }

        // GET: api/FormulaModels/5
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<FormulaModel>> GetFormulaModel(int id)
        {
            var formulaModel = await _context.FormulaModels.FindAsync(id);

            if (formulaModel == null)
            {
                return NotFound();
            }

            return formulaModel;
        }

        // PUT: api/FormulaModels/5
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutFormulaModel(int id, FormulaModel formulaModel)
        {
            if (id != formulaModel.FormulaModelId)
            {
                return BadRequest();
            }

            _context.Entry(formulaModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FormulaModelExists(id))
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

        // POST: api/FormulaModels
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<FormulaModel>> PostFormulaModel(FormulaModel formulaModel)
        {
            _context.FormulaModels.Add(formulaModel);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFormulaModel", new { id = formulaModel.FormulaModelId }, formulaModel);
        }

        // DELETE: api/FormulaModels/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult<FormulaModel>> DeleteFormulaModel(int id)
        {
            var formulaModel = await _context.FormulaModels.FindAsync(id);
            if (formulaModel == null)
            {
                return NotFound();
            }

            _context.FormulaModels.Remove(formulaModel);
            await _context.SaveChangesAsync();

            return formulaModel;
        }

        private bool FormulaModelExists(int id)
        {
            return _context.FormulaModels.Any(e => e.FormulaModelId == id);
        }
    }
}
