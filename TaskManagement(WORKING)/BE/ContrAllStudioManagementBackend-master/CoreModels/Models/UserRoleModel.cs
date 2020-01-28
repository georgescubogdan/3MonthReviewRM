using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace CoreModels.Models
{
    public class UserRoleModel : IdentityUserRole<int>
    {
        public UserModel UserModel { get; set; }
        public RoleModel RoleModel { get; set; }
    }
}
