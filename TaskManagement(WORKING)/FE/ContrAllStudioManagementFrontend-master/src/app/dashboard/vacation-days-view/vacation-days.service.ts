import { Injectable, PipeTransform, ViewChildren, QueryList } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { VacationDay } from './vacation-days';
import { environment } from 'src/environments/environment';
import { SortDirection, SortEvent, SortableDirective } from '../directives/sortable.directive';
import { isNull } from 'util';
import { BehaviorSubject, Subject } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { VACATIONDAYS } from './vacationDays';
import { AuthService } from 'src/app/auth.service';

interface SearchResult {
  vacationDays: VacationDay[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  fromDate: Date;
  toDate: Date;
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

function sort(vacationDays: VacationDay[], column: string, direction: string): VacationDay[] {
  if (direction === '') {
    return vacationDays;
  } else {
    return [...vacationDays].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(vacationDay: VacationDay, term: string, fromDate: Date, toDate: Date) {

  let valid = true;
  if ('' !== term) {
    valid = valid && (vacationDay.user.firstName.toLowerCase().includes(term.toLowerCase()) ||
                      vacationDay.user.lastName.toLowerCase().includes(term.toLowerCase()));
  }

  if (fromDate !== null) {
    valid = valid && (Date.parse(vacationDay.from.toString()) >= Date.parse(fromDate.toString()));
  }

  if (toDate !== null) {
    valid = valid && (Date.parse(vacationDay.to.toString()) <= Date.parse(toDate.toString()));
  }

  return valid;

}

@Injectable({
  providedIn: 'root'
})

export class VacationDaysViewService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _vacationDays$ = new BehaviorSubject<VacationDay[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;

  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    fromDate: null,
    toDate: null,
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private http: HttpClient, private serviceAuth: AuthService) {
    this.fetchData();
  }

  public async fetchData() {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      switchMap(() => this._search()),
      tap(() => this._loading$.next(false))
      ).subscribe(result => {
        this._vacationDays$.next(result.vacationDays);
        this._total$.next(result.total);
      });

    this._search$.next();
    }

    get vacationDays$() { return this._vacationDays$.asObservable(); }
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
    get fromDate() { return this._state.fromDate; }
    set fromDate(fromDate: Date) { this._set({fromDate}); }
    get toDate() { return this._state.toDate; }
    set toDate(toDate: Date) { this._set({toDate}); }

    private _set(patch: Partial<State>) {
      Object.assign(this._state, patch);
      this._search$.next();
    }

    onSort({column, direction}: SortEvent) {
      this.headers.forEach(header => {
        if (header.sortable !== column) {
          header.direction = '';
        }
      });
    }

    public async getVacationDaysByUser(): Promise<VacationDay[]> {
      return await this.http.get<VacationDay[]>(
        environment.vacationDaysApiUrl + '/User', {responseType: 'json'}).toPromise();
    }

    public async getVacationDays(): Promise<VacationDay[]> {
      return await this.http.get<VacationDay[]>(
        environment.vacationDaysApiUrl, {responseType: 'json'}).toPromise();
    }

    public async updateVacationDay(body: VacationDay, id: number): Promise<VacationDay> {
      const headers = new HttpHeaders({'Content-Type': 'application/json'});
      return await this.http.put<VacationDay>(environment.vacationDaysApiUrl + '/' + id,
      body, {responseType: 'json', headers}).toPromise();
    }

    public async deleteVacationDay(id: number): Promise<VacationDay> {
      const headers = new HttpHeaders({'Content-Type': 'application/json'});
      return await this.http.delete<VacationDay>(environment.vacationDaysApiUrl + '/' + id,
      {responseType: 'json', headers}).toPromise();
    }

    public async addVacationDay(body: VacationDay): Promise<VacationDay> {
      const headers = new HttpHeaders({'Content-Type': 'application/json'});
      return await this.http.post<VacationDay>(environment.vacationDaysApiUrl,
        body, {responseType: 'json', headers}).toPromise();
      }

    private async _search(): Promise<SearchResult> {

      const {sortColumn, sortDirection, pageSize, page, searchTerm, fromDate, toDate} = this._state;
      const roles = await this.serviceAuth.getCurrentUserRoles();
      let dbVacationDays = [];

      if (roles.indexOf('admin') !== -1) {
        dbVacationDays = await this.getVacationDays();
      } else {
        dbVacationDays = await this.getVacationDaysByUser();
      }

      let vacationDays = sort(dbVacationDays, sortColumn, sortDirection);
      vacationDays = vacationDays.filter(vacationDay => matches(vacationDay, searchTerm, fromDate, toDate));
      const total = vacationDays.length;
      vacationDays = vacationDays.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

      return {vacationDays, total};
    }

}
