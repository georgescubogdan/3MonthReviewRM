using System;
using System.Collections.Generic;
using System.Text;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;

namespace CoreModels.Models
{
    public class SubDomainModel
    {
        private String _name;
        private String _code;
        private List<ProfileModel> _profiles;
        private bool _enable;
        private string _angCode, _angId;

        public SubDomainModel()
        {
        }

        public SubDomainModel(String x)
        {
            _name = x;
            _profiles = new List<ProfileModel>();
        }

        [Key]
        public int SubDomainId { get; set; }

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

        public virtual List<ProfileModel> Profiles
        {
            get
            {
                return _profiles;
            }
            set
            {
                _profiles = value;
            }
        }

        public bool Enable
        {
            get
            {
                return _enable;
            }
            set
            {
                _enable = value;
            }
        }

        public string AngCode
        {
            get
            {
                return _angCode;
            }
            set
            {
                _angCode = value;
            }
        }

        public string AngId
        {
            get
            {
                return _angId;
            }
            set
            {
                _angId = value;
            }
        }
    }
}
