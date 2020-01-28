import { Injectable, PipeTransform } from '@angular/core';
import { SD } from './s-d';
import { SortDirection } from '../directives/sortable.directive';
import {BehaviorSubject, Subject} from 'rxjs';
import {DecimalPipe} from '@angular/common';
import {switchMap, tap} from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Profile } from './profile';

interface SearchResult {
  subDomains: SD[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  pageIbans: number;
  pageSizeIbans: number;
  searchTerm: string;
  searchTermIban: string;
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

function sort(subDomains: SD[], column: string, direction: string): SD[] {
  if (direction === '') {
    return subDomains;
  } else {
    return [...subDomains].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(subDomain: SD, term: string, pipe: PipeTransform) {
  if (subDomain.name != null) {
    return subDomain.name.toLowerCase().includes(term.toLowerCase());
  }
}


@Injectable({
  providedIn: 'root'
})
export class SubDomainService {
  public activeProfileID: number;
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _subDomains$ = new BehaviorSubject<SD[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private _state: State = {
    page: 1,
    pageSize: 10,
    pageIbans: 1,
    pageSizeIbans: 10,
    searchTerm: '',
    searchTermIban: '',
    sortColumn: '',
    sortDirection: ''
  };
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
      this._subDomains$.next(result.subDomains);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  get subDomains$() { return this._subDomains$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  set page(page: number) { this._set({page}); }
  get pageSize() { return this._state.pageSizeIbans; }
  set pageSize(pageSizeIbans: number) { this._set({pageSizeIbans}); }
  get pageIbans() { return this._state.page; }
  set pageIbans(pageIbans: number) { this._set({pageIbans}); }
  get pageSizeIbns() { return this._state.pageSizeIbans; }
  set pageSizeIbans(pageSizeIbans: number) { this._set({pageSizeIbans}); }
  get searchTerm() { return this._state.searchTerm; }
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }
  get searchTermIban() { return this._state.searchTermIban; }
  set searchTermIban(searchTermIban: string) { this._set({searchTermIban}); }
  set sortColumn(sortColumn: string) { this._set({sortColumn}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }
  public async getSubDomains(): Promise<SD[]> {
    return await this.http.get<SD[]>(environment.subDomainsApiUrl, {responseType: 'json'}).toPromise();
  }
  public async getSubDomainById(id: number): Promise<SD> {
    return await this.http.get<SD>(environment.subDomainsApiUrl + '/' + id, {responseType: 'json'}).toPromise();
  }
  public async getProfileById(id: number): Promise<Profile> {
    return await this.http.get<Profile>(environment.profilesApiUrl + '/' + id, {responseType: 'json'}).toPromise();
  }
  public async addSubDomain(body: SD): Promise<SD> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<SD>(environment.subDomainsApiUrl, body, {responseType: 'json', headers}).toPromise();
  }
  public async addProfile(body: Profile): Promise<Profile> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Profile>(environment.profilesApiUrl, body, {responseType: 'json', headers}).toPromise();
  }
  public async changeSubDomain(body: SD, id: number): Promise<SD> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<SD>(environment.subDomainsApiUrl + '/' + id, body, {responseType: 'json', headers}).toPromise();
  }
  public async changeProfile(body: Profile, id: number): Promise<Profile> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Profile>(environment.profilesApiUrl + '/' + id, body, {responseType: 'json', headers}).toPromise();
  }
  public async deleteSubDomain(id: number): Promise<SD> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete<SD>(environment.subDomainsApiUrl + '/' + id, {responseType: 'json', headers}).toPromise();
  }
  public async deleteProfile(id: number): Promise<Profile> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete<Profile>(environment.profilesApiUrl + '/' + id, {responseType: 'json', headers}).toPromise();
  }
  private async _search(): Promise<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;
    // 0. fetch clients
    const dbSubDomains = await this.getSubDomains();

    // 1. sort
    const subDomains = dbSubDomains;
    // 2. filter
    const total = subDomains.length;

    // 3. paginate
    return {subDomains, total};
  }
}
