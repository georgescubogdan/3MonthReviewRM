import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PasswordComponent } from '../password/password.component';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  loginErrorMessage: string;
  submited = false;
  loginForm = new FormGroup({

    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),

  });

  constructor(private auth: AuthService,
              private router: Router,
              public toastrService: ToastrService,
              private modalService: NgbModal) { }
  ngOnInit() {
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    if (!this.submited) {
      this.submited = true;
      this.auth.login(this.loginForm.value.email, this.loginForm.value.password)
      .then(success => {
        this.auth.shouldChangePassword().then(v => {
          if (v) {
            const modalRef = this.modalService.open(PasswordComponent, {centered: true, windowClass: 'my-modal'});
            modalRef.componentInstance.name = 'Password';
            modalRef.result.then(
              async () => { console.log('When user closes'); },
                    () => { console.log('Backdrop click'); });
          }
        });

        this.router.navigate(['/dashboard']);
        this.toastrService.success('', 'Autentificare reusita!!');
      })
      .catch(error => {
        this.loginErrorMessage = '<strong>Error!</strong> Invalid email/password.';
        this.toastrService.error('', 'Autentificare nereusita!!');

      });
      this.submited = false;
    }


  }
}
