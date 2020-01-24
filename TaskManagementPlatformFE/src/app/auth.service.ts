import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Subject, Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _userNameSubject: Subject<string> = new ReplaySubject<string>(1);
  public userName$: Observable<string> = this._userNameSubject.asObservable();

  constructor(private http: HttpClient, private _router: Router) { }

  getCurrentUserName(): Promise<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
    .get(environment.identityApiUrl + '/GetUserFullName', {responseType: 'text', headers}).toPromise();
  }

  public async register(body: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(environment.identityApiUrl + '/Register', body, { headers , responseType: 'text' }).toPromise();
  }

  login(email, password) {
    const body = JSON.stringify({ email, password });
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
    .post(
      environment.identityApiUrl + '/Login',
      body,
      { headers , responseType: 'text'}
      )
      .toPromise()
      .then(async authKey => {
        localStorage.setItem('auth_key', authKey);
        this.getCurrentUserName()
        .then(name => {
          this._userNameSubject.next(name);
        })
        .catch(err => {
          console.error(err);
        });

      });
    }

    isAuthenticated(): boolean {
      return localStorage.getItem('auth_key') != null && !this.isTokenExpired();
    }

    isTokenExpired(): boolean {
      return false;
    }

    logout() {
      localStorage.removeItem('auth_key');
      this._userNameSubject.next(null);
      this._router.navigate(['/login']);
    }
  }
