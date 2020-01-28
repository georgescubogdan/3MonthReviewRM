import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, newRequest: HttpHandler): Observable<HttpEvent<any>> {
    const tokenInfo = localStorage.getItem('auth_key');
    if (tokenInfo && request.url.indexOf('Login') === -1 || request.url.indexOf('Register') === -1) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${tokenInfo}`,
        }
      });
    }
    return newRequest.handle(request);
  }
}
