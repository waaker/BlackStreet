import { Component, OnInit, Input } from '@angular/core';

import { AccountService } from '../account.service';
import { FtpsServerService } from '../ftps-server.service';

import { Account } from '../account';
import { FtpsServer } from '../ftps-server';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  @Input() accounts: Account[];
  @Input() ftpsServers: FtpsServer[];
  private hide = true;

  constructor(
    private accountService: AccountService,
    private ftpsServerService: FtpsServerService,
  ) { }

  ngOnInit() {
    this.accountService.getAccountsRequest().subscribe(
      (accounts: Account[]) => {
        this.accounts = accounts;
      }, (e: Error) => {
        console.error(e);
      }
    );
    this.ftpsServerService.getFtpsServersRequest().subscribe(
      (ftpsServers: FtpsServer[]) => {
        this.ftpsServers = ftpsServers;
      }, (e: Error) => {
        console.error(e);
      }
    );
  }

  updateAccount(account: Account) {
    console.log('Not implemented yet');
  }

  deleteAccount(account: Account) {
    this.accountService.deleteAccount(account._id).subscribe(
      () => {
        location.reload();
      }, (e: Error) => {
        console.error(e);
      }
    );
  }

  getAccountName(id: number): string {
    for (const account of this.accounts) {
      if (account._id === id) {
        return account.accountName;
      }
    }
    return null;
  }

  updateFtpsServer(ftpsServer: FtpsServer) {
    console.log('Not implemented yet');
  }

  deleteFtpsServer(ftpsServer: FtpsServer) {
    this.ftpsServerService.deleteFtpsServerRequest(ftpsServer._id).subscribe(
      () => {
        location.reload();
      }, (e: Error) => {
        console.error(e);
      }
    );
  }

}
