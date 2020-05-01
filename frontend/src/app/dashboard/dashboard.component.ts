import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { AccountService } from '../account.service';
import { AuthService } from '../auth.service';
import { FtpsServerService } from '../ftps-server.service';

import { Account } from '../account';
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

  constructor(
    private router: Router,
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
        this.account.ftpsServers.forEach(server => {
          this.ftpsServerService.getFtpsServerRequest(server).subscribe(
            (response) => {
              this.ftpsServers.push(response);
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
      }, (e: Error) => {
        console.error(e);
      }
    );
  }

  disconnect(ftpsServer: FtpsServer) {
    this.ftpsServerService.disconnect(ftpsServer._id).subscribe(
      () => {
        ftpsServer.connected = false;
      }, () => {
        this.ftpsServerService.isConnected(ftpsServer._id).subscribe(
          (response) => {
            ftpsServer.connected = JSON.parse(JSON.stringify(response)).isConnected;
          }, (e: Error) => {
            console.error(e);
          }
        );
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
      account: this.authService.loggedInAccountID(),
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

}
