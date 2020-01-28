using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CoreModels.Models
{
    public class IbanModel
    {
        private string _iban;
        private string _formula;
        private string _financeSource;

        public IbanModel()
        {
        }


        public virtual ProfileModel Profile { get; set; }

        [Key]
        public int IbanModelId { get; set; }

        public string Iban
        {
            get
            {
                return _iban;
            }
            set
            {
                _iban = value;
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

        public string FinanceSource
        {
            get
            {
                return _financeSource;
            }
            set
            {
                _financeSource = value;
            }
        }

        [Column("Profile_ProfileModelId")]
        public int ProfileModelId { get; set; }
    }
}
