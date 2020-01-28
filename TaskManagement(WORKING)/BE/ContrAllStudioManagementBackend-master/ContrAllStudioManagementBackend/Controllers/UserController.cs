using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CoreDatabase;
using CoreModels.Models;
using CoreModels.Enums;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;

namespace ContrAllStudioManagementBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly DatabaseContext _context;
        private readonly UserManager<UserModel> _userManager;

        public UserController(DatabaseContext context, UserManager<UserModel> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        #region post
        [Route("[action]")]
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<ButtonStateEnum>> ChangeButtonState([FromBody] MyDate crtDate)
        {

            var currentDate = crtDate.CurrentDate;
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var buttonState = await GetButtonState(currentDate);
            Console.Write(buttonState);
            // butonul e apasat => pontajul e inceput
            if (buttonState.Value == ButtonStateEnum.OngoingClocking)
            {
                // inchidem pontajul
                var clocking = await _context.Clockings
                                    .Include(cl => cl.Date)
                                    .FirstOrDefaultAsync(cl =>
                                                         cl.EndTime == DateTime.MinValue
                                                         && cl.Date.UserId == userId);
                clocking.EndTime = currentDate;
                _context.Entry(clocking).State = EntityState.Modified;

                await _context.SaveChangesAsync();


                var time = clocking.EndTime - clocking.StartTime;


                var date = await _context.Dates
                                         .FirstOrDefaultAsync(d =>
                                                              d.CurrentDate.Day == currentDate.Day
                                                              && d.CurrentDate.Month == currentDate.Month
                                                              && d.CurrentDate.Year == currentDate.Year
                                                              && d.UserId == userId);

                if (date.Seconds + time.Seconds >= 60)
                {
                    date.Minutes++;
                    date.Seconds = date.Seconds + time.Seconds - 60;
                }

                if (date.Minutes + time.Minutes >= 60)
                {
                    date.Hours++;
                    date.Minutes = date.Minutes + time.Minutes - 60;
                }

                date.Seconds += time.Seconds;
                date.Minutes += time.Minutes;
                date.Hours += time.Hours;

                _context.Entry(date).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return Ok(ButtonStateEnum.NewClocking);

            }

            else
            {

                if (buttonState.Value == ButtonStateEnum.FirstClocking)
                {
                    Date date = new Date
                    {
                        CurrentDate = currentDate,
                        UserId = userId,
                        Hours = 0,
                        Minutes = 0,
                        Seconds = 0
                    };

                    _context.Dates.Add(date);
                    await _context.SaveChangesAsync();

                    Clocking clocking = new Clocking
                    {
                        DateId = date.DateId,
                        StartTime = currentDate,
                        EndTime = DateTime.MinValue
                    };

                    _context.Clockings.Add(clocking);
                    await _context.SaveChangesAsync();

                    return Ok(ButtonStateEnum.OngoingClocking);
                }

                else
                {
                    if (buttonState.Value == ButtonStateEnum.NewClocking)
                    {
                        var date = await _context.Dates
                                                 .FirstOrDefaultAsync(d =>
                                                                      d.CurrentDate.Day == currentDate.Day
                                                                      && d.CurrentDate.Month == currentDate.Month
                                                                      && d.CurrentDate.Year == currentDate.Year
                                                                      && d.UserId == userId);


                        Clocking clocking = new Clocking
                        {
                            DateId = date.DateId,
                            StartTime = currentDate,
                            EndTime = DateTime.MinValue
                        };

                        _context.Clockings.Add(clocking);
                        await _context.SaveChangesAsync();

                        return Ok(ButtonStateEnum.OngoingClocking);
                    }
                }
            }

            return Ok(true);
        }

        // POST: api/UserModels
        [HttpPost]
        [Authorize]

        public async Task<ActionResult<UserModel>> PostUserModel(UserModel userModel)
        {
            _context.AppUserModels.Add(userModel);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUserModels", new { id = userModel.Id }, userModel);
        }

       
        #endregion

        #region get

        // GET: api/User/5
        [Authorize]
        [HttpGet("GetUserModel/{id}")]
        public async Task<ActionResult<UserModel>> GetUserModel(int id)
        {
            var userModel = await _context.AppUserModels.FindAsync(id);

            if (userModel == null)
            {
                return NotFound();
            }

            return userModel;
        }
        
       
        [Authorize]
        [HttpGet("GetButtonState")]
        public async Task<ActionResult<ButtonStateEnum>> GetButtonState(DateTime crtDate)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var date = await _context.Dates
                                .Include(d => d.Clockings)
                                .FirstOrDefaultAsync(d =>
                                 d.CurrentDate.Day == crtDate.Day
                                 && d.CurrentDate.Year == crtDate.Year
                                 && d.CurrentDate.Month == crtDate.Month
                                 && d.UserId == userId);

            if (date == null)
            {
                return ButtonStateEnum.FirstClocking;
            }
            else
            {


                if (date.Clockings.FirstOrDefault(clocking => clocking.EndTime == DateTime.MinValue) != null)
                {
                    return ButtonStateEnum.OngoingClocking;
                }
                else
                {
                    return ButtonStateEnum.NewClocking;
                }
            }


        }
  
        // GET: api/UserModels
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserModel>>> GetUserModels()
        {
            return await _context.AppUserModels.Include(user => user.UserRoles).ToListAsync();
        }
        #endregion

        #region put

        // PUT: api/User/5
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutUserModel(int id, UserDTO userModel)
        {
            //var user = await _userManager.FindByIdAsync(id.ToString());
            var user = await _context.AppUserModels.FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound();
            }

            user.UserName = userModel.UserName;
            user.Email = userModel.Email;
            user.PhoneNumber = userModel.PhoneNumber;
            user.LastName = userModel.LastName;
            user.FirstName = userModel.FirstName;

            /*user.UserRoles.Clear();
            foreach (UserRoleModel role in userModel.UserRoles)
            {
                //Console.WriteLine(role);
                RoleModel rol = new RoleModel();
                _context.UserRoles
                user.UserRoles.Add();
            }*/

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                //await _userManager.UpdateAsync(user);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserModelExists(id))
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

        // PUT: api/User/editRoles/5
        [HttpPut("editRoles/{id}")]
        [Authorize]
        public async Task<IActionResult> PutUserRoleModel(int id, [FromBody] List<int> userRoles)
        {
            //var user = await _userManager.FindByIdAsync(id.ToString());
            Console.WriteLine(userRoles);
            //var user = await _context.AppUserModels.FirstOrDefaultAsync(u => u.Id == id);

            var user = await _context.AppUserModels.Include(u => u.UserRoles).Where(u => u.Id == id).FirstOrDefaultAsync();


            //  return await _context.AppUserModels.Include(user => user.UserRoles).ThenInclude(role => role.Role).ToListAsync();

            if (user == null)
            {
                return NotFound();
            }

            //var uRoles = await _context.AppUserRoleModel.Where(userRole => userRoles.Contains(userRole.RoleId)).ToListAsync();

            var dbRoles = await _context.AppUserRoleModel.Where(userRole => userRole.UserId == id).ToListAsync();
            var uRoles = await _context.AppUserRoleModel.Where(userRole => userRole.UserId == id && userRoles.Contains(userRole.RoleId)).ToListAsync();

            var allRoles = await _context.AppRoles.Where(role => userRoles.Contains(role.Id)).ToListAsync();

            var addRoles = allRoles.Where(role => userRoles.Contains(role.Id) 
                                          && uRoles.FindIndex(urole => urole.RoleId == role.Id) == -1)
                                   .Select(role => new UserRoleModel() { UserId = id, RoleId = role.Id }).ToList();
            var removeRoles = dbRoles.Where(urole => !userRoles.Contains(urole.RoleId)).ToList();

            _context.RemoveRange(removeRoles);
            _context.AddRange(addRoles);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // PUT: api/User/shouldChangePassword/5
        [HttpPut("shouldChangePasswordChangeState/{id}")]
        [Authorize]
        public async Task<IActionResult> ShouldChangePasswordChangeState(int id)
        {
            var user = await _context.AppUserModels.Where(u => u.Id == id).FirstOrDefaultAsync();

            user.ShouldGetPassword = true;

            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }



        #endregion

        #region delete

            // DELETE: api/User/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult<UserModel>> DeleteUserModel(int id)
        {
            var userModel = await _context.AppUserModels.FindAsync(id);
            if (userModel == null)
            {
                return NotFound();
            }

            _context.AppUserModels.Remove(userModel);
            await _context.SaveChangesAsync();

            return userModel;
        }

        #endregion

        private bool UserModelExists(int id)
        {
            return _context.AppUserModels.Any(e => e.Id == id);
        }
    }

    public class MyDate
    {
        public DateTime CurrentDate { get; set; }
    }

    public class UserDTO
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        //public List<UserRoleModel> UserRoles { get; set; }

    }
}
