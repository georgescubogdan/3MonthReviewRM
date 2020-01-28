
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from '../../clients-view/client.service';
import { DecimalPipe } from '@angular/common';
import { LegalDayService } from '../legal-days.service';
import {ToastrService} from 'ngx-toastr';
import { UpdateTimestampService } from '../../services/update-timestamp.service';

@Component({
  selector: 'app-add-legal-day',
  templateUrl: './add-legal-day.component.html',
  styleUrls: ['./add-legal-day.component.css'],
  providers: [DecimalPipe, ClientService, LegalDayService],

})
export class AddLegalDayComponent implements OnInit {
  activeButton = true;
  addDayForm = new FormGroup({
    denumire: new FormControl('', [Validators.required]),
    zi: new FormControl('', [Validators.required, Validators.pattern('^([1-9]|[12][0-9]|3[01])$')]),
    luna: new FormControl('',  [Validators.required, Validators.pattern('^(?:[1-9]|0[1-9]|10|11|12)$')]),
  });

  public onSubmitDateFirma() {
    if (this.addDayForm.valid) {
      const data = {
        name: this.addDayForm.value.denumire,
        legalDayID: this.service.maxId,
        day: this.addDayForm.value.zi,
        month: this.addDayForm.value.luna,
      };
      this.activeButton = false;
      this.service.addLegalDay(data).then(
        c => {
          this.toastrService.success('', 'Ziua libera a fost adaugata cu succes!!');
          this.updateTimestampService.updateTimestampLegalDays();
          this.activeButton = true;
          this.activeModal.close('Success');
        })
        .catch(fail => {
          this.toastrService.error('', ' Ziua libera nu a putut fi adaugata!!');

        });
    } else {
      this.toastrService.error('', 'Datele nu sunt valide!!');
      this.addDayForm.markAsTouched();
      this.addDayForm.markAsDirty();
    }
  }
  constructor(public activeModal: NgbActiveModal
            , public toastrService: ToastrService
            , public service: LegalDayService
            , public updateTimestampService: UpdateTimestampService) {
  }
  ngOnInit() {
    this.activeButton = true;
  }
}
