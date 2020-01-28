import { Component, OnInit } from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import { UpdateTimestampService } from '../../dashboard/services/update-timestamp.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css'],

})
export class PasswordComponent implements OnInit {
    passwordForm = new FormGroup({
        email: new FormControl('', [Validators.required]) ,
        oldPassword: new FormControl('', [Validators.required, Validators.minLength(6)]) ,
        newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]) ,
        confirmNewPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });
  user: any;
  public changePassword() {
    this.passwordForm.markAsDirty();
    if (this.passwordForm.valid) {
      const data = {
        email: this.passwordForm.value.email,
        oldPassword: this.passwordForm.value.oldPassword,
        newPassword: this.passwordForm.value.newPassword,
        confirmNewPassword: this.passwordForm.value.confirmNewPassword,
      };
      // console.log(data);

      this.auth.changePassword(data.email, data.oldPassword, data.newPassword)
        .then(c => {
          this.toastrService.success('', 'Parola a fost modificată cu succes!!');
          this.activeModal.close('Success');
        }, fail => {
          this.toastrService.error('', 'Parola nu a putut fi modificată!!');
        });
    } else {
      const data = {
        email: this.passwordForm.value.email,
        oldPassword: this.passwordForm.value.oldPassword,
        newPassword: this.passwordForm.value.newPassword,
        confirmNewPassword: this.passwordForm.value.confirmNewPassword,
      };
      this.toastrService.error('', 'Datele nu sunt valide!!');
      this.passwordForm.markAsTouched();
      this.passwordForm.markAsDirty();
  }
}
  constructor(public activeModal: NgbActiveModal
            , public updateTimestampService: UpdateTimestampService
            , public toastrService: ToastrService
            , private auth: AuthService
            , private router: Router
            ) {
            }

  ngOnInit() {
    // const value = {
    //     oldPassword: this.user.oldPassword,
    //     newPassword: this.user.newPassword,
    //     confirmNewPassword: this.user.confirmNewPassword,
    // };
    // this.passwordForm.setValue(value);
  }

  get getPasswordFormControls() { return this.passwordForm.controls; }

}
