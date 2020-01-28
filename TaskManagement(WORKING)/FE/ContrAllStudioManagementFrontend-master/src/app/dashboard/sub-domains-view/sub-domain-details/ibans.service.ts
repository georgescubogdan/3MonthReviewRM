import { Injectable, PipeTransform } from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {DecimalPipe} from '@angular/common';
import { switchMap, tap} from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Iban } from '../iban';
import { SubDomainService } from '../sub-domain.service';
import { SortDirection } from '../../directives/sortable.directive';

interface SearchResult {
  ibans: Iban[];
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

function sort(ibans: Iban[], column: string, direction: string): Iban[] {
  if (direction === '') {
    return ibans;
  } else {
    return [...ibans].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(iban: Iban, term: string, pipe: PipeTransform) {
  if (iban.iban != null) {
  return iban.iban.toLowerCase().includes(term.toLowerCase()) ||
         iban.formula.toLowerCase().includes(term.toLowerCase()) ||
         iban.financeSource.toLocaleLowerCase().includes(term.toLowerCase());
  }
}


@Injectable({
  providedIn: 'root'
})
export class IbanService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _ibans$ = new BehaviorSubject<Iban[]>([]);
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
  constructor(private pipe: DecimalPipe, private http: HttpClient, private subDomainService: SubDomainService) {
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
      this._ibans$.next(result.ibans);
      this._total$.next(result.total);
    });
    this._search$.next();
  }

  get ibans$() { return this._ibans$.asObservable(); }
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
  public async getIbans(id: number): Promise<Iban[]> {
    return await this.http.get<Iban[]>(environment.ibanApiUrl  + '/profile=' + id, {responseType: 'json'}).toPromise();
  }

  public async changeIban(body: Iban, id: number): Promise<Iban> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Iban>(environment.ibanApiUrl + '/' + id, body, {responseType: 'json', headers}).toPromise();
  }
  public async addIban(body: Iban): Promise<Iban> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Iban>(environment.ibanApiUrl, body, {responseType: 'json', headers}).toPromise();
  }
  public async deleteIban(iban: Iban, id: number): Promise<Iban> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.delete<Iban>(environment.ibanApiUrl + '/' + iban.ibanModelId, {responseType: 'json', headers}).toPromise();
  }
  private async _search(id: number): Promise<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;
    // 0. fetch clients
    const dbIbans = await this.getIbans(id);
    // 1. sort
    let ibans = sort(dbIbans, sortColumn, sortDirection);
    // 2. filter
    this.maxId = 1;
    ibans.forEach(iban => {if (iban.ibanModelId > this.maxId) {
                                this.maxId = iban.ibanModelId;
    }
    });
    this.maxId++;
    ibans = ibans.filter(iban => matches(iban, searchTerm, this.pipe));
    const total = ibans.length;

    // 3. paginate
    ibans = ibans.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return {ibans, total};
  }
}
