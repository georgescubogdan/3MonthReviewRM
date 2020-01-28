using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CoreModels.Models
{
    public class ClientModel
    {
        [Key]
        public string ClientId { get; set; }
        public string Name { get; set; }
        public string County { get; set; }
        public string City { get; set; }

        public bool Sal { get; set; }
        public bool Reg { get; set; }
        public bool Vmg { get; set; }
        public bool Ail { get; set; }
        public bool Asf { get; set; }
        public bool Imp { get; set; }
        public bool Con { get; set; }
    }
}
