import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private router: Router, public authService: AuthService) { }

  logout() {
    this.authService.logout().subscribe(
      response =>
        this.authService.unsetSession(response), (e) => {
          console.error(e);
        },
      () => this.router.navigateByUrl('/')
    );
  }
}
