using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using CoreDatabase;
using CoreModels.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.ApplicationInsights.Extensibility.Implementation;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using JsonSerializer = Newtonsoft.Json.JsonSerializer;

namespace ContrAllStudioManagementBackend.Controllers
{
    [Route("[controller]/[action]")]
    public class AccountController : Controller
    {
        private readonly DatabaseContext _context;
        private readonly SignInManager<UserModel> _signInManager;
        private readonly UserManager<UserModel> _userManager;
        private readonly IConfiguration _configuration;
        private UserModel crtUser;

        public object Users { get; private set; }

        public AccountController(
            UserManager<UserModel> userManager,
            SignInManager<UserModel> signInManager,
            IConfiguration configuration,
            DatabaseContext context
            )
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _context = context;
        }
        [HttpPost()]
        public async Task<object> Login([FromBody] LoginDto model)
        {
            var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, false, false);
            if (result.Succeeded)
            {

                var appUser = _userManager.Users.Include(u => u.UserRoles).FirstOrDefault(r => r.Email == model.Email);
                crtUser = appUser;
                using (DatabaseContext dbc = new DatabaseContext())
                {
                    return await GenerateJwtToken(model.Email, appUser);
                }
            }

            return Unauthorized();
        }
      
        [HttpGet]
        [Authorize]
        public ActionResult<String> GetUserFullName()
        {
            ClaimsPrincipal currentUser = this.User;
            
            var name = this.User.FindFirst("Name").Value;
            return Ok(name);
        }

        [HttpGet]
        [Authorize]
        public ActionResult<List<string>> GetUserRole()
        {
            ClaimsPrincipal currentUser = this.User;

            //var roles = (currentUser.FindFirst("Roles").Value);
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            //var roles = _context.AppUserRoleModel.Where(userRole => userRole.UserId == userId)
            //                                     .Include(userRole => userRole.RoleModel)
            //                                     .Select(userRole => userRole.RoleModel)
            //                                     .ToList();


            var roleIds = _context.AppUserRoleModel.Where(userRole => userRole.UserId == userId)
                                                 .Select(userRole => userRole.RoleId)
                                                 .ToList();
            var roles = _context.AppRoles.Where(role => roleIds.Contains(role.Id)).Select(role => role.Name).ToList();

            return Ok(roles);
        }

        [HttpGet]
        [Authorize]
        public ActionResult<bool> GetShouldChangePassword()
        {
            ClaimsPrincipal currentUser = this.User;
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var shouldChangePass = _context.AppUserModels.Where(user => user.Id == userId)
                                                         .Select(user => user.ShouldGetPassword).First();

            return Ok(shouldChangePass);
        }

        [HttpPost]
        public async void Logout()
        {
            await _signInManager.SignOutAsync();
        }

        [HttpPost]
        public ActionResult<String> GetUserData()
        {
            dynamic userDataJson = null;
            // userid: this.User.FindFirst(ClaimTypes.NameIdentifier).Value
            using (DatabaseContext dbc = new DatabaseContext())
            {
                ClaimsPrincipal currentUser = this.User;
                var id = this.User.FindFirst("id").Value;
                var userData = _userManager.Users.AsQueryable().FirstOrDefault(account => account.Id.ToString() == id);
                if (userData != null)
                {
                    userDataJson = JObject.FromObject(userData, FormattingData());
                    var userJArray = new JArray();
                    var user = dbc.AppUserModels.Where(u => u.Id == userData.Id).Join(dbc.AppUserModels, c => c.Id, ac => ac.Id, (ac, c) => c).Include(c => c.UserRoles).ToList();
                    user.ForEach(company => userJArray.Add(JObject.FromObject(company, FormattingData())));
                    userDataJson.Companies = userJArray;
                    return userDataJson.ToString();
                }
                else
                {
                    return null;
                }
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<object> Register([FromBody] RegisterDto model)
        {
            var user = new UserModel
            {
                UserName = model.Email,
                Email = model.Email,
                PhoneNumber = model.PhoneNumber,
                FirstName = model.FirstName,
                LastName = model.LastName,
                ShouldGetPassword = model.ShouldGeneratePassword
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                await _signInManager.SignInAsync(user, false);
                return Ok(await GenerateJwtToken(model.Email, user));
            }

            return Conflict();
        }

        private String GenerateInviteJwt(string email, string companyId)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("CompanyId", companyId),
            
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddDays(1);

            var token = new JwtSecurityToken(
                _configuration["JwtIssuer"],
                _configuration["JwtIssuer"],
                claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token).ToString();
        }

        private ClaimsPrincipal ValidateToken(string jwtToken)
        {
            SecurityToken validatedToken;
            TokenValidationParameters validationParameters = new TokenValidationParameters();

            validationParameters.ValidateLifetime = true;

            validationParameters.ValidAudience = _configuration["JwtIssuer"];
            validationParameters.ValidIssuer = _configuration["JwtIssuer"];
            validationParameters.IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtKey"]));

            ClaimsPrincipal principal = new JwtSecurityTokenHandler().ValidateToken(jwtToken, validationParameters, out validatedToken);

            return principal;
        }

        private async Task<object> GenerateJwtToken(string email, UserModel user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim("Name", user.FullName),
                new Claim("Id", user.Id.ToString())
        };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddMinutes(Convert.ToDouble(_configuration["JwtExpireMinutes"]));
            //var expires = DateTime.Now.AddSeconds(60);

            var token = new JwtSecurityToken(
                _configuration["JwtIssuer"],
                _configuration["JwtIssuer"],
                claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpPut]
        public async Task<ActionResult> ChangePassword([FromBody] ResetPasswordDTO model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            user.ShouldGetPassword = false;

            IdentityResult result = await _userManager.ChangePasswordAsync(user, model.OldPassword, model.NewPassword);

            if (result.Succeeded)
            {
                var res = await _signInManager.PasswordSignInAsync(model.Email, model.NewPassword, false, false);
                if (res.Succeeded)
                {

                    var appUser = _userManager.Users.Include(u => u.UserRoles).FirstOrDefault(r => r.Email == model.Email);
                    crtUser = appUser;
                    using (DatabaseContext dbc = new DatabaseContext())
                    {
                        return Ok(await GenerateJwtToken(model.Email, appUser));
                    }
                }

                return Unauthorized();
            } 
            else
            {
                return BadRequest(result.Errors);
            }
        }

        private static JsonSerializer FormattingData()
        {
            var jsonSerializersettings = new JsonSerializer
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            };
            return jsonSerializersettings;
        }

        public class ResetPasswordDTO
        {
            [Required]
            public string Email { get; set; }

            [Required]
            public string OldPassword { get; set; }

            [Required]
            public string NewPassword { get; set; }
        }

        public class LoginDto
        {
            [Required]
            public string Email { get; set; }

            [Required]
            public string Password { get; set; }
        }

        public class RegisterDto
        {
            [Required]
            public string Email { get; set; }

            [Required]
            [StringLength(100, ErrorMessage = "PASSWORD_MIN_LENGTH", MinimumLength = 6)]
            public string Password { get; set; }

            [Required]
            public string FirstName { get; set; }
            [Required]
            public string LastName { get; set; }
            [Required]
            public string PhoneNumber { get; set; }
            [Required]
            public bool ShouldGeneratePassword { get; set; }
        }

    }
}
