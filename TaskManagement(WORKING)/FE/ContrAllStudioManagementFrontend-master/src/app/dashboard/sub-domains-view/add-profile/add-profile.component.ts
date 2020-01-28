import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DecimalPipe } from '@angular/common';
import { SubDomainService } from '../sub-domain.service';
import { ToastrService } from 'ngx-toastr';
import { UpdateTimestampService } from '../../services/update-timestamp.service';

@Component({
  selector: 'app-add-profile',
  templateUrl: './add-profile.component.html',
  styleUrls: ['./add-profile.component.css'],
  providers: [DecimalPipe, SubDomainService],

})

export class AddProfileComponent implements OnInit {
  activeButton = true;
  addProfForm = new FormGroup({
    name: new FormControl('', Validators.required),
    code: new FormControl('', Validators.required),
  });
  subDomainId: any;
  public onSubmitDateFirma() {
    this.addProfForm.markAsDirty();
    if (this.addProfForm.valid) {
      const data = {
        profileModelId: 0,
        ibans: [],
        name: this.addProfForm.value.name,
        code: this.addProfForm.value.code,
        subDomainId: this.subDomainId,
      };
      this.activeButton = false;
      this.service.addProfile(data).then(
        c => {
          this.activeModal.close('Success');
          this.updateTimestampService.updateTimestampSubDomains();
          this.activeButton = false;
          this.toastrService.success('', 'Profilul a fost adaugat cu succes!!');

        })
        .catch(fail => {
          this.toastrService.error('', 'Profilul nu a putut fi adaugat!!');
        });
    } else {
      const data = {
        profileModelId: 0,
        ibans: [],
        name: this.addProfForm.value.name,
        code: this.addProfForm.value.code,
        subDomainId: this.subDomainId,
      };
      this.toastrService.error('', 'Datele nu sunt valide!!');
      this.addProfForm.markAsTouched();
      this.addProfForm.markAsDirty();
    }
  }
  constructor(public activeModal: NgbActiveModal
            , public toastrService: ToastrService
            , public updateTimestampService: UpdateTimestampService
            , public service: SubDomainService) {
  }
  ngOnInit() {
    this.activeButton = true;
  }
}
