import { Injectable, PipeTransform } from '@angular/core';
import { LegalDay } from './legal-day';
import { SortDirection } from '../directives/sortable.directive';

import {BehaviorSubject, Subject} from 'rxjs';

import {DecimalPipe} from '@angular/common';
import {switchMap, tap} from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

interface SearchResult {
  legalDays: LegalDay[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
}
function compare(v1, v2) {
  const v11 = Number.parseFloat(v1);
  const v22 = Number.parseFloat(v2);
  if (!(isNaN(v11) || isNaN(v22))) {
    return v11 < v22 ? -1 : v11 > v22 ? 1 : 0;
  }
  return v1.toLowerCase() < v2.toLowerCase() ? -1 : v1.toLowerCase() > v2.toLowerCase() ? 1 : 0;
}

function sort(legalDays: LegalDay[], column: string, direction: string): LegalDay[] {
  if (direction === '') {
    return legalDays;
  } else {
    return [...legalDays].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(legalDay: LegalDay, term: string, pipe: PipeTransform) {
  if (legalDay.name != null) {
  return legalDay.name.toLowerCase().includes(term.toLowerCase())
     || (+legalDay.day === +term)
     || (+legalDay.month === +term);
  }
}


@Injectable({
  providedIn: 'root'
})
export class LegalDayService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _legalDays$ = new BehaviorSubject<LegalDay[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private pipe: DecimalPipe, private http: HttpClient) {
    this.fetchData();
  }
  public maxId: number;
  public fetchData() {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      switchMap(() => this._search()),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._legalDays$.next(result.legalDays);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  get legalDays$() { return this._legalDays$.asObservable(); }
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
  public async getLegalDays(): Promise<LegalDay[]> {
    return await this.http.get<LegalDay[]>(environment.legalDayApiUrl, {responseType: 'json'}).toPromise();
  }

  public async addLegalDay(body: LegalDay): Promise<LegalDay> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<LegalDay>(environment.legalDayApiUrl, body, {responseType: 'json', headers}).toPromise();
  }
  public async changeLegalDay(body: LegalDay, id: number): Promise<LegalDay> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<LegalDay>(environment.legalDayApiUrl + '/' + id, body, {responseType: 'json', headers}).toPromise();
  }
  public async deleteLegalDay(id: number): Promise<LegalDay> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete<LegalDay>(environment.legalDayApiUrl + '/' + id, {responseType: 'json', headers}).toPromise();
  }
  private async _search(): Promise<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;
    // 0. fetch clients
    const dbLegalDays = await this.getLegalDays();

    // 1. sort
    let legalDays = sort(dbLegalDays, sortColumn, sortDirection);
    // 2. filter
    this.maxId = 1;
    legalDays.forEach(day => {if (day.legalDayID > this.maxId) {
                                this.maxId = day.legalDayID;
    }
    });
    this.maxId++;
    legalDays = legalDays.filter(legalDay => matches(legalDay, searchTerm, this.pipe));
    const total = legalDays.length;

    // 3. paginate
    legalDays = legalDays.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return {legalDays, total};
  }
}
