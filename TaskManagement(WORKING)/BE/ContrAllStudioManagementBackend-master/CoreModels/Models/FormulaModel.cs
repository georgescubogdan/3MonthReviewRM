using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ContrAllStudioManagementBackend.Models
{
    public class FormulaModel
    {
        private string _name;
        private string _description;
        private string _formula;
        private string _priority;

        public FormulaModel()
        {
        }

        [Key]
        public int FormulaModelId { get; set; }
        public string Name
        {
            get => _name; set
            {
                _name = value;
            }
        }

        private bool _deletable = false;
        public bool Deletable
        {
            get => _deletable;
            set
            {
                _deletable = value;
            }
        }

        public string Formula
        {
            get => _formula; set
            {
                _formula = value;
            }
        }
        public string Description
        {
            get => _description; set
            {
                _description = value;
            }
        }

        public string Priority
        {
            get => _priority; set
            {
                _priority = value;
            }
        }
    }
}
