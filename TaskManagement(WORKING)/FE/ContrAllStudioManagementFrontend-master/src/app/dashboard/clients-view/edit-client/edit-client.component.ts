import { Component, OnInit } from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import { UpdateTimestampService } from '../../services/update-timestamp.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from '../client.service';
import { DecimalPipe } from '@angular/common';
@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.css'],
  providers: [DecimalPipe, ClientService]

})
export class EditClientComponent implements OnInit {
  editClientForm = new FormGroup({
    nume: new FormControl('', [Validators.required]) ,
    localitate: new FormControl('', [Validators.required]) ,
    judet: new FormControl(''),
    sal:  new FormControl(''),
    reg:  new FormControl('') ,
    vmg:  new FormControl('') ,
    ail: new FormControl('') ,
    asf: new FormControl('') ,
    imp: new FormControl('') ,
    con: new FormControl(''),
  });
  client: any;
  public onEditSubmitClient() {
    this.editClientForm.markAsDirty();
    if (this.editClientForm.valid) {
      const data = {
        name: this.editClientForm.value.nume,
        city: this.editClientForm.value.localitate,
        county: this.editClientForm.value.judet,
        clientId: this.client.clientId,
        sal: this.editClientForm.value.sal ,
        reg: this.editClientForm.value.reg ,
        vmg: this.editClientForm.value.vmg ,
        ail: this.editClientForm.value.ail ,
        asf: this.editClientForm.value.asf ,
        imp: this.editClientForm.value.imp ,
        con: this.editClientForm.value.con ,
      };
      this.service.editClient(data).then(
        c => {
          this.toastrService.success('', 'Clientul a fost editat cu succes!!');
          this.updateTimestampService.updateTimestampFormulas();
          this.activeModal.close('Success');
        })
        .catch(fail => {
          this.toastrService.error('', 'Clientul nu a putut fi editat!!');

        });
    } else {
      const data = {
        name: this.editClientForm.value.nume,
        city: this.editClientForm.value.localitate,
        county: this.editClientForm.value.judet,
        clientId: this.client.clientId,
        sal: true,
        reg: true ,
        vmg: true ,
        ail: true ,
        asf: true ,
        imp: true ,
        con: true ,
      };
      this.toastrService.error('', 'Datele nu sunt valide!!');
      this.editClientForm.markAsTouched();
      this.editClientForm.markAsDirty();
  }
}
  constructor(public activeModal: NgbActiveModal
            , public updateTimestampService: UpdateTimestampService
            , public toastrService: ToastrService
            , public service: ClientService) { }

  ngOnInit() {
    const value = {
      nume: this.client.name,
      localitate: this.client.city,
      judet: this.client.county,
      sal: this.client.sal,
      reg: this.client.reg,
      vmg: this.client.vmg,
      ail: this.client.ail,
      asf: this.client.asf,
      imp: this.client.imp,
      con: this.client.con,
    };
    this.editClientForm.setValue(value);
  }

}
