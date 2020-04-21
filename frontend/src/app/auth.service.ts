import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../environments/environment';

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

  loginRequest(accountName: string, password: string) {
    const url = `${this.authUrl}/login`;
    return this.http.post(url, {accountName, password});
  }

  setSession(payload) {
    delete payload.message;
    localStorage.setItem('session', JSON.stringify(payload));
    this.loggedIn = true;
  }

  checkRoleRequest(): Promise<object> {
    const url = `${this.authUrl}/isAdmin`;
    const accountInfo = localStorage.getItem('session');
    return this.http.post(url, { accountInfo }).toPromise();
  }

  setRole(response) {
    this.admin = JSON.parse(JSON.stringify(response)).isAdmin;
  }

  isLoggedIn(): boolean {
    if (localStorage.getItem('session') == null) {
      this.loggedIn = false;
      return this.loggedIn;
    } else {
      return true;
    }
  }

  isAdmin() {
    return this.admin;
  }

  logoutRequest() {
    const url = `${this.authUrl}/logout`;
    return this.http.post(url, {}, { observe: 'response' });
  }

  unsetSession(response) {
    if (response.status === 200) {
      this.loggedIn = false;
      localStorage.removeItem('session');
    }
  }

  unsetRole(response) {
    if (response.status === 200) {
      this.admin = false;
    }
  }
}
