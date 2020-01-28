import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TaskManagementService } from '../task-management.service';
import { Task } from '../task';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {

  // activeButton = true;
  // addTaskForm = new FormGroup({
  //   taskName: new FormControl('', [Validators.required]),
  //   description: new FormControl('', Validators.required),
  // });
  // taskStateID: number;

  editTaskForm: FormGroup;
  task: Task;
  submitted = false;

  public onSubmitEditTask() {
    this.submitted = true;

    this.editTaskForm.markAsDirty();
    if (this.editTaskForm.valid) {
      const data = {
        taskID: this.task.taskID,
        taskName: this.editTaskForm.value.taskName,
        description: this.editTaskForm.value.description,
        taskStateID: this.task.taskStateID,
      };
      this.service.updateTask(data).then(
        c => {
          this.toastrService.success('', 'Task-ul a fost editat cu succes!!');
          this.activeModal.close('Success');
        })
        .catch(fail => {
          this.toastrService.error('', 'Task-ul nu a putut fi editat!!');

        });
      } else {
        this.toastrService.error('', 'Datele nu sunt valide!!');
        this.editTaskForm.markAsTouched();
        this.editTaskForm.markAsDirty();
      }
    }

  constructor(public activeModal: NgbActiveModal,
              public toastrService: ToastrService,
              public service: TaskManagementService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.editTaskForm = this.formBuilder.group({
      taskName: new FormControl('', [Validators.required]),
      description: new FormControl('', Validators.required),
    });
    const value = {
      taskName: this.task.taskName,
      description: this.task.description,
    };
    this.editTaskForm.setValue(value);
    console.log(this.task);

  }

  get getEditTaskFormControls() { return this.editTaskForm.controls; }

}
