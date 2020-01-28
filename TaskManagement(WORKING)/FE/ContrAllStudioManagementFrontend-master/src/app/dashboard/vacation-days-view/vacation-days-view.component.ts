import { Component, OnInit } from '@angular/core';
import {NgbDate, NgbCalendar, NgbDateStruct, NgbModal, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { VacationDaysViewService } from './vacation-days.service';
import { async } from '@angular/core/testing';
import { AddVacationDaysComponent } from './add-vacation-day/add-vacation-days-view.component';
import { AddFormulaComponent } from '../formula-view/add-formula/add-formula.component';
import { VacationDay } from './vacation-days';
import { ToastrService } from 'ngx-toastr';
import { EditVacationDayComponent } from './edit-vacation-day/edit-vacation-day.component';
import { AuthService } from 'src/app/auth.service';
import { UserService } from '../users-view/user.service';
import { isNullOrUndefined } from 'util';

// export const isDisabled = (date: NgbDate, current: {month: number}) => date.day === 13;
@Component({
  selector: 'app-vacation-days-view',
  templateUrl: './vacation-days-view.component.html',
  styleUrls: ['./vacation-days-view.component.css']
})
export class VacationDaysViewComponent implements OnInit {

  vacationDays: VacationDay[];
  total: number;

  hoveredDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;
  userName: string;
  roles: string[];

  constructor(public service: VacationDaysViewService,
              private calendar: NgbCalendar,
              public toastrService: ToastrService,
              private modalService: NgbModal,
              public formatter: NgbDateParserFormatter,
              private serviceAuth: AuthService,
              private userSerice: UserService) {

      this.fromDate = null;
      this.toDate = null;

      this.service.vacationDays$.subscribe(vacationDays => {
        this.vacationDays = vacationDays;
      });
      this.service.total$.subscribe(total => {
        this.total = total;
      });

    }

    isWeekend = (date: NgbDate, current: {month: number}) =>  this.calendar.getWeekday(date) >= 6;
    isDisabled(date: NgbDateStruct) {
      const d = new Date(date.year, date.month - 1, date.day);
      return  d.getDay() === 0 || d.getDay() === 6;
    }

    onDateSelection(date: NgbDate) {

      if (!this.fromDate && !this.toDate) {
        this.fromDate = date;
        this.service.fromDate = new Date(date.year, date.month - 1, date.day);
      } else if (this.fromDate && !this.toDate && (date.after(this.fromDate) || date.equals(this.fromDate))) {
        this.service.toDate = new Date(date.year, date.month - 1, date.day);
        this.toDate = date;
      } else {

        this.toDate = null;
        this.fromDate = date;
        this.service.fromDate = null;
        this.service.fromDate = new Date(date.year, date.month - 1, date.day);
      }

    }

    onManualFromDateSelection(event) {
      if (event.target.value === '') {
        this.service.fromDate = null;
      } else {
        this.service.fromDate = new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day);
      }
    }

    onManualToDateSelection(event) {
      if (event.target.value === '') {
        this.service.toDate = null;
      } else {
        if (this.toDate.year) {
          this.service.toDate = new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day);
        }
      }
    }
    isHovered(date: NgbDate) {
      return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
    }

    isInside(date: NgbDate) {
      return date.after(this.fromDate) && date.before(this.toDate);
    }

    isRange(date: NgbDate) {
      return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
    }

    validateInput(currentValue: NgbDate, input: string): NgbDate {
      const parsed = this.formatter.parse(input);
      return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
    }

    async ngOnInit() {
      this.roles = await this.serviceAuth.getCurrentUserRoles();

    }

    openVacationDayAdd() {
      const modalRef = this.modalService.open(AddVacationDaysComponent, {centered: true, windowClass: 'my-modal'});
      modalRef.componentInstance.name = 'Zile concediu';
      modalRef.result.then(
        async () => {
          this.service.fetchData(); },
          () => {});
        }

    openEditVacationDay(vacationDay: VacationDay) {
      const modalRef = this.modalService.open(EditVacationDayComponent, {centered: true, windowClass: 'my-modal'});
      modalRef.componentInstance.vacationDay = vacationDay;
      modalRef.componentInstance.name = 'Zile concediu';
      modalRef.result.then(
        async () => {
          this.service.fetchData(); },
          () => {  });
        }

    deleteVacationDay(vacationDay: VacationDay) {
      if (confirm('Esti sigur ca vrei sa stergi aceasta data ?')) {
        const id = vacationDay.vacationDayID;
        const abc = vacationDay.userId;

        this.service.deleteVacationDay(id).then(
          res => {
            this.service.fetchData();
            this.toastrService.success('', 'Aceasta data a fost stearsa!');
          })
          .catch(
            fail => {
              this.toastrService.error('', 'Aceasta data nu poate fi stearsa!');
            });
          }
        }

    }
