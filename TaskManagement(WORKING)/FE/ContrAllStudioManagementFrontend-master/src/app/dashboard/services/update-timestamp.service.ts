import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UpdateMember } from './update-member';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UpdateTimestampService {
  timeResult: UpdateMember;
  now: string;
  private datePipe = new DatePipe('en-US');

  constructor(private http: HttpClient) {
    this.fetchData();
  }
  public async get(): Promise<UpdateMember> {
    return await this.http.get<UpdateMember>(environment.updateTimestampApiUrl + '/1', {responseType: 'json'}).toPromise();
  }

  public async updateTimestampLegalDays(): Promise<UpdateMember> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.timeResult = await this.get();
    return this.http.put<UpdateMember>
      (environment.updateTimestampApiUrl + '/0', this.timeResult, {responseType: 'json', headers}).toPromise();
  }
  public async updateTimestampClockingView(): Promise<UpdateMember> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.timeResult = await this.get();
    return this.http.put<UpdateMember>
      (environment.updateTimestampApiUrl + '/0', this.timeResult, {responseType: 'json', headers}).toPromise();
  }
  public async updateTimestampFormulas(): Promise<UpdateMember> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.timeResult = await this.get();
    return this.http.put<UpdateMember>
      (environment.updateTimestampApiUrl + '/1', this.timeResult, {responseType: 'json', headers}).toPromise();
  }

  public async updateTimestampSporsAndRetainers(): Promise<UpdateMember> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.timeResult = await this.get();
    return this.http.put<UpdateMember>
      (environment.updateTimestampApiUrl + '/2', this.timeResult, {responseType: 'json', headers}).toPromise();
  }
  public async updateTimestampSubDomains(): Promise<UpdateMember> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.timeResult = await this.get();
    return this.http.put<UpdateMember>
      (environment.updateTimestampApiUrl + '/3', this.timeResult, {responseType: 'json', headers}).toPromise();
  }
  public async updateTimestampDates(): Promise<UpdateMember> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.timeResult = await this.get();
    return this.http.put<UpdateMember>
      (environment.updateTimestampApiUrl + '/3', this.timeResult, {responseType: 'json', headers}).toPromise();
  }
  public fetchData() {
  }
  }
