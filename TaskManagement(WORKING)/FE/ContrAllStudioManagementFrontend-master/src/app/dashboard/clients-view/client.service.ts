import {Injectable, PipeTransform} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import { environment } from 'src/environments/environment';
import {Client} from './client';
import {DecimalPipe} from '@angular/common';
import { switchMap, tap} from 'rxjs/operators';
import {SortDirection} from '../directives/sortable.directive';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface SearchResult {
  clients: Client[];
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

function sort(clients: Client[], column: string, direction: string): Client[] {
  if (direction === '') {
    return clients;
  } else {
    return [...clients].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(client: Client, term: string, pipe: PipeTransform) {
  return (client.name && client.name.toLowerCase().includes(term.toLowerCase()))
      || (client.clientId && client.clientId.toLowerCase().includes(term.toLowerCase()))
      || (client.county && client.county.toLowerCase().includes(term.toLowerCase()))
      || (client.city && client.city.toLowerCase().includes(term.toLowerCase()));
}

@Injectable({providedIn: 'root'})
export class ClientService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  public _clients$ = new BehaviorSubject<Client[]>([]);
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

  public fetchData() {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      switchMap(() => this._search()),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._clients$.next(result.clients);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  get clients$() { return this._clients$.asObservable(); }
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

  private async getClients(): Promise<Client[]> {
    return await this.http.get<Client[]>(environment.clientApiUrl, {responseType: 'json'}).toPromise();
  }
  public async editClient(body: Client): Promise<Client> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Client>(environment.clientApiUrl + '/' + body.clientId, body, {responseType: 'json', headers}).toPromise();
  }
  public async blockClient(body: Client): Promise<Client> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    body.sal = false ;
    body.reg = false ;
    body.vmg = false ;
    body.ail = false ;
    body.asf = false ;
    body.imp = false ;
    body.con = false ;
    return this.http.put<Client>(environment.clientApiUrl + '/' + body.clientId, body, {responseType: 'json', headers}).toPromise();
  }
  public async addClient(body: any): Promise<Client> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Client>(environment.clientApiUrl, body, {responseType: 'json', headers}).toPromise();
  }
  public async delete(id: string): Promise<Client> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete<Client>(environment.clientApiUrl + '/' + id, {responseType: 'json', headers}).toPromise();
  }

  private async _search(): Promise<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;
    const clientsDb = await this.getClients();
    let clients = sort(clientsDb, sortColumn, sortDirection);
    clients = clients.filter(client => matches(client, searchTerm, this.pipe));
    const total = clients.length;
    clients = clients.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return {clients, total};
  }
}
