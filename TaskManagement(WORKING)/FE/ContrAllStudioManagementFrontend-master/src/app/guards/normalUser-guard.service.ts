import { AuthService} from '../auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { Observable, from } from 'rxjs';

@Injectable()
export class NormalUserGuardService implements CanActivate {

constructor(private _authService: AuthService, private _router: Router) { }

    async checkRoles() {
        const roles = await this._authService.getCurrentUserRoles();
        if (roles.indexOf('normalUser') !== -1) {
            return true;
        }
        // this._router.navigate(['/dashboard']);
        return false;
    }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.checkRoles();
  }
}
