import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { TaskManagementService } from './task-management.service';
import { TaskState } from './taskState';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddTaskStateComponent } from './add-task-state/add-task-state.component';
import { EditTaskStateComponent } from './edit-task-state/edit-task-state.component';
import { ToastrService } from 'ngx-toastr';
import { AddTaskComponent } from './add-task/add-task.component';
import { EditTaskComponent } from './edit-task/edit-task.component';

@Component({
  selector: 'app-task-management',
  templateUrl: './task-management.component.html',
  styleUrls: ['./task-management.component.css']
})
export class TaskManagementComponent implements OnInit {

  taskStates: TaskState[];

  drop(event: CdkDragDrop<TaskState[]>, taskStateID: number) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
      }
    }

    public async fetchData() {
      this.taskStates = await this.service.getTaskStates();
    }

    dragEnd(event: any, taskId: number, stateId: number, taskStateID: number) {
      // console.log(event);
      // console.log(taskId, 'taskId');
      // console.log(stateId, 'stateID');
    }

    addTaskState() {
      const modalRef = this.modalService.open(AddTaskStateComponent, {centered: true, windowClass: 'my-modal'});
      modalRef.componentInstance.name = 'Adaugare stare';
      modalRef.result.then(
        async () => {
          this.fetchData(); },
          () => {});
    }

    editTaskState(taskState: any) {
      const modalRef = this.modalService.open(EditTaskStateComponent, {centered: true, windowClass: 'my-modal'});
      modalRef.componentInstance.name = 'taskState';
      modalRef.componentInstance.taskState = taskState;
      modalRef.result.then(
        async () => {
                      this.fetchData(); },
              () => {  });
    }

    deleteTaskState(id: number) {
      if (confirm('Esti sigur ca vrei sa stergi aceasta stare?')) {
        this.service.deleteTaskState(id)
          .then(
            res => {
              this.toastrService.success('', 'Starea a fost stearsa!!');
              this.fetchData();
          })
          .catch(
            fail => {
              this.toastrService.error('', 'Starea nu a putut fi stearsa!');
          });
       }
    }

    addTask(taskStateID: number) {
      const modalRef = this.modalService.open(AddTaskComponent, {centered: true, windowClass: 'my-modal'});
      modalRef.componentInstance.name = 'Adaugare task';
      modalRef.componentInstance.taskStateID = taskStateID;
      modalRef.result.then(
        async () => {
          this.fetchData(); },
          () => {});
    }

    editTask(task: any) {
      const modalRef = this.modalService.open(EditTaskComponent, {centered: true, windowClass: 'my-modal'});
      modalRef.componentInstance.name = 'task';
      modalRef.componentInstance.task = task;
      modalRef.result.then(
        async () => {
                      this.fetchData(); },
              () => {  });
    }

    deleteTask(id: number) {
      if (confirm('Esti sigur ca vrei sa stergi acest task?')) {
        this.service.deleteTask(id)
          .then(
            res => {
              this.toastrService.success('', 'Task-ul a fost sters!!');
              this.fetchData();
          })
          .catch(
            fail => {
              this.toastrService.error('', 'Task-ul nu a putut fi sters!');
          });
       }
    }

    constructor(public service: TaskManagementService,
                private modalService: NgbModal,
                public toastrService: ToastrService, ) {
      this.fetchData();
    }

    ngOnInit() {
    }
  }
