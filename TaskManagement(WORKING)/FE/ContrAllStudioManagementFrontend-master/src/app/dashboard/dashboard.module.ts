import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { DashboardRouterModule } from './router/dashboard-router.module';
import { RouterModule } from '@angular/router';
import { ClientsViewComponent } from './clients-view/clients-view.component';
import { NgbPaginationModule, NgbTypeahead, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SortableDirective } from './directives/sortable.directive';
import { HomeComponent } from './home/home.component';
import { FormulaViewComponent } from './formula-view/formula-view.component';
import { AddFormulaComponent } from './formula-view/add-formula/add-formula.component';
import { LegalDaysViewComponent } from './legal-days-view/legal-days-view.component';
import { AddLegalDayComponent } from './legal-days-view/add-legal-day/add-legal-day.component';
import { EditLegalDayComponent } from './legal-days-view/edit-legal-day/edit-legal-day.component';
import { EditFormulaComponent } from './formula-view/edit-formula/edit-formula.component';
import { SrViewComponent } from './sr-view/sr-view.component';
import { EditSporComponent } from './sr-view/edit-spor/edit-spor.component';
import { EditRetainerComponent } from './sr-view/edit-retainer/edit-retainer.component';
import { AddRetainerComponent } from './sr-view/add-retainer/add-retainer.component';
import { AddSporComponent } from './sr-view/add-spor/add-spor.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SubDomainsViewComponent } from './sub-domains-view/sub-domains-view.component';
import { SubDomainDetailsComponent } from './sub-domains-view/sub-domain-details/sub-domain-details.component';
import {AccordionModule} from 'ngx-accordion';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EditIbanComponent } from './sub-domains-view/sub-domain-details/edit-iban/edit-iban.component';
import { AddIbanComponent } from './sub-domains-view/sub-domain-details/add-iban/add-iban.component';
import { AddProfileComponent } from './sub-domains-view/add-profile/add-profile.component';
import { AddSubDomainComponent } from './sub-domains-view/add-sub-domain/add-sub-domain.component';
import { AuthGuardService} from '../guards/auth-guard.service';
import { AddClientComponent } from './clients-view/add-client/add-client.component';
import { EditClientComponent } from './clients-view/edit-client/edit-client.component';
import { AdminGuardService } from '../guards/admin-guard.service';
import { UsersViewComponent } from './users-view/users-view.component';
import { AddUserComponent } from './users-view/add-user/add-user.component';
import { EditUserComponent } from './users-view/edit-user/edit-user.component';
import { ClockingViewComponent } from './clocking-view/clocking-view.component';
import { UsersDetailsComponent } from './clocking-view/users-details/users-details.component';
import { DatesDetailsComponent } from './clocking-view/dates-details/dates-details.component';
import { AddDateComponent } from './clocking-view/add-date/add-date.component';
import { EditDateComponent } from './clocking-view/edit-date/edit-date.component';

import { EditUserRoleComponent } from './users-view/edit-userRole/edit-userRole.component';
import { ConsultantGuardService } from '../guards/consultant-guard.service';
import { MasterGuard } from '../guards/master-guard.service';
import { NormalUserGuardService } from '../guards/normalUser-guard.service';
import { SecretarGuardService } from '../guards/secretar-guard.service';
import { VacationDaysViewComponent } from './vacation-days-view/vacation-days-view.component';
import { AddVacationDaysComponent } from './vacation-days-view/add-vacation-day/add-vacation-days-view.component';
import { EditVacationDayComponent } from './vacation-days-view/edit-vacation-day/edit-vacation-day.component';
import { TaskManagementComponent } from './task-management/task-management.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AddTaskStateComponent } from './task-management/add-task-state/add-task-state.component';
import { EditTaskStateComponent } from './task-management/edit-task-state/edit-task-state.component';
import { AddTaskComponent } from './task-management/add-task/add-task.component';
import { EditTaskComponent } from './task-management/edit-task/edit-task.component';

@NgModule({
  declarations: [
    DashboardComponent,
    NavBarComponent,
    ClientsViewComponent,
    SortableDirective,
    AddClientComponent,
    HomeComponent,
    FormulaViewComponent,
    AddFormulaComponent,
    LegalDaysViewComponent,
    AddLegalDayComponent,
    EditLegalDayComponent,
    EditFormulaComponent,
    SrViewComponent,
    EditSporComponent,
    EditRetainerComponent,
    AddRetainerComponent,
    AddSporComponent,
    SubDomainsViewComponent,
    SubDomainDetailsComponent,
    EditIbanComponent,
    AddIbanComponent,
    AddProfileComponent,
    AddSubDomainComponent,
    EditClientComponent,
    AddClientComponent,
    UsersViewComponent,
    AddUserComponent,
    EditUserComponent,
    ClockingViewComponent,
    UsersDetailsComponent,
    DatesDetailsComponent,
    AddDateComponent,
    EditDateComponent,
    EditUserRoleComponent,
    VacationDaysViewComponent,
    AddVacationDaysComponent,
    EditVacationDayComponent,
    TaskManagementComponent,
    AddTaskStateComponent,
    EditTaskStateComponent,
    AddTaskComponent,
    EditTaskComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    DashboardRouterModule,
    RouterModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    AccordionModule,
    NgbModule,
    DragDropModule
  ],
  entryComponents: [
    AddClientComponent,
    AddFormulaComponent,
    AddLegalDayComponent,
    EditFormulaComponent,
    EditLegalDayComponent,
    AddRetainerComponent,
    AddSporComponent,
    EditRetainerComponent,
    EditSporComponent,
    EditIbanComponent,
    AddIbanComponent,
    AddProfileComponent,
    AddSubDomainComponent,
    EditClientComponent,
    AddClientComponent,
    UsersViewComponent,
    AddUserComponent,
    EditUserComponent,
    AddDateComponent,
    EditDateComponent,
    EditUserRoleComponent,
    AddVacationDaysComponent,
    EditVacationDayComponent,
    AddTaskStateComponent,
    EditTaskStateComponent,
    AddTaskComponent,
    EditTaskComponent,
  ],
  providers: [
    DecimalPipe,
    AddLegalDayComponent,
    AuthGuardService,
    AdminGuardService,
    DatePipe,
    MasterGuard,
    AdminGuardService,
    ConsultantGuardService,
    NormalUserGuardService,
    SecretarGuardService,
  ]
})
export class DashboardModule { }
