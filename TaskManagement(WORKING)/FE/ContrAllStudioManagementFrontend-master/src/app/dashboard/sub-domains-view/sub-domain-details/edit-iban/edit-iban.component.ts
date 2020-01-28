import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DecimalPipe } from '@angular/common';
import { IbanService } from '../ibans.service';
import {ToastrService} from 'ngx-toastr';
import { UpdateTimestampService } from '../../../services/update-timestamp.service';
import { FinanceOptions } from '../finance-options';
@Component({
  selector: 'app-edit-iban',
  templateUrl: './edit-iban.component.html',
  styleUrls: ['./edit-iban.component.css'],
  providers: [DecimalPipe, IbanService],

})

export class EditIbanComponent implements OnInit {
  financeOptions = FinanceOptions;
  addIbanForm = new FormGroup({
    iban: new FormControl('', Validators.required),
    formula: new FormControl('', Validators.required),
    financeSource: new FormControl('', Validators.required),
  });
  iban: any;
  public onSubmitDateFirma() {
    this.addIbanForm.markAsDirty();
    if (this.addIbanForm.valid) {
      const data = {
        ibanModelId: this.iban.ibanModelId,
        iban: this.addIbanForm.value.iban,
        formula: this.addIbanForm.value.formula,
        financeSource: this.addIbanForm.value.financeSource,
        profileModelId: this.iban.profileModelId,
      };
      this.service.changeIban(data, this.iban.ibanModelId).then(
        c => {
          this.activeModal.close('Success');
          this.updateTimestampService.updateTimestampSubDomains();
          this.toastrService.success('', 'Ibanul a fost schimbat cu succes!!');

        })
        .catch(fail => {
          this.toastrService.error('', 'Ibanul nu a putut fi schimbat!!');
        });
    } else {
      const data = {
        ibanModelId: this.iban.ibanModelId,
        iban: this.addIbanForm.value.iban,
        formula: this.addIbanForm.value.formula,
        financeSource: this.iban.financeSource,
        profileModelId: this.iban.profileModelId,
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
    const value = {
      iban: this.iban.iban,
      formula: this.iban.formula,
      financeSource: this.iban.financeSource,
    };
    this.addIbanForm.setValue(value);
  }
}
