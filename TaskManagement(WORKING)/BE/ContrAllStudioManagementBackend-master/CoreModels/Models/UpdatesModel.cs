using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;


namespace ContrAllStudioManagementBackend.Models
{
    public class UpdatesModel
    {
        [Key]
        public int UpdatesModelId { get; set; }
        public DateTime LegalDaysUpdateTime { get; set; }
        public DateTime FormulaUpdateTime { get; set; }
        public DateTime SRUpdateTime { get; set; }
        public DateTime SubDomainsUpdateTime { get; set; }
    }
}
