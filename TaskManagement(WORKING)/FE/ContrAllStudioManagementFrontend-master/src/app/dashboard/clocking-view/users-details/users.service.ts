import { Injectable, PipeTransform } from '@angular/core';
import { ClockingDate } from '../interfaces';
import { SortDirection } from '../../directives/sortable.directive';
import { BehaviorSubject, Subject } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { SubDomainService } from '../../sub-domains-view/sub-domain.service';
import { tap, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConditionalExpr } from '@angular/compiler';
import { isNull } from 'util';


interface SearchResult {
  dates: ClockingDate[];
  total: number;
}
interface State {
  page: number;
  pageSize: number;
  searchTerm: Date;
  sortColumn: string;
  sortDirection: SortDirection;
}
function compare(v1: Date, v2: Date) {
  const v11 = v1.valueOf();
  const v22 = v2.valueOf();
  if (!(isNull(v11) || isNull(v22))) {
    return v11 < v22 ? -1 : v11 > v22 ? 1 : 0;
  }
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
}

function sort(dates: ClockingDate[], column: string, direction: string): ClockingDate[] {

  if (direction === '') {
    return dates;
  } else {
    return [...dates].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(date: ClockingDate, term: Date, pipe: PipeTransform) {
  if (date.currentDate != null) {
  return date.currentDate === term;

  }
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _dates$ = new BehaviorSubject<ClockingDate[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private id: number;
  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: new Date('1968-11-16T00:00:000'),
    sortColumn: '',
    sortDirection: ''
  };
  subscription: any;
  constructor(private pipe: DecimalPipe, private http: HttpClient) {
    this.fetchData(0);
  }
  public maxId: number;

  public fetchData(id: number) {
    if (this.subscription != null) {
      this.subscription.unsubscribe();
    }
    this.subscription = this._search$.pipe(
      tap(() => this._loading$.next(true)),
      switchMap(() => this._search(id)),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._dates$.next(result.dates);
      this._total$.next(result.total);
    });
    this._search$.next();
  }

  get dates$() { return this._dates$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  set page(page: number) { this._set({page}); }
  get pageSize() { return this._state.pageSize; }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  get searchTerm() { return this._state.searchTerm; }
  set searchTerm(searchTerm: Date) { this._set({searchTerm}); }
  set sortColumn(sortColumn: string) { this._set({sortColumn}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }
  public async getDatesByUser(id: number): Promise<ClockingDate[]> {
    return await this.http.get<ClockingDate[]>(
            environment.dateApiUrl  + '/' + 'GetDatesByUser' + '/' + id,
                {responseType: 'json'}).toPromise();
  }
  public async addDate(body: ClockingDate): Promise<ClockingDate> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<ClockingDate>(environment.dateApiUrl, body, {responseType: 'json', headers}).toPromise();
  }
  public async changeDate(body: ClockingDate, id: number): Promise<ClockingDate> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<ClockingDate>(environment.dateApiUrl + '/' + id, body, {responseType: 'json', headers}).toPromise();
  }
  public async deleteDate(id: number): Promise<ClockingDate> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.delete<ClockingDate>(environment.dateApiUrl + '/' + id, {responseType: 'json', headers}).toPromise();
  }
  private async _search(id: number): Promise<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;
    // 0. fetch clients
    const dbDates = await this.getDatesByUser(id);
    // 1. sort
    let dates = sort(dbDates, sortColumn, sortDirection);
    // // 2. filter
    // this.maxId = 1;
    // dates.forEach(date => {if (date.dateId > this.maxId) {
    //                             this.maxId = date.dateId;
    // }    });
    // this.maxId++;
    // dates = dates.filter(date => matches(date, searchTerm, this.pipe));
    const total = dates.length;

    // 3. paginate
    dates = dates.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return {dates, total};

 }
}
