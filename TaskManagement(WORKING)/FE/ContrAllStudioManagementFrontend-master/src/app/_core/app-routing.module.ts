import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard/dashboard.component';
import { AuthGuardService } from '../guards/auth-guard.service';

const routes: Routes = [
  { path: 'account', loadChildren: '../account/account.module#AccountModule', },
 // { path: 'dashboard', loadChildren: '../dashboard/dashboard.module#DashboardModule', },
  { path: 'dashboard', component: DashboardComponent,  canActivate: [AuthGuardService], },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
