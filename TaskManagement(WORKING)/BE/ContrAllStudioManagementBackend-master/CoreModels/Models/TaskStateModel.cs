using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace CoreModels.Models
{
    public class TaskStateModel
    {
        [Key]
        public int TaskStateID { get; set; }
        public string Name { get; set; }
        public int OrderNr { get; set; }
    }
}
