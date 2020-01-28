using System;
using System.Collections.Generic;
using System.Text;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CoreModels.Models
{
    public class ProfileModel
    {
        private String _code;

        private List<IbanModel> _ibans;

        public ProfileModel()
        {
        }

        public virtual List<IbanModel> Ibans
        {
            get
            {
                return _ibans;
            }
            set
            {
                _ibans = value;
            }
        }

        public virtual SubDomainModel SubDomain { get; set; }

        [Key]
        public int ProfileModelId { get; set; }

        public String Code
        {
            get
            {
                return _code;
            }
            set
            {
                _code = value;
            }
        }

        private String _name;
        public String Name
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
        [Column("SubDomain_SubDomainId")]
        public int SubDomainId { get; set; }
    }
}
