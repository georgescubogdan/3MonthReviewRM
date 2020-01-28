import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DecimalPipe } from '@angular/common';
import { IbanService } from '../ibans.service';
import { ToastrService } from 'ngx-toastr';
import { UpdateTimestampService } from '../../../services/update-timestamp.service';
import { FinanceOptions } from '../finance-options';

@Component({
  selector: 'app-add-iban',
  templateUrl: './add-iban.component.html',
  styleUrls: ['./add-iban.component.css'],
  providers: [DecimalPipe, IbanService],

})

export class AddIbanComponent implements OnInit {
  financeOptions = FinanceOptions;
  activeButton = true;
  addIbanForm = new FormGroup({
    iban: new FormControl('', Validators.required),
    financeSource: new FormControl('', Validators.required),
    formula: new FormControl('', Validators.required),
  });
  profileID: any;
  public onSubmitDateFirma() {
    this.addIbanForm.markAsDirty();
    if (this.addIbanForm.valid) {
      const data = {
        ibanModelId: 0,
        iban: this.addIbanForm.value.iban,
        formula: this.addIbanForm.value.formula,
        financeSource: this.addIbanForm.value.financeSource,
        profileModelId: this.profileID,
      };
      this.activeButton = false;
      this.service.addIban(data).then(
        c => {
          this.activeModal.close('Success');
          this.updateTimestampService.updateTimestampSubDomains();
          this.toastrService.success('', 'Ibanul a fost adaugat cu succes!!');
          this.activeButton = true;

        })
        .catch(fail => {
          this.toastrService.error('', 'Ibanul nu a putut fi adaugat!!');
        });
    } else {
      const data = {
        ibanModelId: 0,
        iban: this.addIbanForm.value.iban,
        formula: this.addIbanForm.value.formula,
        financeSource: 'Credite interne',
        profileModelId: this.profileID,
      };
      this.toastrService.error('', 'Datele nu sunt valide!!');
      this.addIbanForm.markAsTouched();
      this.addIbanForm.markAsDirty();
    }
  }
  constructor(public activeModal: NgbActiveModal
            , public toastrService: ToastrService
            , public updateTimestampService: UpdateTimestampService
            , public service: IbanService) {
  }
  ngOnInit() {
    this.activeButton = true;
    const value = {
      iban: '',
      formula: '',
      financeSource: 'Integral de la buget',
    };
    this.addIbanForm.setValue(value);
  }
}
