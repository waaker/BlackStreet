import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private loginForm: FormGroup;
  private accountName = new FormControl('', [Validators.required]);
  private password = new FormControl('', [Validators.required]);
  private loginError = false;
  private hide = true;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
    ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({});
    this.loginForm.addControl('accountName', this.accountName);
    this.loginForm.addControl('password', this.password);
  }

  onSubmitForm() {
    this.loginError = false;
    this.authService.loginRequest(this.accountName.value, this.password.value).subscribe(
      () => {
        this.loginError = false;
        this.authService.setLoggedIn(true);
        this.authService.isAdminRequest().subscribe(
          () => {
            this.authService.setAdmin(true);
          }, (e: Error) => {
            console.error(e);
            this.authService.setAdmin(false);
          }, () => {
            this.router.navigateByUrl('/dashboard');
          }
        );
      }, (e: Error) => {
        console.error(e);
        this.loginError = true;
      }
    );
  }
}
