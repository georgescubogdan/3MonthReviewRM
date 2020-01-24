import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from './login-form/login-form.component';
import { RegisterFormComponent } from './register-form/register-form.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountRoutingModule } from './account-routing.module';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    LoginFormComponent,
    RegisterFormComponent
  ],
  entryComponents: [
    RegisterFormComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule

  ]
})
export class AccountModule { }
