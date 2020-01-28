import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { LoginFormComponent } from './login-form/login-form.component';
import { HttpClientModule } from '@angular/common/http';
import { AcountRoutingModule } from './account-routing.module';
import { PasswordComponent } from './password/password.component';

@NgModule({
  declarations: [
    LoginFormComponent,
    PasswordComponent
  ],
  entryComponents: [
    PasswordComponent
  ],
  imports: [
    CommonModule,
    AcountRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule
  ]
})
export class AccountModule { }
