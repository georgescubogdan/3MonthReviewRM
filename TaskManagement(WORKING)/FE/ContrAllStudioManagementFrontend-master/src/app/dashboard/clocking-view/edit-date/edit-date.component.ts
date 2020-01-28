import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { UsersService } from '../users-details/users.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateTimestampService } from '../../services/update-timestamp.service';
import { ClockingDate } from '../interfaces';

@Component({
  selector: 'app-edit-date',
  templateUrl: './edit-date.component.html',
  styleUrls: ['./edit-date.component.css'],
  providers: [DecimalPipe, UsersService],
})
export class EditDateComponent implements OnInit {
  userId: number;
  date: ClockingDate;
  addDateForm = new FormGroup({
    hours: new FormControl('', Validators.required),
    minutes: new FormControl('', Validators.required),
    seconds: new FormControl('', Validators.required),

  });
  public onSubmitDate() {
    this.addDateForm.markAsDirty();
    if (this.addDateForm.valid) {
      const date = {
        dateId: this.date.dateId,
        currentDate: this.date.currentDate,
        hours: this.addDateForm.value.hours,
        minutes: this.addDateForm.value.minutes,
        seconds: this.addDateForm.value.seconds,
        userId: this.userId,
        user: null,
        clockings: null,
        totalTime: null,
      };
      this.service.changeDate(date, this.date.dateId).then(
        c => {
          this.activeModal.close('Success');
          this.updateTimestampService.updateTimestampSubDomains();
          this.toastrService.success('', 'Data a fost schimbata cu succes!');

        })
        .catch(fail => {
          this.toastrService.error('', 'Data nu a putut fi schimbata!');
        });
    } else {
      const date = {
        dateId: 0,
        currentDate: this.addDateForm.value.date,
        hours: this.addDateForm.value.hours,
        minutes: this.addDateForm.value.minutes,
        seconds: this.addDateForm.value.seconds,
        userId: this.userId,
        user: null,
        clockings: null,
        totalTime: null,
      };
      this.toastrService.error('', 'Datele nu sunt valide!!');
      this.addDateForm.markAsTouched();
      this.addDateForm.markAsDirty();
    }
  }
  constructor(public activeModal: NgbActiveModal
    ,         public toastrService: ToastrService
    ,         public updateTimestampService: UpdateTimestampService
    ,         public service: UsersService) {
}

  ngOnInit() {
    const value = {
      hours: this.date.hours,
      minutes: this.date.minutes,
      seconds: this.date.seconds,
    };
    this.addDateForm.setValue(value);
  }
  }


