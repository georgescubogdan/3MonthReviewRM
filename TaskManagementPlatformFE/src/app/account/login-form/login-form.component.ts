import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
              public toastrService: ToastrService) { }

  ngOnInit() {
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    if (!this.submited) {
      this.submited = true;
      this.auth.login(this.loginForm.value.email, this.loginForm.value.password)
      .then(success => {
        // localStorage.setItem('auth_key', success);
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
