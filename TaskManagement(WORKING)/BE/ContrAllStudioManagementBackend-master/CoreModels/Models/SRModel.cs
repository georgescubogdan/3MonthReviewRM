using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ContrAllStudioManagementBackend.Models
{
    public class SRModel
    {

        private string _name;
        private string _formula;
        private string _description;
        private int _priority;
        private bool _deletable;
        private bool _isSpor;

        public SRModel()
        {
        }

        [Key]
        public int SRModelId { get; set; }
        public string Description
        {
            get
            {
                return _description;
            }
            set
            {
                _description = value;
            }
        }

        public bool IsSpor
        {
            get
            {
                return _isSpor;
            }
            set
            {
                _isSpor = value;
            }
        }

        public string Name
        {
            get
            {
                return _name;
            }
            set
            {
                _name = value;
            }
        }

        public bool Deletable
        {
            get
            {
                return _deletable;
            }
            set
            {
                _deletable = value;
            }
        }

        public string Formula
        {
            get
            {
                return _formula;
            }
            set
            {
                _formula = value;
            }
        }

        public int Priority
        {
            get
            {
                return _priority;
            }
            set
            {
                _priority = value;
            }
        }
    }
}
