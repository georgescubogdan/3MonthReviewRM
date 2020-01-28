using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace CoreModels.Models
{
    public class Clocking
    {
        [Key]
        public int ClockingId { get; set; }
        
        public int DateId { get; set; }
        public virtual Date Date { get; set; }

        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }

        [NotMapped]
        public string TotalTime
        {   
            
            get
            {
                var res = EndTime - StartTime;
                if (res.Hours == 0)
                {
                    if (res.Minutes == 0)
                    {
                        if (res.Seconds == 0) return "0";
                        else return (res.Seconds + "sec");
                    }
                    else return (res.Minutes + "min " + res.Seconds + "sec");
                }
                else return (res.Hours + "h " + res.Minutes + "min " + res.Seconds + "sec");

            }
        }

    }
}
