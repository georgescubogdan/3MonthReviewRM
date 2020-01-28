import { Injectable, PipeTransform } from '@angular/core';
import { SortDirection } from '../../directives/sortable.directive';
import { BehaviorSubject, Subject } from 'rxjs';
import { ClockingDate } from '../interfaces';
import { DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { tap, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { isNull } from 'util';


interface SearchResult {
  dates: ClockingDate[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
}
function compare(v1: string, v2: string) {
  const v11 = v1;
  const v22 = v2;
  if (!(isNull(v11) || isNull(v22))) {
    return v11 < v22 ? -1 : v11 > v22 ? 1 : 0;
  }

  return v1.toLowerCase() < v2.toLowerCase() ? -1 : v1.toLowerCase() > v2.toLowerCase() ? 1 : 0;
}


function sort(dates: ClockingDate[], column: string, direction: string): ClockingDate[] {

  if (direction === '') {
    return dates;
  } else {
    return [...dates].sort((a, b) => {
      const res = compare(a.user[column], b.user[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(date: ClockingDate, term: string, pipe: PipeTransform) {
  if (date.user.fullName != null ) {
    return date.user.fullName.toLowerCase().includes(term.toLowerCase());
  }
}
@Injectable({
  providedIn: 'root'
})
export class DatesService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _dates$ = new BehaviorSubject<ClockingDate[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private id: number;
  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };
  subscription: any;
  constructor(private pipe: DecimalPipe, private http: HttpClient) {

  }
  public maxId: number;
  public fetchData(year, month) {
    if (this.subscription != null) {
      this.subscription.unsubscribe();
    }
    this.subscription = this._search$.pipe(
      tap(() => this._loading$.next(true)),
      switchMap(() => this._search(year, month)),
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
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }
  set sortColumn(sortColumn: string) { this._set({sortColumn}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }
  public async getDates(year: number, month: number): Promise<ClockingDate[]> {
    return await this.http.get<ClockingDate[]>(
            environment.dateApiUrl  + '/' + 'GetFilteredDates' + '/' + year + '/' + month,
                {responseType: 'json'}).toPromise();
  }

  private async _search(year: number, month: number): Promise<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;

    const dbDates = await this.getDates(year, month);


    let dates = sort(dbDates, sortColumn, sortDirection);
    dates = dates.filter(date => matches(date, searchTerm, this.pipe));
    const total = dates.length;

    // 3. paginate
    dates = dates.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return {dates, total};

 }
}


