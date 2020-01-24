import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthGuardService } from '../guards/auth-guard.service';
import { DashboardRouterModule } from './router/dashboard-router.module';



@NgModule({
  declarations: [
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    DashboardRouterModule
  ],
  providers: [
    AuthGuardService,
  ],
})
export class DashboardModule { }
