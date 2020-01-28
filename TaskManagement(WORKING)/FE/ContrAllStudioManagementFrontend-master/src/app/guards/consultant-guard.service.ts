import { AuthService} from '../auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { Observable, from } from 'rxjs';

@Injectable()
export class ConsultantGuardService implements CanActivate {

  constructor(private _authService: AuthService, private _router: Router) { }

  async checkRoles() {
    // console.error('consultant');
    const roles = await this._authService.getCurrentUserRoles();
    if (roles.indexOf('consultant') !== -1) {
     // console.log(true);

      return true;
    }
    // this._router.navigate(['/dashboard']);
    // console.log(false);

    return false;
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.checkRoles();
  }
}
