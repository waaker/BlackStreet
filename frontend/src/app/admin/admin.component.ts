import { Component, OnInit, Input } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';

import { AccountService } from '../account.service';
import { AuthService } from '../auth.service';
import { FtpsServerService } from '../ftps-server.service';

import { Account } from '../account';
import { FtpsServer } from '../ftps-server';
import { config } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  private loggedAccount: Account;
  @Input() accounts: Account[];
  @Input() ftpsServers: FtpsServer[];
  private hide = true;
  private validatePassword: string;

  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    private ftpsServerService: FtpsServerService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.authService.getLoggedAccountRequest().subscribe(
      (loggedAccount: Account) => {
        this.loggedAccount = loggedAccount;
      }, (e: Error) => {
        console.error(e);
      }
    );
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
    if (account.accountName.length === 0) {
      this.snackBar.open('Account name cannot be empty.', null, {
        duration: 3000
      });
    } else if (!account.password || account.password.length === 0) {
      this.snackBar.open('Password cannot be empty.', null, {
        duration: 3000
      });
    } else if (account.password !== this.validatePassword) {
      this.snackBar.open('Passwords are not identical.', null, {
        duration: 3000
      });
    } else {
      console.log(account);
      this.accountService.updateAccountRequest(account).subscribe(
        (response: Account) => {
          location.reload();
        }, (e: Error) => {
          console.error(e);
        }
      );
    }
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
    this.ftpsServerService.updateFtpsServerRequest(ftpsServer).subscribe(
      (response: FtpsServer) => {
        location.reload();
      }, (e: Error) => {
        console.error(e);
      }
    );
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
