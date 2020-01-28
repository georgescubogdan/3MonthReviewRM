import { Injectable, PipeTransform } from '@angular/core';
import { Formula } from './formula';
import { FORMULAS } from './formulas';
import { SortDirection } from '../directives/sortable.directive';
import { BehaviorSubject, Subject } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

interface SearchResult {
  formulas: Formula[];
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
  const v11 = Number.parseFloat(v1.toLowerCase());
  const v22 = Number.parseFloat(v2.toLowerCase());
  if (!(isNaN(v11) || isNaN(v22))) {
    return v11 < v22 ? -1 : v11 > v22 ? 1 : 0;
  }
  return v1.toLowerCase() < v2.toLowerCase() ? -1 : v1.toLowerCase() > v2.toLowerCase() ? 1 : 0;
}

function sort(formulas: Formula[], column: string, direction: string): Formula[] {
  if (direction === '') {
    return formulas;
  } else {
    return [...formulas].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(formula: Formula, term: string, pipe: PipeTransform) {
  return formula.name.toLowerCase().includes(term.toLowerCase())
      || formula.description.toLowerCase().includes(term.toLowerCase());
}



@Injectable({
  providedIn: 'root'
})
export class FormulaService {

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _formulas$ = new BehaviorSubject<Formula[]>([]);
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
      this._formulas$.next(result.formulas);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  get formulas$() { return this._formulas$.asObservable(); }
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

  private async getFormulas(): Promise<Formula[]> {
    return await this.http.get<Formula[]>(environment.formulaApiUrl, {responseType: 'json'}).toPromise();
  }

  public async addFromula(body: Formula): Promise<Formula> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Formula>(environment.formulaApiUrl, body, {responseType: 'json', headers}).toPromise();
  }
  public async deleteFormula(id: number): Promise<Formula> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete<Formula>(environment.formulaApiUrl + '/' + id, {responseType: 'json', headers}).toPromise();
  }
  public async editFormula(body: Formula, id: number): Promise<Formula> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Formula>(environment.formulaApiUrl + '/' + id, body, {responseType: 'json', headers}).toPromise();
  }

  private async _search(): Promise<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;
    const dbFormulas = await this.getFormulas();
    let formulas = sort(dbFormulas, sortColumn, sortDirection);
    if (formulas.length === 0) {
      FORMULAS.forEach(FORM => {
        this.addFromula(FORM) ;
      });
    }
    formulas = formulas.filter(product => matches(product, searchTerm, this.pipe));
    const total = formulas.length;
    formulas = formulas.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return {formulas, total};
  }
}
