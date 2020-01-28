import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskManagementService } from '../task-management.service';

@Component({
  selector: 'app-edit-task-state',
  templateUrl: './edit-task-state.component.html',
  styleUrls: ['./edit-task-state.component.css']
})
export class EditTaskStateComponent implements OnInit {

  editTaskStateForm: FormGroup;
  taskState: any;
  submitted = false;

  public onSubmitEditTaskDate() {
    this.submitted = true;

    this.editTaskStateForm.markAsDirty();
    if (this.editTaskStateForm.valid) {
      const data = {
        name: this.editTaskStateForm.value.name,
        orderNr: this.editTaskStateForm.value.orderNr,
        taskStateID: this.taskState.taskStateID,
      };
      console.log(data);

      this.service.updateTaskState(data).then(
        c => {
          this.toastrService.success('', 'Starea a fost editata cu succes!!');
          this.activeModal.close('Success');
        })
        .catch(fail => {
          this.toastrService.error('', 'Starea nu a putut fi editata!!');

        });
      } else {
        this.toastrService.error('', 'Datele nu sunt valide!!');
        this.editTaskStateForm.markAsTouched();
        this.editTaskStateForm.markAsDirty();
      }
    }

    constructor(public activeModal: NgbActiveModal,
                public toastrService: ToastrService,
                public service: TaskManagementService,
                private formBuilder: FormBuilder) { }

    ngOnInit() {
      this.editTaskStateForm = this.formBuilder.group({
        name: new FormControl('', [Validators.required]),
        orderNr: new FormControl('', Validators.required),
      });

      const value = {
        name: this.taskState.name,
        orderNr: this.taskState.orderNr,
      };
      this.editTaskStateForm.setValue(value);
    }

    get getEditTaskStateFormControls() { return this.editTaskStateForm.controls; }

}
