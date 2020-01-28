import { AuthService} from '../auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { GUARDS } from './GUARDS';
import { AdminGuardService } from './admin-guard.service';
import { ConsultantGuardService } from './consultant-guard.service';
import { SecretarGuardService } from './secretar-guard.service';
import { NormalUserGuardService } from './normalUser-guard.service';

@Injectable()
export class MasterGuard implements CanActivate {


constructor(
    private adminGuard: AdminGuardService,
    private consultantGuard: ConsultantGuardService,
    private secretarGuard: SecretarGuardService,
    private normalUserGuard: NormalUserGuardService,
    private _authService: AuthService,
    private _router: Router) { }

    private route: ActivatedRouteSnapshot;
    private state: RouterStateSnapshot;


    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        this.route = route;
        this.state = state;

        if (!route.data) {
            return true;
        }

        if (!this.route.data.guards || !this.route.data.guards.length) {
            return true;
        }

        const aux = await this.executeGuards();

        return aux;
    }

    private async executeGuards(): Promise<any> {
        const guards = this.route.data.guards.map(guard => {
            const r = this.activateGuard(guard);
            return r;
        });

        const res = await Promise.all(guards);
        const permitted = res.reduce((collector, current) => collector || current, false);

        return permitted;
    }

    private async activateGuard(guardKey: string): Promise<boolean> {

        let guard: AdminGuardService | ConsultantGuardService | SecretarGuardService | NormalUserGuardService;
        switch (guardKey) {
            case GUARDS.GUARD1:
                guard = this.adminGuard;
                break;
            case GUARDS.GUARD2:
                guard = this.consultantGuard;
                break;
            case GUARDS.GUARD3:
                guard = this.secretarGuard;
                break;
            case GUARDS.GUARD4:
                guard = this.normalUserGuard;
                break;
            default:
                break;
        }
        const res = await guard.canActivate(this.route, this.state);
        if (res) {
            return true;
        } else {
            return false;
        }
    }

}
