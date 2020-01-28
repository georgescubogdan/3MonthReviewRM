import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {

/*
   "email": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string",
  "phoneNumber": "string"
*/

  activeButton = true;
  submitted = false;
  registerForm: FormGroup;

  constructor(public service: AuthService,
              public toastrService: ToastrService,
              private formBuilder: FormBuilder,
              private router: Router,) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]) ,
      confirmPassword: new FormControl('', Validators.required) ,
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required]),
    }, {
      validator: this.mustMatch('password', 'confirmPassword')
    });
  }

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

  public onSubmitUser() {

    this.submitted = true;

    if (this.registerForm.valid) {
      const data = {
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        firstName: this.registerForm.value.firstName,
        lastName: this.registerForm.value.lastName,
        phoneNumber: this.registerForm.value.phoneNumber,
      };
      this.activeButton = false;
      this.service.register(data).then(
        c => {
          this.toastrService.success('', 'V-ati inregistrat cu succes!!');
          // console.log('Success');
          this.activeButton = true;
          this.router.navigate(['/login']);
        })
        .catch(fail => {
          // console.error(fail);
          this.toastrService.error('', 'Inregistrarea nu a avut succes!!');
        });
    } else {
      this.toastrService.error('', 'Datele nu sunt valide!!');
      this.registerForm.markAsTouched();
      this.registerForm.markAsDirty();
    }
  }

  get getRegisterFormControls() { return this.registerForm.controls; }

  cancelReg() {
    this.router.navigate(['/login']);
  }

}
