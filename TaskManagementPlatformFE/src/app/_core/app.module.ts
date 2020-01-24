import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthHttpInterceptor } from '../http.interceptor';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DashboardModule } from '../dashboard/dashboard.module';
import { AccountModule } from '../account/account.module';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    DashboardModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AccountModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true }, ],
  bootstrap: [AppComponent]
})
export class AppModule { }
