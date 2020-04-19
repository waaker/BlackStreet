import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUrl = `${environment.baseUrl}/auth`;

  constructor(
    private http: HttpClient
  ) { }

  login(accountName: string, password: string) {
    const url = `${this.authUrl}/login`;
    return this.http.post(url, {accountName, password});
  }
}
