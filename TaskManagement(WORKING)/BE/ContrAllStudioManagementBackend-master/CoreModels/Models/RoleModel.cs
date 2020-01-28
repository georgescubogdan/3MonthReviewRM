using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Identity;

namespace CoreModels.Models
{
    public class RoleModel : IdentityRole<int>
    {
        public ICollection<UserRoleModel> UserRoles { get; set; }
    }
}
