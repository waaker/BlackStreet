import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService,
    ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requiresAdmin = route.data.requiresAdmin || false;
    const requiresLogin = route.data.requiresLogin || false;
    const requiresLogout = route.data.requiresLogout || false;
    if (requiresAdmin) {
      if (!this.authService.isAdmin()) {
        this.router.navigateByUrl('/not-found');
      }
    } else if (requiresLogin) {
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
