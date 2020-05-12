import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';

import { AccountService } from '../account.service';
import { AuthService } from '../auth.service';
import { FtpsServerService } from '../ftps-server.service';

import { Account } from '../account';
import { FtpsServer } from '../ftps-server';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  private ready = false;
  private loggedAccount: Account;
  @Input() accounts: Account[];
  @Input() ftpsServers: FtpsServer[];
  private hide = true;
  private validatePassword: string;
  private newAccountForm: FormGroup;
  private newAccountName = new FormControl('', [Validators.required]);
  private newAccountPassword = new FormControl('', [Validators.required]);
  private newAccountRole = new FormControl('user', [Validators.required]);

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private authService: AuthService,
    private ftpsServerService: FtpsServerService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.newAccountForm = this.formBuilder.group({});
    this.newAccountForm.addControl('newAccountName', this.newAccountName);
    this.newAccountForm.addControl('newAccountPassword', this.newAccountPassword);
    this.newAccountForm.addControl('newAccountRole', this.newAccountRole);

    this.authService.getLoggedAccountRequest().subscribe(
      (loggedAccount: Account) => {
        this.loggedAccount = loggedAccount;
        this.accountService.getAccountsRequest().subscribe(
          (accounts: Account[]) => {
            this.accounts = accounts;
            this.ftpsServerService.getFtpsServersRequest().subscribe(
              (ftpsServers: FtpsServer[]) => {
                this.ftpsServers = ftpsServers;
                this.ready = true;
              }, (e: Error) => {
                console.error(e);
              }
            );
          }, (e: Error) => {
            console.error(e);
          }
        );
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
    this.accountService.deleteAccountRequest(account._id).subscribe(
      () => {
        location.reload();
      }, (e: Error) => {
        console.error(e);
      }
    );
  }

  submitNewAccountForm() {
    const account: Account = {
      accountName: this.newAccountName.value,
      password: this.newAccountPassword.value,
      role: this.newAccountRole.value
    };
    this.accountService.createAccountRequest(account).subscribe(
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
