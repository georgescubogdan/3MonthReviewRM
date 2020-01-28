import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from '../../clients-view/client.service';
import { DecimalPipe } from '@angular/common';
import { LegalDayService } from '../legal-days.service';
import {ToastrService} from 'ngx-toastr';
import { UpdateTimestampService } from '../../services/update-timestamp.service';

@Component({
  selector: 'app-edit-legal-day',
  templateUrl: './edit-legal-day.component.html',
  styleUrls: ['./edit-legal-day.component.css'],
  providers: [DecimalPipe, ClientService, LegalDayService],

})
export class EditLegalDayComponent implements OnInit {
  addDayForm = new FormGroup({
    denumire: new FormControl('', [Validators.required]),
    zi: new FormControl('', [Validators.required, Validators.pattern('^([1-9]|[12][0-9]|3[01])$')]),
    codZi: new FormControl('', Validators.required),
    luna: new FormControl('',  [Validators.required, Validators.pattern('^(?:[1-9]|0[1-9]|10|11|12)$')]),
  });
  legalDay: any;
  public onSubmitDateFirma() {
    this.addDayForm.markAsDirty();
    if (this.addDayForm.valid) {
      const data = {
        name: this.addDayForm.value.denumire,
        legalDayID: this.addDayForm.value.codZi,
        day: this.addDayForm.value.zi,
        month: this.addDayForm.value.luna,
      };
      this.service.changeLegalDay(data, data.legalDayID).then(
        c => {
          this.activeModal.close('Success');
          this.updateTimestampService.updateTimestampLegalDays();
          this.toastrService.success('', 'Ziua libera schimbata cu succes!!');

        })
        .catch(fail => {
          this.toastrService.error('', 'Ziua libera nu a putut fi schimbata!!');
        });
    } else {
      const data = {
        name: this.addDayForm.value.denumire,
        legalDayID: this.addDayForm.value.codZi,
        day: this.addDayForm.value.zi,
        month: this.addDayForm.value.luna,
      };
      this.toastrService.error('', 'Datele nu sunt valide!!');
      this.addDayForm.markAsTouched();
      this.addDayForm.markAsDirty();
    }
  }
  constructor(public activeModal: NgbActiveModal
            , public toastrService: ToastrService
            , public updateTimestampService: UpdateTimestampService
            , public service: LegalDayService) {
  }
  ngOnInit() {
    const value = {
      zi: this.legalDay.day,
      denumire: this.legalDay.name,
      luna: this.legalDay.month,
      codZi: this.legalDay.legalDayID,
    };
    this.addDayForm.setValue(value);
  }
}
