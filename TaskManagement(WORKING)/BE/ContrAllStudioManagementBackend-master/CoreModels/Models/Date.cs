using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace CoreModels.Models
{
    public class Date 
    {
        [Key]
        public int DateId { get; set; }
        public DateTime CurrentDate { get; set; }
        public int Hours { get; set; }

        public int Minutes { get; set; }
        public int Seconds { get; set; }
        public int UserId { get; set; }

        public virtual UserModel User { get; set; }

        public virtual List<Clocking> Clockings { get; set;}
        [NotMapped]
        public string TotalTime
        {
            get
            {   if(Hours == 0)
                {
                    if (Minutes == 0)
                    {
                        if (Seconds == 0) return "0";
                        else return (Seconds + "sec");
                    }
                    else return (Minutes + "min " + Seconds + "sec");
                }
                else return (Hours + "h " + Minutes + "min " + Seconds + "sec ");


            }
        }
    }
}
