import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskManagementService } from '../task-management.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {

  // taskName: string;
  // description: string;

  activeButton = true;
  addTaskForm: FormGroup;
  taskStateID: number;
  submitted = false;

  constructor(public activeModal: NgbActiveModal,
              public service: TaskManagementService,
              public toastrService: ToastrService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.activeButton = true;
    this.addTaskForm = this.formBuilder.group({
      taskName: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });
  }

  public onSubmitAddTask() {
    this.submitted = true;

    if (this.addTaskForm.valid) {
      const data = {
        taskName: this.addTaskForm.value.taskName,
        description: this.addTaskForm.value.description,
        taskStateID: this.taskStateID,
      };
      this.activeButton = false;
      this.service.addTask(data).then(
        c => {
          this.toastrService.success('', 'Task-ul a fost adaugata cu succes!!');
          // console.log('Success');
          this.activeButton = true;
          this.activeModal.close('Success');
        })
        .catch(fail => {
          // console.log('Failed ' + fail);
          this.toastrService.error('', 'Task-ul nu a putut fi adaugat!!');
        });
    } else {
      this.toastrService.error('', 'Datele nu sunt valide!!');
      this.addTaskForm.markAsTouched();
      this.addTaskForm.markAsDirty();
    }
  }

  get getAddTaskFormControls() { return this.addTaskForm.controls; }

}
