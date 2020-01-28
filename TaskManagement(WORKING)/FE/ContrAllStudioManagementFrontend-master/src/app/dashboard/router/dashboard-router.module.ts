import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ClientsViewComponent } from '../clients-view/clients-view.component';
import { HomeComponent } from '../home/home.component';
import { SrViewComponent } from '../sr-view/sr-view.component';
import { FormulaViewComponent } from '../formula-view/formula-view.component';
import { LegalDaysViewComponent } from '../legal-days-view/legal-days-view.component';
import { SubDomainsViewComponent } from '../sub-domains-view/sub-domains-view.component';
import { SubDomainDetailsComponent } from '../sub-domains-view/sub-domain-details/sub-domain-details.component';
import { AuthGuardService } from '../../guards/auth-guard.service';
import { AdminGuardService } from 'src/app/guards/admin-guard.service';
import { UsersViewComponent } from '../users-view/users-view.component';
import { ClockingViewComponent } from '../clocking-view/clocking-view.component';
import { UsersDetailsComponent } from '../clocking-view/users-details/users-details.component';
import { DatesDetailsComponent } from '../clocking-view/dates-details/dates-details.component';
import { GUARDS } from 'src/app/guards/GUARDS';
import { MasterGuard } from 'src/app/guards/master-guard.service';
import { VacationDaysViewComponent } from '../vacation-days-view/vacation-days-view.component';
import { TaskManagementComponent } from '../task-management/task-management.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        redirectTo: 'home',
        canActivate: [AuthGuardService],
        pathMatch: 'full',
      },
      {
        path: 'home',
        canActivate: [AuthGuardService],
        component: HomeComponent,
      },
      {
        path: 'clienti',
        canActivate: [AuthGuardService, MasterGuard],
        component: ClientsViewComponent,
        data: {
          guards: [
            GUARDS.GUARD1,
          ]
        }
      },
      {
        path: 'useri',
        canActivate: [AuthGuardService, MasterGuard],
        component: UsersViewComponent,
        data: {
          guards: [
            GUARDS.GUARD1,
          ]
        }
      },
      {
        path: 'clocking-view',
        canActivate: [AuthGuardService],
        component: ClockingViewComponent,
        children: [
          {
            path: 'user/:userId',
            canActivate: [AuthGuardService],
            component: UsersDetailsComponent
          },
          {
            path: 'year/:yearId',
            canActivate: [AuthGuardService],
            component: DatesDetailsComponent
          }
        ]
      },
      {
        path: 'Formula',
        canActivate: [AuthGuardService, MasterGuard],
        component: FormulaViewComponent,
        data: {
          guards: [
            GUARDS.GUARD1,
            GUARDS.GUARD2,
          ]
        }
      },
      {
        path: 'SRView',
        canActivate: [AuthGuardService, MasterGuard],
        component: SrViewComponent,
        data: {
          guards: [
            GUARDS.GUARD1,
            GUARDS.GUARD2,
          ]
        }
      },
      {
        path: 'legalDays',
        canActivate: [AuthGuardService, MasterGuard],
        component: LegalDaysViewComponent,
        data: {
          guards: [
            GUARDS.GUARD1,
            GUARDS.GUARD2,
          ]
        }
      },
      {
        path: 'SubDomains',
        canActivate: [AuthGuardService, MasterGuard],
        component: SubDomainsViewComponent,
        data: {
          guards: [
            GUARDS.GUARD1,
            GUARDS.GUARD2,
          ]
        },
        children: [
          {
            path: 'profile/:profileModelId',
            canActivate: [AuthGuardService],
            component: SubDomainDetailsComponent
          }
        ]
      },
      {
        path: 'vacation-days-view',
        canActivate: [AuthGuardService],
        component: VacationDaysViewComponent,
      },
      {
        path: 'task-management',
        canActivate: [AuthGuardService],
        component: TaskManagementComponent,
      },
      {
        path: 'facturi/facturaNoua',
        canActivate: [AuthGuardService],
        redirectTo: 'newInvoice',
      },
      {
        path: '**',
        canActivate: [AuthGuardService],
        redirectTo: 'home',
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class DashboardRouterModule { }
