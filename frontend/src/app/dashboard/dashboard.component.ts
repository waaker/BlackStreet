import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { AccountService } from '../account.service';
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
  private newServerPassword = new FormControl('', [Validators.required]);
  private newServerCertificatePath = new FormControl();
  private hide = true;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private ftpsServerService: FtpsServerService
    ) { }

  ngOnInit() {
    this.newServerForm = this.formBuilder.group({});
    this.newServerForm.addControl('newServerHost', this.newServerHost);
    this.newServerForm.addControl('newServerPort', this.newServerPort);
    this.newServerForm.addControl('newServerUser', this.newServerUser);
    this.newServerForm.addControl('newServerPassword', this.newServerPassword);
    this.newServerForm.addControl('newServerCertificatePath', this.newServerCertificatePath);

    this.accountService.getLoggedAccount().subscribe(
      (response) => {
        this.account = response;
      }, (e) => {
        console.log(e);
      }, () => {
        this.account.ftpsServers.forEach(server => {
          this.ftpsServerService.getFtpsServer(server).subscribe(
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

  onSubmitForm() {
    console.log('Not implemented yet');
  }

}
