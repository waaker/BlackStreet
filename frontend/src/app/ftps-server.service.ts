import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

import { FtpsServer } from './ftps-server';

@Injectable({
  providedIn: 'root'
})
export class FtpsServerService {

  private ftpsServerUrl = `${environment.baseUrl}/ftps_server`;

  constructor(
    private http: HttpClient
    ) { }

    getFtpsServer(id: number): Observable<FtpsServer> {
      const url = `${this.ftpsServerUrl}/${id}`;
      return this.http.get<FtpsServer>(url);
    }
}
