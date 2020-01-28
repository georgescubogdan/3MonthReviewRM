import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UpdateTimestampService } from '../../services/update-timestamp.service';
import { UsersService } from '../users-details/users.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-date',
  templateUrl: './add-date.component.html',
  styleUrls: ['./add-date.component.css']
})
export class AddDateComponent implements OnInit {
  activeButton = true;
  userId: number;
  addDateForm = new FormGroup({

    date: new FormControl('', Validators.required),
    hours: new FormControl('', Validators.required),
    minutes: new FormControl('', Validators.required),
    seconds: new FormControl('', Validators.required),


  });
  public onSubmitDateFirma() {
    this.addDateForm.markAsDirty();
    if (this.addDateForm.valid) {
      const data = {
        dateId: 0,
        currentDate: new Date(this.addDateForm.value.date.year, this.addDateForm.value.date.month - 1, this.addDateForm.value.date.day + 1),
        hours: this.addDateForm.value.hours,
        minutes: this.addDateForm.value.minutes,
        seconds: this.addDateForm.value.seconds,
        userId: this.userId,
        user: null,
        clockings: null,
        totalTime: null,
      };
      this.activeButton = false;
      console.log(data);
      this.service.addDate(data).then(
        c => {
          this.activeModal.close('Success');
          this.updateTimestampService.updateTimestampDates();
          this.toastrService.success('', 'Data a fost adaugata cu succes!');
          this.activeButton = true;

        })
        .catch(fail => {
          this.toastrService.error('', 'Data nu a putut fi adaugata!');
        });
    } else {
      const data = {
       // creeaza data
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
    this.activeButton = true;
  }

}
