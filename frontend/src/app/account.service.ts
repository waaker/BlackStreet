import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { AuthService } from './auth.service';

import { Account } from './account';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private accountUrl = `${environment.baseUrl}/account`;

  constructor(
    private authService: AuthService,
    private http: HttpClient
    ) { }

    getLoggedAccount(): Observable<Account> {
      const userInfo = localStorage.getItem('session');
      const userId = JSON.parse(userInfo).id;
      const url = `${this.accountUrl}/${userId}`;
      return this.http.get<Account>(url);
    }
}
