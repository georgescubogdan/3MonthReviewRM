import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from '../../clients-view/client.service';
import { ToastrService } from 'ngx-toastr';
import { TaskManagementService } from '../task-management.service';

@Component({
  selector: 'app-add-task-state',
  templateUrl: './add-task-state.component.html',
  styleUrls: ['./add-task-state.component.css']
})
export class AddTaskStateComponent implements OnInit {

  // taskStateID: number;
  //   name: string;
  //   orderNr: number;
  //   tasks: Task[];

  submitted = false;
  activeButton = true;
  addTaskStateForm: FormGroup;

  constructor(public activeModal: NgbActiveModal,
              public service: TaskManagementService,
              public toastrService: ToastrService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.activeButton = true;
    this.addTaskStateForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      orderNr: new FormControl('', [Validators.required]),
    });
  }

  public onSubmitAddTaskState() {
    this.submitted = true;

    if (this.addTaskStateForm.valid) {
      const data = {
        name: this.addTaskStateForm.value.name,
        orderNr: this.addTaskStateForm.value.orderNr,
      };
      this.activeButton = false;
      this.service.addTaskStates(data).then(
        c => {
          this.toastrService.success('', 'Starea a fost adaugata cu succes!!');
          // console.log('Success');
          this.activeButton = true;
          this.activeModal.close('Success');
        })
        .catch(fail => {
          // console.log('Failed ' + fail);
          this.toastrService.error('', 'Starea nu a putut fi adaugata!!');
        });
    } else {
      this.toastrService.error('', 'Datele nu sunt valide!!');
      this.addTaskStateForm.markAsTouched();
      this.addTaskStateForm.markAsDirty();
    }
  }

  get getAddTaskStateFormControls() { return this.addTaskStateForm.controls; }

}
