import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { Account } from './account';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private accountUrl = `${environment.baseUrl}/account`;

  constructor(
    private http: HttpClient
    ) { }

  getAccountsRequest(): Observable<Account[]> {
    return this.http.get<Account[]>(this.accountUrl, { withCredentials: true });
  }

  updateAccountRequest(id: number, account: Account): Observable<Account> {
    const url = `${this.accountUrl}/${id}`;
    return this.http.put<Account>(url, account, { withCredentials: true });
  }

  deleteAccount(id: number): Observable<Account> {
    const url = `${this.accountUrl}/${id}`;
    return this.http.delete<Account>(url, { withCredentials: true });
  }
}
