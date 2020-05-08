import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

import { Entry } from './entry';
import { FtpsServer } from './ftps-server';

@Injectable({
  providedIn: 'root'
})
export class FtpsServerService {

  private ftpsServerUrl = `${environment.baseUrl}/ftps_server`;

  constructor(
    private http: HttpClient
    ) { }

    getFtpsServersRequest(): Observable<FtpsServer[]> {
      return this.http.get<FtpsServer[]>(this.ftpsServerUrl, { withCredentials: true });
    }

    createFtpsServerRequest(ftpsServer: FtpsServer): Observable<FtpsServer> {
      return this.http.post<FtpsServer>(this.ftpsServerUrl, ftpsServer, { withCredentials: true });
    }

    getFtpsServerRequest(id: number): Observable<FtpsServer> {
      const url = `${this.ftpsServerUrl}/${id}`;
      return this.http.get<FtpsServer>(url, { withCredentials: true });
    }

    updateFtpsServerRequest(id: number, ftpsServer: FtpsServer): Observable<FtpsServer> {
      const url = `${this.ftpsServerUrl}/${id}`;
      return this.http.put<FtpsServer>(url, ftpsServer, { withCredentials: true });
    }

    deleteFtpsServerRequest(id: number): Observable<FtpsServer> {
      const url = `${this.ftpsServerUrl}/${id}`;
      return this.http.delete<FtpsServer>(url, { withCredentials: true });
    }

    connect(id: number): Observable<object> {
      const url = `${this.ftpsServerUrl}/${id}/connect`;
      return this.http.get<object>(url, { withCredentials: true });
    }

    isConnected(id: number): Observable<object> {
      const url = `${this.ftpsServerUrl}/${id}/isConnected`;
      return this.http.get<object>(url, { withCredentials: true });
    }

    disconnect(id: number): Observable<object> {
      const url = `${this.ftpsServerUrl}/${id}/disconnect`;
      return this.http.get<object>(url, { withCredentials: true });
    }

    list(id: number, path: string = '/'): Observable<Entry[]> {
      const url = `${this.ftpsServerUrl}/${id}/list`;
      return this.http.post<Entry[]>(url, {path}, { withCredentials: true });
    }
}
