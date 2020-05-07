import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material';
import { MatSort } from '@angular/material/sort';

import { AccountService } from '../account.service';
import { AuthService } from '../auth.service';
import { FtpsServerService } from '../ftps-server.service';

import { Account } from '../account';
import { Entry } from '../entry';
import { FtpsServer } from '../ftps-server';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @Input() account: Account;
  @Input() ftpsServers: FtpsServer[] = [];
  private newServerForm: FormGroup;
  private newServerHost = new FormControl('', [Validators.required]);
  private newServerPort = new FormControl(21, [Validators.required]);
  private newServerUser = new FormControl('', [Validators.required]);
  private newServerSecured = new FormControl({value: true, disabled: true});
  private newServerPassword = new FormControl('', [Validators.required]);
  private newServerCertificatePath = new FormControl('', [Validators.required]);
  private hide = true;
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatSort) sort: MatSort;
  private columnsTransferTables: string[] = ['type', 'name', 'size', 'rawModifiedAt'];
  private selectedEntry: string = null;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private authService: AuthService,
    private ftpsServerService: FtpsServerService
    ) { }

  ngOnInit() {
    this.newServerForm = this.formBuilder.group({});
    this.newServerForm.addControl('newServerHost', this.newServerHost);
    this.newServerForm.addControl('newServerPort', this.newServerPort);
    this.newServerForm.addControl('newServerUser', this.newServerUser);
    this.newServerForm.addControl('newServerPassword', this.newServerPassword);
    this.newServerForm.addControl('newServerSecured', this.newServerSecured);
    this.newServerForm.addControl('newServerCertificatePath', this.newServerCertificatePath);

    this.accountService.getLoggedAccount().subscribe(
      (response) => {
        this.account = response;
      }, (e) => {
        console.log(e);
      }, () => {
        this.account.ftpsServers.forEach(serverId => {
          this.ftpsServerService.getFtpsServerRequest(serverId).subscribe(
            async (server) => {
              await this.checkConnectionStatus(server);
              server.entries = new MatTableDataSource([]);
              this.ftpsServers.push(server);
              if (server.connected) {
                this.listEntries(server, '/');
              }
            }, (e) => {
              console.log(e);
            }
          );
        });
      }
    );
  }

  toggleConnect(ftpsServer: FtpsServer) {
    if (!ftpsServer.connected) {
      this.connect(ftpsServer);
    } else {
      this.disconnect(ftpsServer);
    }
  }

  connect(ftpsServer: FtpsServer) {
    this.ftpsServerService.connect(ftpsServer._id).subscribe(
      () => {
        ftpsServer.connected = true;
        this.listEntries(ftpsServer, '/');
      }, (e: Error) => {
        console.error(e);
      }
    );
  }

  async checkConnectionStatus(ftpsServer: FtpsServer) {
    await this.ftpsServerService.isConnected(ftpsServer._id).toPromise().then(
      (response: object) => {
        ftpsServer.connected = JSON.parse(JSON.stringify(response)).isConnected;
      }, (e: Error) => {
        ftpsServer.connected = JSON.parse(JSON.stringify(e)).error.isConnected;
      }
    );
  }

  disconnect(ftpsServer: FtpsServer) {
    this.ftpsServerService.disconnect(ftpsServer._id).subscribe(
      () => {
        ftpsServer.connected = false;
      }, () => {
        this.checkConnectionStatus(ftpsServer);
      }
    );
  }

  deleteFtpsServer(ftpsServer: FtpsServer) {
    this.ftpsServerService.deleteFtpsServerRequest(ftpsServer._id).subscribe(
      () => {
        location.reload();
      }, (e) => {
        console.error(e);
      }
    );
  }

  toggleSecured() {
    this.newServerCertificatePath.enabled ? this.newServerCertificatePath.disable() : this.newServerCertificatePath.enable();
  }

  submitNewServerForm() {
    const ftpsServer: FtpsServer = {
      host: this.newServerHost.value,
      port: this.newServerPort.value,
      user: this.newServerUser.value,
      password: this.newServerPassword.value,
      certificate_path: this.newServerCertificatePath.value,
    };
    this.ftpsServerService.createFtpsServerRequest(ftpsServer).subscribe(
      () => {
        location.reload();
      }, (e) => {
        console.error(e);
      }
    );
  }

  listEntries(ftpsServer: FtpsServer, path: string) {
    ftpsServer.entries.data = [];
    this.ftpsServerService.list(ftpsServer._id, path).subscribe(
      (response: Entry[]) => {
        response.forEach((entry: Entry) => {
          ftpsServer.entries.data.push({
            name: entry.name,
            type: entry.type,
            size: entry.size,
            rawModifiedAt: entry.rawModifiedAt
          });
          ftpsServer.entries.sort = this.sort;
        });
        this.table.renderRows();
      }, (e: Error) => {
        console.error(e);
        this.checkConnectionStatus(ftpsServer);
      }
    );
  }

  applyFilter(event: Event, ftpsServer: FtpsServer) {
    const filterValue = (event.target as HTMLInputElement).value;
    ftpsServer.entries.filter = filterValue.trim().toLowerCase();
  }

  clickRow(name: string) {
    this.selectedEntry = (this.selectedEntry === name) ? null : name;
  }

  dblclickRow(ftpsServer: FtpsServer, type: number, path: string) {
    if (type === 2) {
      this.selectedEntry = null;
      this.listEntries(ftpsServer, path);
    }
  }

}
