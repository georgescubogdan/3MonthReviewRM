import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TaskState } from './taskState';
import { Task } from './task';

@Injectable({
  providedIn: 'root'
})
export class TaskManagementService {

  constructor(private http: HttpClient) {   }

  public async getTaskStates(): Promise<TaskState[]> {
    return await this.http.get<TaskState[]>(environment.TaskStatesApiUrl, {responseType: 'json'}).toPromise();
  }

  public async addTaskStates(body: any): Promise<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return await this.http.post<any>(environment.TaskStatesApiUrl, body, {responseType: 'json', headers}).toPromise();
  }

  public async updateTaskState(body: any): Promise<TaskState> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return await this.http.put<TaskState>(environment.TaskStatesApiUrl + '/' + body.taskStateID,
                                          body, {responseType: 'json', headers}).toPromise();
  }

  public async deleteTaskState(id: number): Promise<TaskState> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return await this.http.delete<TaskState>(environment.TaskStatesApiUrl + '/' + id, {responseType: 'json', headers}).toPromise();
  }

  public async addTask(body: any): Promise<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return await this.http.post<any>(environment.TasksApiUrl, body, {responseType: 'json', headers}).toPromise();
  }

  public async updateTask(body: Task): Promise<Task> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return await this.http.put<Task>(environment.TasksApiUrl + '/' + body.taskID, body, {responseType: 'json', headers}).toPromise();
  }

  public async deleteTask(id: number): Promise<Task> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return await this.http.delete<Task>(environment.TasksApiUrl + '/' + id, {responseType: 'json', headers}).toPromise();
  }


}
