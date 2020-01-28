using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace CoreModels.Models
{
    public class TaskModel
    {
        [Key]
        public int TaskID { get; set; }
        public string TaskName { get; set; }
        public string Description { get; set; }
        public int TaskStateID { get; set; }
        public virtual TaskStateModel TaskState { get; set; }
        public List<UserTaskModel> UserTask { get; set; }
    }
}
