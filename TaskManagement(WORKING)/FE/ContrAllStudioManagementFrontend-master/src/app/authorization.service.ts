import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  userRoles: string[] = [];

  constructor(private auth: AuthService) {
    this.auth.getCurrentUserRoles().then(roles => this.userRoles = roles);
  }

  private matchingRole(allowedRoles): boolean {
    return this.userRoles.includes(allowedRoles);
  }

  get isUser(): boolean {
    const allowed = 'userNormal';
    return this.matchingRole(allowed);
  }

  get isSecretar(): boolean {
    const allowed = 'secretar';
    return this.matchingRole(allowed);
  }

  get isConsultant(): boolean {
    const allowed = 'consultant';
    return this.matchingRole(allowed);
  }

  get isAdmin(): boolean {
    const allowed = 'admin';
    return this.matchingRole(allowed);
  }

}
