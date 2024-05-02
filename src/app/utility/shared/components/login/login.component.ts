import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { Patterns } from '../../constant/validation-patterns.const';
import { BaseLogin } from '../../common/base-login';
import { SUCCESS } from '../../constant/response-status.const';
import { jwtDecode } from "jwt-decode";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseLogin implements OnInit {

  defaultLoginForm = {
    email: new FormControl("", [Validators.required, Validators.pattern(Patterns.email)]),
    password: new FormControl("", [Validators.required, Validators.pattern(Patterns.password)]),
    role: new FormControl("", [Validators.required]),
  };

  loginForm = new FormGroup(this.defaultLoginForm, []);
  loginUser: any;
  showLoader: boolean = false;
  tokenDecode: any;
  loginDetails: any;

  constructor(
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    super()
    this.loginUser = this.localStorageService.getLogger();
  }

  ngOnInit(): void {
    if (this.loginUser) {
      this.router.navigateByUrl('/boss-user/home');
    }
  }

  // Function to use for the login the user
  login(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      this.showLoader = true;
      this.authService.loginUser(this.loginForm.value).subscribe((response) => {
        if (response?.status == true) {
          this.localStorageService.setLoginToken(response?.data);
          this.showLoader = false;
          console.log(response?.data);
          this.tokenDecode = response?.data?.token;
          const decoded = jwtDecode(this.tokenDecode);
          this.loginDetails = decoded;
          this.localStorageService.setLogger(this.loginDetails);
          if (this.loginDetails?.role == 'BOS') {
            this.router.navigateByUrl('/boss-user/home');
          } else if (this.loginDetails?.role == 'SupplierAdmin') {
            this.router.navigateByUrl('/supplier-admin/supplier-home');
          } else if (this.loginDetails?.role == 'FeasibilityUser') {
            this.router.navigateByUrl('/feasibility-user/feasibility-project-list');
          } else if (this.loginDetails?.role == 'ProjectManager') {
            this.router.navigateByUrl('/project-manager/dashboard');
          }
          this.notificationService.showSuccess(response?.message || 'User login successfully');
        } else {
          this.showLoader = false;
          this.notificationService.showError(response?.message);
        }
      }, (error) => {
        this.showLoader = false;
        this.notificationService.showError(error?.message || 'Something went wrong!');
      })
    }
  }
}
