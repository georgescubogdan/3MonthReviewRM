import { Component, OnInit, PipeTransform, QueryList, ViewChildren, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { UserService } from '../user.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import { UpdateTimestampService } from '../../services/update-timestamp.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
  providers: [DecimalPipe, UserService]

})
export class AddUserComponent implements OnInit {

activeButton = true;
registerForm: FormGroup;
shouldGeneratePassword = true;
submitted = false;

ngOnInit() {
  this.registerForm = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
    phoneNumber: ['', Validators.required]
}, {
    validator: this.mustMatch('password', 'confirmPassword')
});
  this.activeButton = true;
}

  public onSubmitUser() {
    // console.log('intra');

    this.submitted = true;

    if (this.registerForm.valid) {
      // console.log(this.registerForm.value);
      const data = {
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        firstName: this.registerForm.value.firstName,
        lastName: this.registerForm.value.lastName,
        phoneNumber: this.registerForm.value.phoneNumber,
        shouldGeneratePassword: this.shouldGeneratePassword
      };
      if (this.shouldGeneratePassword) {
        data.password = this.generatePassword();
      }
      this.activeButton = false;
      this.service.addUser(data).then(
        c => {
          this.toastrService.success('', 'User-ul a fost adaugat cu succes!!');
          // console.log('Success');
          this.activeButton = true;
          this.activeModal.close('Success');
        })
        .catch(fail => {
          // console.error(fail);
          this.toastrService.error('', 'User-ul nu a putut fi adaugat!!');
        });
    } else {
      this.toastrService.error('', 'Datele nu sunt valide!!');
      this.registerForm.markAsTouched();
      this.registerForm.markAsDirty();
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

  public generatePasswordEventHandler(event: any) {
    if (event.target.checked) { // checked
      this.shouldGeneratePassword = true;
      this.registerForm.controls.password.setValidators(null);
      this.registerForm.controls.password.disable();
      this.registerForm.controls.confirmPassword.setValidators(null);
      this.registerForm.controls.confirmPassword.disable();
      this.registerForm.controls.password.setValue('');
    } else { // unchecked
      this.shouldGeneratePassword = false;
      this.registerForm.controls.password.setValidators([Validators.required, Validators.minLength(6)]);
      this.registerForm.controls.password.enable();
      this.registerForm.controls.confirmPassword.setValidators([Validators.required]);
      this.registerForm.controls.confirmPassword.enable();
    }
  }

  get getRegisterFormControls() { return this.registerForm.controls; }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    };
}

  generatePassword() {

    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPWRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*-_=+\\|:;\',.\<>/?~';

    let newPassword = '';

    for (let i = 0; i < 3; i++) {
      newPassword += lowercase[Math.floor(Math.random() * lowercase.length)];
      newPassword += uppercase[Math.floor(Math.random() * uppercase.length)];
      newPassword += numbers[Math.floor(Math.random() * numbers.length)];
      newPassword += symbols[Math.floor(Math.random() * symbols.length)];
    }

    return newPassword;
  }

  constructor(public activeModal: NgbActiveModal,
              public service: UserService,
              public toastrService: ToastrService,
              public updateTimestampService: UpdateTimestampService,
              private formBuilder: FormBuilder ) {
      this.setUserCategoryValidators();
  }
}
