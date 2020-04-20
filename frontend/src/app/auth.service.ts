import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUrl = `${environment.baseUrl}/auth`;
  private loggedIn: boolean;

  constructor(
    private http: HttpClient
  ) { }

  login(accountName: string, password: string) {
    const url = `${this.authUrl}/login`;
    return this.http.post(url, {accountName, password});
  }

  setSession(payload) {
    delete payload.message;
    localStorage.setItem('session', JSON.stringify(payload));
    this.loggedIn = true;
  }

  isLoggedIn(): boolean {
    if (localStorage.getItem('session') == null) {
      this.loggedIn = false;
      return this.loggedIn;
    } else {
      return true;
    }
  }

  logout() {
    const url = `${this.authUrl}/logout`;
    return this.http.post(url, {}, { observe: 'response' });
  }

  unsetSession(response) {
    if (response.status === 200) {
      this.loggedIn = false;
      localStorage.removeItem('session');
    }
  }
}
