using System;
using System.Collections.Generic;
using System.Text;

namespace CoreModels.Models
{
    public class UserTaskModel
    {
        
        public int UserID { get; set; }
        public virtual UserModel UserModel { get; set; }
        public int TaskId { get; set; }
        public virtual TaskModel TaskModel { get; set; }
    }
}
