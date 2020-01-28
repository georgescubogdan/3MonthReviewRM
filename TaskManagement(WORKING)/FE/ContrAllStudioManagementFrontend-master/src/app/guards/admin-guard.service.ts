import { AuthService} from '../auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { Observable, from } from 'rxjs';

@Injectable()
export class AdminGuardService implements CanActivate {

constructor(private _authService: AuthService, private _router: Router) { }

    async checkRoles() {
        const roles = await this._authService.getCurrentUserRoles();
        if (roles.indexOf('admin') !== -1) {
            return true;
        } else {
          // console.error(roles);
          // this._router.navigate(['/dashboard']);
          return false;
        }
    }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.checkRoles();
  }

}
