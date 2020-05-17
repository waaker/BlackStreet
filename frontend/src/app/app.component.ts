import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService
    ) { }

  ngOnInit() {
    this.initApp();
  }

  initApp() {
    const url = location.pathname;
    this.authService.isLoggedInRequest().subscribe(
      () => {
        this.authService.setLoggedIn(true);
        this.authService.isAdminRequest().subscribe(
            () => {
              this.authService.setAdmin(true);
            }, () => {
              this.authService.setAdmin(false);
              if (url !== '/' && url !== '/login') {
                this.router.navigateByUrl(url);
              } else {
                this.router.navigateByUrl('/dashboard');
              }
            }, () => {
              if (url !== '/' && url !== '/login') {
                this.router.navigateByUrl(url);
              } else {
                this.router.navigateByUrl('/dashboard');
              }
            }
          );
        }, () => {
          this.authService.setLoggedIn(false);
          this.router.navigateByUrl('/login');
      }
    );
  }

  logout() {
    this.authService.logoutRequest().subscribe(
      () => {
        this.authService.setLoggedIn(false);
        this.authService.setAdmin(false);
      }, (e) => {
        console.error(e);
      }, () => {
        this.router.navigateByUrl('/login');
      }
    );
  }
}
