import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService,
    ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
    const requiresLogin = route.data.requiresLogin || false;
    const requiresLogout = route.data.requiresLogout || false;
    if (requiresLogin) {
      if (!this.authService.isLoggedIn()) {
        this.router.navigateByUrl('/login');
      }
    } else if (requiresLogout) {
      if (this.authService.isLoggedIn()) {
        this.router.navigateByUrl('/dashboard');
      }
    }
    return true;
  }
}
