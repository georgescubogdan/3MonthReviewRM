import {Injectable, PipeTransform} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import { environment } from 'src/environments/environment';
import {User} from './user';
import {DecimalPipe} from '@angular/common';
import { switchMap, tap} from 'rxjs/operators';
import {SortDirection} from '../directives/sortable.directive';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserRole } from './userRoles';

interface SearchResult {
  users: User [];
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

function sort(users: User[], column: string, direction: string): User[] {
  if (direction === '') {
    return users;
  } else {
    return [...users].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(user: User, term: string) {
  return (user.lastName && user.lastName.toLowerCase().includes(term.toLowerCase()))
      || (user.firstName && user.firstName.toLowerCase().includes(term.toLowerCase()));
}

@Injectable({providedIn: 'root'})
export class UserService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  public _users$ = new BehaviorSubject<User[]>([]);
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
      this._users$.next(result.users);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  get users$() { return this._users$.asObservable(); }
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

  private async getUsers(): Promise<User[]> {
    return await this.http.get<User[]>(environment.userApiUrl, {responseType: 'json'}).toPromise();
  }


  public async getUserRole(id: number): Promise<UserRole[]> {
    return await this.http.get<UserRole[]>(environment.roleModelsApiUrl + '/UserRoleModels/' + id, {responseType: 'json'}).toPromise();
  }

  public async getRoles(): Promise<UserRole[]> {
    return await this.http.get<UserRole[]>(environment.roleModelsApiUrl, {responseType: 'json'}).toPromise();
  }

  public async editUser(body: User): Promise<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // console.log(environment.userApiUrl + '/' + body.id, body, {responseType: 'json', headers});
    return this.http.put<User>(environment.userApiUrl + '/' + body.id, body, {responseType: 'json', headers}).toPromise();
  }

  public async editRoles(id: number, roleIds: number[]): Promise<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = roleIds;
    return this.http.put<User>(environment.userApiUrl + '/editRoles/' + id, body, {responseType: 'json', headers}).toPromise();
  }

  public async addUser(body: any): Promise<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(environment.identityApiUrl + '/Register', body, { headers , responseType: 'text' }).toPromise();
  }
  public async deleteUser(id: string): Promise<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // console.log(id);
    return this.http.delete<User>(environment.userApiUrl + '/' + id, {responseType: 'json', headers}).toPromise();
  }

  private async _search(): Promise<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;
    const usersDb = await this.getUsers();
    let users = sort(usersDb, sortColumn, sortDirection);
    // const usersMock = USERS;
    // let users = sort(usersMock, sortColumn, sortDirection);
    users = users.filter(user => matches(user, searchTerm));
    const total = users.length;
    users = users.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return {users, total};
  }
}
