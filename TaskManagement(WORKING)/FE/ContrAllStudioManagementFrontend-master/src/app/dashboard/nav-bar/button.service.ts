import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject, Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ButtonService {

  constructor(private http: HttpClient) {
  }


  public async getButtonState(crtDate: any): Promise<string> {
    let params = new HttpParams();
    params = params.append('crtDate', crtDate);
    return await this.http.get<any>(environment.userApiUrl + '/GetButtonState',
      {
      params,
      responseType: 'text' as 'json'
    }).toPromise();

  }


   public async addClocking(crtDate: any): Promise<string> {
   const body = {CurrentDate: crtDate};
   let headers = new HttpHeaders();
   headers = headers.append('content-type', 'application/json');
   return this.http.post<any>(environment.userApiUrl + '/ChangeButtonState', body,
   {
      headers,
      responseType: 'text' as 'json'
    }).toPromise();
 }

}
