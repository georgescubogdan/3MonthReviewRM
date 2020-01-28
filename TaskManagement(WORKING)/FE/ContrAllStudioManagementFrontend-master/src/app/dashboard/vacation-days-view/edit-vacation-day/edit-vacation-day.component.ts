import { Component, OnInit } from '@angular/core';
import { NgbDate, NgbActiveModal, NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { VacationDaysViewService } from '../vacation-days.service';
import { AuthService } from 'src/app/auth.service';
import { ToastrService } from 'ngx-toastr';
import { VacationDay } from '../vacation-days';

@Component({
  selector: 'app-edit-vacation-day',
  templateUrl: './edit-vacation-day.component.html',
  styleUrls: ['./edit-vacation-day.component.css']
})
export class EditVacationDayComponent implements OnInit {

  vacationDay: VacationDay;
  activeButton = true;
  hoveredDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;
  userId: number;

  fromTest: NgbDate;
  toTest: NgbDate;

  addVacationDayForm = new FormGroup({
    state:  new FormControl(''),
    reason: new FormControl('', Validators.required),
  });
  roles: string[];

  constructor(public service: VacationDaysViewService,
              public activeModal: NgbActiveModal,
              private calendar: NgbCalendar,
              private serviceAuth: AuthService,
              public toastrService: ToastrService,
    ) {
    //   this.fromDate = calendar.getToday();
    //   this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
    }

  isWeekend = (date: NgbDate, current: {month: number}) =>  this.calendar.getWeekday(date) >= 6;
  isDisabled(date: NgbDateStruct) {
    const d = new Date(date.year, date.month - 1, date.day);
    return  d.getDay() === 0 || d.getDay() === 6;
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

    async ngOnInit() {
      this.roles = await this.serviceAuth.getCurrentUserRoles();
      const value = {
        reason: this.vacationDay.reason,
        state: this.vacationDay.state
      };
      this.addVacationDayForm.setValue(value);
      const from = new Date(this.vacationDay.from);
      const to = new Date(this.vacationDay.to);
      this.fromDate = new NgbDate(from.getFullYear(), from.getMonth() + 1, from.getDate());
      this.toDate =  new NgbDate(to.getFullYear(), to.getMonth() + 1, to.getDate());

      this.fromTest = this.fromDate;
    }

    public async onSubmitVacation() {
      if (this.toDate) {
        const vacationToAdd = {
          vacationDayID: this.vacationDay.vacationDayID,
          userId: this.vacationDay.userId,
          from: new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day + 1),
          to: new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day + 1),
          reason: this.addVacationDayForm.value.reason,
          state: this.addVacationDayForm.value.state,
          user: null,
        };

        this.service.updateVacationDay(vacationToAdd, vacationToAdd.vacationDayID).then(
          c => {
            this.activeModal.close('Success');
            this.toastrService.success('', 'Cererea de concediu a fost editată cu succes!');
            this.activeButton = true;
          })
          .catch(fail => {
            this.toastrService.error('', 'Cererea de concediu nu a putut fi editată!');
          });
        }

      }
}
