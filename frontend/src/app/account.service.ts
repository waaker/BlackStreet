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
}
