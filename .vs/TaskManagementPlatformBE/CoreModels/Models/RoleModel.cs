using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace CoreModels.Models
{
    public class RoleModel : IdentityRole<int>
    {
        public RoleModel() { }

        public RoleModel(string name)
        {
            Name = name;
        }
    }
}
