import { Component, OnInit } from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import { UpdateTimestampService } from '../../services/update-timestamp.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../user.service';
import { DecimalPipe } from '@angular/common';
import { RoleOptions } from '../role-options';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
  providers: [DecimalPipe, UserService]

})
export class EditUserComponent implements OnInit {
  roleOptions = RoleOptions;
  editUserForm = new FormGroup({
    userName: new FormControl('', [Validators.required]) ,
    email: new FormControl('', [Validators.required]) ,
    phoneNumber: new FormControl(''),
    lastName: new FormControl(''),
    firstName: new FormControl('')
    // role: new FormControl('')
    // sal:  new FormControl(''),
    // reg:  new FormControl('') ,
    // vmg:  new FormControl('') ,
    // ail: new FormControl('') ,
    // asf: new FormControl('') ,
    // imp: new FormControl('') ,
    // con: new FormControl(''),
  });
  user: any;
  public onEditSubmitUser() {
    this.editUserForm.markAsDirty();
    if (this.editUserForm.valid) {
      const data = {
        userName: this.editUserForm.value.userName,
        email: this.editUserForm.value.email,
        phoneNumber: this.editUserForm.value.phoneNumber,
        id: this.user.id,
        lastName: this.editUserForm.value.lastName,
        firstName: this.editUserForm.value.firstName
      };
      // console.log(data);

      this.service.editUser(data).then(
        c => {
          this.toastrService.success('', 'User-ul a fost editat cu succes!!');
          this.updateTimestampService.updateTimestampFormulas();
          this.activeModal.close('Success');
        })
        .catch(fail => {
          this.toastrService.error('', 'User-ul nu a putut fi editat!!');

        });
    } else {
      const data = {
        userName: this.editUserForm.value.userName,
        email: this.editUserForm.value.email,
        phoneNumber: this.editUserForm.value.phoneNumber,
        userId: this.user.userId,
        // sal: true,
        // reg: true ,
        // vmg: true ,
        // ail: true ,
        // asf: true ,
        // imp: true ,
        // con: true ,
      };
      this.toastrService.error('', 'Datele nu sunt valide!!');
      this.editUserForm.markAsTouched();
      this.editUserForm.markAsDirty();
  }
}
  constructor(public activeModal: NgbActiveModal
            , public updateTimestampService: UpdateTimestampService
            , public toastrService: ToastrService
            , public service: UserService) { }

  ngOnInit() {
    const value = {
      userName: this.user.userName,
      email: this.user.email,
      phoneNumber: this.user.phoneNumber,
      lastName: this.user.lastName,
      firstName: this.user.firstName
      // nume: this.client.name,
      // localitate: this.client.city,
      // judet: this.client.county,
      // sal: this.client.sal,
      // reg: this.client.reg,
      // vmg: this.client.vmg,
      // ail: this.client.ail,
      // asf: this.client.asf,
      // imp: this.client.imp,
      // con: this.client.con,
    };
    this.editUserForm.setValue(value);
  }

}
