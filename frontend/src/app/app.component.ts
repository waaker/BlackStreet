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
    this.authService.checkAdmin();
  }

  logout() {
    this.authService.logoutRequest().subscribe(
      (response) => {
        this.authService.unsetSession(response);
      }, (e) => {
        console.error(e);
      }, () => {
        this.router.navigateByUrl('/login');
      }
    );
  }
}
