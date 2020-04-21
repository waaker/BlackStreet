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

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    public authService: AuthService
  ) { }
  loginForm: FormGroup;
  accountName = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  loginError = false;
  hide = true;

  ngOnInit() {
    this.loginForm = this.formBuilder.group({});
    this.loginForm.addControl('accountName', this.accountName);
    this.loginForm.addControl('password', this.password);
  }

  onSubmitForm() {
    this.loginError = false;
    this.authService.loginRequest(this.accountName.value, this.password.value).subscribe(
      (loginResponse) => {
        this.authService.setSession(loginResponse);
        this.authService.checkRoleRequest().then(
          (checkRoleResponse) => {
            this.authService.setRole(checkRoleResponse);
          },
          (error) => {
            this.authService.setRole(error);
          }
        );
      }, (e) => {
        this.loginError = true;
        console.error(e);
      }, () => {
        this.router.navigateByUrl('/dashboard');
      }
    );
  }
}
