import { Component, OnInit, PipeTransform, QueryList, ViewChildren, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ClientService } from '../client.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import { UpdateTimestampService } from '../../services/update-timestamp.service';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.css'],
  providers: [DecimalPipe, ClientService]

})
export class AddClientComponent implements OnInit {

activeButton = true;
registerFormAddUser = new FormGroup({
  nume: new FormControl('', [Validators.required]),
  localitate: new FormControl('', Validators.required),
  judet: new FormControl('', Validators.required),
  codSistem: new FormControl(''),
});
ngOnInit() {
  this.activeButton = true;
}
  public onSubmitDateAddUser() {
    if (this.registerFormAddUser.valid) {
      // console.log(this.registerFormAddUser.value);
      const data = {
        name: this.registerFormAddUser.value.nume,
        city: this.registerFormAddUser.value.localitate,
        county: this.registerFormAddUser.value.judet,
        codSystem: 0,
      };
      this.activeButton = false;
      this.service.addClient(data).then(
        c => {
          this.toastrService.success('', 'Clientul a fost adaugat cu succes!!');
          // console.log('Success');
          this.updateTimestampService.updateTimestampFormulas();
          this.activeButton = true;
          this.activeModal.close('Success');
        })
        .catch(fail => {
          // console.log('Failed ' + fail);
          this.toastrService.error('', 'Formula nu a putut fi adaugata!!');
        });
    } else {
      this.toastrService.error('', 'Datele nu sunt valide!!');
      this.registerFormAddUser.markAsTouched();
      this.registerFormAddUser.markAsDirty();
    }
  }

  setUserCategoryValidators() {
    // const cuiControl = this.registerFormFirma.get('cui');
    // const regControl = this.registerFormFirma.get('reg_comert');

    // this.registerFormFirma.get('persJuridica').valueChanges
    //   .subscribe(persJuridica => {

    //     if (persJuridica === true) {
    //       cuiControl.setValidators([Validators.required]);
    //       regControl.setValidators([Validators.required]);
    //     }

    //     if (persJuridica === false) {
    //       cuiControl.setValidators(null);
    //       regControl.setValidators(null);
    //     }

    //     cuiControl.updateValueAndValidity();
    //     regControl.updateValueAndValidity();
    //   });
  }

  constructor(public activeModal: NgbActiveModal,
              public service: ClientService,
              public toastrService: ToastrService,
              public updateTimestampService: UpdateTimestampService ) {
      this.setUserCategoryValidators();
  }
}
