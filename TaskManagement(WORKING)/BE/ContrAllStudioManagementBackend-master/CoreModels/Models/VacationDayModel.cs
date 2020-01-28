using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CoreModels.Models
{
    public class VacationDayModel
    {
        [Key]
        public int VacationDayID { get; set; }
        public int UserId { get; set; }
        public virtual UserModel User { get; set; }
        public DateTime From { get; set; }
        public DateTime To { get; set; }
        public string Reason { get; set; }
        public bool State { get; set; }
    }
}
