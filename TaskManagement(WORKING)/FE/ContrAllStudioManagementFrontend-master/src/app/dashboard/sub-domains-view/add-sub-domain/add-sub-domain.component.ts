import { Component, OnInit } from '@angular/core';
import { SubDomainService } from '../sub-domain.service';
import { DecimalPipe } from '@angular/common';
import { ClientService } from '../../clients-view/client.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateTimestampService } from '../../services/update-timestamp.service';


@Component({
  selector: 'app-add-sub-domain',
  templateUrl: './add-sub-domain.component.html',
  styleUrls: ['./add-sub-domain.component.css'],
  providers: [DecimalPipe, ClientService, SubDomainService],
})
export class AddSubDomainComponent implements OnInit {
  activeButton = true;
  addSubDomForm = new FormGroup({
    name: new FormControl('', Validators.required),
    code: new FormControl('', Validators.required),
    angCode: new FormControl('', Validators.required),
    angId: new FormControl('', Validators.required)});


public onSubmitSubDomain() {
  this.addSubDomForm.markAsDirty();
  if (this.addSubDomForm.valid) {
    const data = {
      subDomainId: 0,
      name: this.addSubDomForm.value.name,
      code: this.addSubDomForm.value.code,
      profiles: [],
      enable: true,
      angCode: this.addSubDomForm.value.angCode,
      angId: this.addSubDomForm.value.angId,
    };
    this.activeButton = false;
    this.service.addSubDomain(data).then(
      c => {
        this.activeModal.close('Success');
        this.updateTimestampService.updateTimestampSubDomains();
        this.toastrService.success('', 'Subdomeniul a fost adaugat cu succes!!');
        this.activeButton = true;

      })
      .catch(fail => {
        this.toastrService.error('', 'Subdomeniul nu a putut fi adaugat!!');
      });
  } else {
    const data = {
      subDomainId: 0,
      name: this.addSubDomForm.value.name,
      code: this.addSubDomForm.value.code,
      profiles: [],
      enable: true,
      angCode: this.addSubDomForm.value.angCode,
      angId: this.addSubDomForm.value.angId,
    };
    this.toastrService.error('', 'Datele nu sunt valide!!');
    this.addSubDomForm.markAsTouched();
    this.addSubDomForm.markAsDirty();
  }
}
  constructor(public activeModal: NgbActiveModal,
              public toastrService: ToastrService,
              public updateTimestampService: UpdateTimestampService,
              public service: SubDomainService) { }

  ngOnInit() {
    this.activeButton = true;
  }
}
