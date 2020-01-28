import { Injectable, PipeTransform } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subject } from 'rxjs/internal/Subject';
import { User} from './interfaces';
import { DecimalPipe } from '@angular/common';
import { SortDirection } from '../directives/sortable.directive';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {switchMap, tap} from 'rxjs/operators';
import { environment } from 'src/environments/environment';


interface SearchResult {
  users: User[];
  total: number;
  years: number[];
}

@Injectable({
  providedIn: 'root'
})
export class ClockingService {
  public activeProfileID: number;
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _users$ = new BehaviorSubject<User[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private _years$ = new BehaviorSubject<number[]>([]);
  private _months$ = new BehaviorSubject<string[]>([]);
  private _searchMMonths$ = new Subject<void>();

  public maxId: number;

  constructor(private pipe: DecimalPipe, private http: HttpClient) {
    this.fetchData();
    this.activeProfileID = 0;
  }
  public fetchData() {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      switchMap(() => this._search()),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._users$.next(result.users);
      this._total$.next(result.total);
      this._years$.next(result.years);
    });

    this._search$.next();
  }

  get users$() { return this._users$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get years$() { return this._years$.asObservable(); }
  get months$() { return this._months$.asObservable(); }


  public async getUsers(): Promise<User[]> {
    return await this.http.get<User[]>(environment.userApiUrl, {responseType: 'json'}).toPromise();
  }

  public async getUserById(id: number): Promise<User> {
    return await this.http.get<User>(environment.userApiUrl, {responseType: 'json'}).toPromise();
  }
  public async getYears(): Promise<number[]> {
    return await this.http.get<number []>(environment.dateApiUrl + '/GetYears', {responseType: 'json'}).toPromise();
  }
  public async getMonths(year: number): Promise<number[]> {
    return await this.http.get<number[]>(environment.dateApiUrl + '/GetMonths/' + year , {responseType: 'json'}).toPromise();
  }
  public async getDays(year: number, month: number): Promise<number[]> {
    return await this.http.get<number []>(environment.dateApiUrl + '/GetDays/' + year + '/' + month, {responseType: 'json'}).toPromise();
  }

  private async _search(): Promise<SearchResult> {

    const dbUsers = await this.getUsers();
    /// clockings to profiles
    const years = await this.getYears();

    // 1. sort
    const users = dbUsers;
    // 2. filter
    const total = users.length;
    // 3. paginate
    return {users, total, years};
  }


}
