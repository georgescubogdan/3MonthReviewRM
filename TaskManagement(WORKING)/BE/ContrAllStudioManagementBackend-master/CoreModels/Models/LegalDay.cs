using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ContrAllStudioManagementBackend.Models
{
    public class LegalDay
    {
        private string _name;
        private int _day;
        private int _month;
        [Key]
        public int LegalDayID { get; set; }
        public String Name
        {
            get => _name;
            set
            {
                _name = value;
            }
        }
        public int Day
        {
            get => _day;
            set
            {
                _day = value;
            }
        }
        public int Month
        {
            get => _month;
            set
            {
                _month = value;
            }
        }
    }
}
