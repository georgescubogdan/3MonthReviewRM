import { Component, OnInit } from '@angular/core';
import {NgbDate, NgbCalendar, NgbDateStruct, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { VacationDaysViewService } from '../vacation-days.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// export const isDisabled = (date: NgbDate, current: {month: number}) => date.day === 13;
@Component({
  selector: 'app-vacation-days-view',
  templateUrl: './add-vacation-days-view.component.html',
  styleUrls: ['./add-vacation-days-view.component.css']
})
export class AddVacationDaysComponent implements OnInit {

  activeButton = true;

  hoveredDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;
  userId: number;

  addVacationDayForm = new FormGroup({
    reason: new FormControl('', Validators.required),
  });

  constructor(public service: VacationDaysViewService,
              private serviceAuth: AuthService,
              private calendar: NgbCalendar,
              public activeModal: NgbActiveModal,
              public toastrService: ToastrService,
              ) {
    if (calendar.getWeekday(calendar.getToday()) < 6) {
      this.fromDate = calendar.getToday();
      this.fromDate = calendar.getToday()
    } else {
      this.fromDate = calendar.getNext(calendar.getToday(), 'd', 2);
      this.fromDate = calendar.getNext(calendar.getToday(), 'd', 2);
    }

    // this.fromDate = calendar.getToday();
    // this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }

  isWeekend = (date: NgbDate, current: {month: number}) =>  this.calendar.getWeekday(date) >= 6;
  isDisabled(date: NgbDateStruct) {
    const d = new Date(date.year, date.month - 1, date.day);
    return  d.getDay() === 0 || d.getDay() === 6;
  }

  ngOnInit() {
    this.activeButton = true;
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && (date.after(this.fromDate) || date.equals(this.fromDate))) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
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

   public async onSubmitVacation() {
      this.activeButton = false;
      if (this.toDate) {
      const vacationToAdd = {
        vacationDayID: 0,
        userId: (await this.serviceAuth.getCurrentUserData()).id,
        from: new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day + 1),
        to: new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day + 1),
        reason: this.addVacationDayForm.value.reason,
        state: false,
        user: null,
      };

      this.service.addVacationDay(vacationToAdd).then(
        c => {
          this.activeModal.close('Success');
          this.toastrService.success('', 'Cererea de concediu a fost trimisă cu succes!');
          this.activeButton = true;
      })
      .catch(fail => {
        this.toastrService.error('', 'Cererea de concediu nu a putut fi trimisă!');
      });
    }
  }

  public daysToAdd() {
    const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (!this.toDate) {
      return 0;
    }
    if (this.fromDate.year === this.toDate.year) {
      if (this.fromDate.month === this.toDate.month) {
        let weekdays = 0;
        for (let i = this.fromDate.day; i <= this.toDate.day; i ++) {
          if (this.calendar.getWeekday(new NgbDate(this.fromDate.year, this.fromDate.month, i)) >= 6) {
            weekdays ++;
          }
        }
        const days = this.toDate.day - this.fromDate.day - weekdays + 1;

        return days;
      } else {

        let weekdays = 0;

        for (let i = this.fromDate.day; i <= daysInMonths[this.fromDate.month - 1]; i ++) {
          if (this.calendar.getWeekday(new NgbDate(this.fromDate.year, this.fromDate.month, i)) >= 6) {
            weekdays ++;
          }
        }

        for (let i = 1; i <= this.toDate.day; i ++) {
          if (this.calendar.getWeekday(new NgbDate(this.toDate.year, this.toDate.month, i)) >= 6) {
            weekdays ++;
          }

          const days = (daysInMonths[this.fromDate.month - 1] - this.fromDate.day) + this.toDate.day - weekdays;

          return days;
        }

      }
    } else {

      let weekdays = 0;

      for (let i = this.fromDate.day; i <= daysInMonths[11]; i ++) {
          if (this.calendar.getWeekday(new NgbDate(this.fromDate.year, this.fromDate.month, i)) >= 6) {
            weekdays ++;
          }
      }

      for (let i = 1; i <= this.toDate.day; i ++) {
          if (this.calendar.getWeekday(new NgbDate(this.toDate.year, this.toDate.month, i)) >= 6) {
            weekdays ++;
          }
      }

      const days = (daysInMonths[11] - this.fromDate.day) + this.toDate.day - weekdays + 1;

      return days;

    }

  }

  public getFromDate() {
    const viewData = this.fromDate.day + '/' + this.fromDate.month + '/' + this.fromDate.year;

    return viewData;
  }

  public getToDate() {
    let viewData = '';
    if (this.toDate) {
      viewData = this.toDate.day + '/' + this.toDate.month + '/' + this.toDate.year;

      return viewData;
    } else {
      return 'dd/mm/yyyy';
    }

  }

}
