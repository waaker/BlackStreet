import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

import { Account } from './account';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUrl = `${environment.baseUrl}/auth`;
  private loggedIn = false;
  private admin = false;

  constructor(
    private http: HttpClient
  ) { }

  loginRequest(accountName: string, password: string): Observable<object> {
    const url = `${this.authUrl}/login`;
    return this.http.post(url, {accountName, password}, { withCredentials: true });
  }

  isLoggedInRequest(): Observable<object> {
    const url = `${this.authUrl}/isLoggedIn`;
    return this.http.get(url, { withCredentials: true });
  }

  setLoggedIn(loggedIn: boolean) {
    this.loggedIn = loggedIn;
  }

  getLoggedIn(): boolean {
    return this.loggedIn;
  }

  getLoggedAccountRequest(): Observable<Account> {
    const url = `${this.authUrl}/loggedAccount`;
    return this.http.get<Account>(url, { withCredentials: true });
  }

  isAdminRequest(): Observable<object> {
    const url = `${this.authUrl}/isAdmin`;
    return this.http.get(url, { withCredentials: true });
  }

  setAdmin(admin: boolean) {
    this.admin = admin;
  }

  getAdmin() {
    return this.admin;
  }

  logoutRequest(): Observable<HttpResponse<object>> {
    const url = `${this.authUrl}/logout`;
    return this.http.post(url, {}, { observe: 'response', withCredentials: true });
  }
}
