import { Injectable, PipeTransform } from '@angular/core';
import { Sr } from './sr';
import { SortDirection } from '../directives/sortable.directive';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {DecimalPipe, getLocaleMonthNames} from '@angular/common';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
interface SearchResult {
  spors: Sr[];
  retainers: Sr[];
  totalSpors: number;
  totalRetainers: number;
}
interface State {
  pageSpor: number;
  pageRetainer: number;
  pageSizeSpors: number;
  pageSizeRetainers: number;
  searchTermSpors: string;
  searchTermRetainers: string;
  sortColumnSpors: string;
  sortDirectionSpors: SortDirection;
  sortColumnRetainers: string;
  sortDirectionRetainers: SortDirection;
}
function compare(v1, v2) {
  const v11 = Number.parseFloat(v1.toLowerCase());
  const v22 = Number.parseFloat(v2.toLowerCase());
  if (!(isNaN(v11) || isNaN(v22))) {
    return v11 < v22 ? -1 : v11 > v22 ? 1 : 0;
  }
  return v1.toLowerCase() < v2.toLowerCase() ? -1 : v1.toLowerCase() > v2.toLowerCase() ? 1 : 0;
}

function sort(sr: Sr[], column: string, direction: string): Sr[] {
  if (direction === '') {
    return sr;
  } else {
    return [...sr].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(sr: Sr, term: string, pipe: PipeTransform) {
  if (sr.name != null) {
  return sr.name.toLowerCase().includes(term.toLowerCase())
  || sr.description.toLowerCase().includes(term.toLowerCase())
  || sr.formula.toLowerCase().includes(term.toLowerCase());
  }
}


@Injectable({
  providedIn: 'root'
})
export class SrService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _spors$ = new BehaviorSubject<Sr[]>([]);
  private _retainers$ = new BehaviorSubject<Sr[]>([]);
  private _totalSpors$ = new BehaviorSubject<number>(0);
  private _totalRetainers$ = new BehaviorSubject<number>(0);

  private _state: State = {
    pageSpor: 1,
    pageRetainer: 1,
    pageSizeSpors: 10,
    pageSizeRetainers: 10,
    searchTermSpors: '',
    searchTermRetainers: '',
    sortColumnSpors: '',
    sortDirectionSpors: '',
    sortColumnRetainers: '',
    sortDirectionRetainers: ''
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
      this._spors$.next(result.spors);
      this._totalSpors$.next(result.totalSpors);
      this._retainers$.next(result.retainers);
      this._totalRetainers$.next(result.totalRetainers);
    });

    this._search$.next();
  }

  get spors$() { return this._spors$.asObservable(); }
  get totalSpors$() { return this._totalSpors$.asObservable(); }
  get retainers$() { return this._retainers$.asObservable(); }
  get totalRetainers$() { return this._totalRetainers$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get pageSpor() { return this._state.pageSpor; }
  set pageSpor(pageSpor: number) { this._set({pageSpor}); }
  get pageSizeRetainers() { return this._state.pageSizeRetainers; }
  set pageSizeRetainers(pageSizeRetainers: number) { this._set({pageSizeRetainers}); }
  get pageRetainer() { return this._state.pageRetainer; }
  set pageRetainer(pageRetainer: number) { this._set({pageRetainer}); }
  set pageSizeSpors(pageSizeSpors: number) { this._set({pageSizeSpors}); }
  get pageSizeSpors() { return this._state.pageSizeSpors; }
  get searchTermSpors() { return this._state.searchTermSpors; }
  set searchTermSpors(searchTermSpors: string) { this._set({searchTermSpors}); }
  set searchTermRetainers(searchTermRetainers: string) { this._set({searchTermRetainers}); }
  get searchTermRetainers() { return this._state.searchTermRetainers; }
  set sortColumnSpors(sortColumnSpors: string) { this._set({sortColumnSpors}); }
  set sortDirectionSpors(sortDirectionSpors: SortDirection) { this._set({sortDirectionSpors}); }
  set sortColumnRetainers(sortColumnRetainers: string) { this._set({sortColumnRetainers}); }
  set sortDirectionRetainers(sortDirectionRetainers: SortDirection) { this._set({sortDirectionRetainers}); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }
  public async getSpors(): Promise<Sr[]> {
    return await this.http.get<Sr[]>(environment.sporsApiUrl, {responseType: 'json'}).toPromise();
  }
  public async getRetainers(): Promise<Sr[]> {
    return await this.http.get<Sr[]>(environment.retainersApiUrl, {responseType: 'json'}).toPromise();
  }
  public async addSpor(body: Sr): Promise<Sr> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Sr>(environment.sporsApiUrl, body, {responseType: 'json', headers}).toPromise();
  }
  public async addRetainer(body: Sr): Promise<Sr> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Sr>(environment.retainersApiUrl, body, {responseType: 'json', headers}).toPromise();
  }
  public async changeSpor(body: Sr, id: number): Promise<Sr> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Sr>(environment.sporsApiUrl + '/' + id, body, {responseType: 'json', headers}).toPromise();
  }
  public async changeRetainer(body: Sr, id: number): Promise<Sr> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Sr>(environment.retainersApiUrl + '/' + id, body, {responseType: 'json', headers}).toPromise();
  }
  public async deleteSpor(spor: Sr): Promise<Sr> {

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete<Sr>(environment.sporsApiUrl + '/' + spor.srModelId, {responseType: 'json', headers}).toPromise();
  }
  public async deleteRetainer(retainer: Sr): Promise<Sr> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete<Sr>(environment.retainersApiUrl + '/' + retainer.srModelId, {responseType: 'json', headers}).toPromise();
  }
  private async _search(): Promise<SearchResult> {
    const {sortColumnSpors, sortDirectionSpors, sortColumnRetainers, sortDirectionRetainers
      , pageSizeSpors, pageSizeRetainers, pageSpor, pageRetainer, searchTermSpors, searchTermRetainers} = this._state;
    // 0. fetch clients
    const dbSpors = await this.getSpors();
    const dbRetainers = await this.getRetainers();
    // 1. sort
    let spors = sort(dbSpors, sortColumnSpors, sortDirectionSpors);
    let retainers = sort(dbRetainers, sortColumnRetainers, sortDirectionRetainers);
    // let legalDays = sort(LEGALDAYS, sortColumn, sortDirection);
    // 2. filter
    /*if (spors.length === 0) {
      LEGALDAYS.forEach(DAY => {
        this.addLegalDay(DAY);
      });
    }*/
    this.maxId = 1;
    spors.forEach(spor => {if (spor.srModelId > this.maxId) {
                                this.maxId = spor.srModelId;
    }
    });
    retainers.forEach(retainer => {if (retainer.srModelId > this.maxId) {
                                this.maxId = retainer.srModelId;
    }
    });
    this.maxId++;

    spors = spors.filter(spor => matches(spor, searchTermSpors, this.pipe));
    const totalSpors = spors.length;
    retainers = retainers.filter(retainer => matches(retainer, searchTermRetainers, this.pipe));
    const totalRetainers = retainers.length;

    // 3. paginate
    spors = spors.slice((pageSpor - 1) * pageSizeSpors, (pageSpor - 1) * pageSizeSpors + pageSizeSpors);
    retainers = retainers.slice((pageRetainer - 1) * pageSizeRetainers, (pageRetainer - 1) * pageSizeRetainers + pageSizeRetainers);
    return {spors, retainers, totalSpors, totalRetainers};
  }
}
