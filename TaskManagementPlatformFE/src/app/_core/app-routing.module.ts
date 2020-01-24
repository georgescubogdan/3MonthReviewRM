import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../guards/auth-guard.service';
import { DashboardComponent } from '../dashboard/dashboard/dashboard.component';


const routes: Routes = [
  {path: 'account', loadChildren: '../account/account.module#AccountModule', },
  { path: 'dashboard', component: DashboardComponent,  canActivate: [AuthGuardService], },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
