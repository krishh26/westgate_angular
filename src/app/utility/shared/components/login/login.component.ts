import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { Patterns } from '../../constant/validation-patterns.const';
import { BaseLogin } from '../../common/base-login';
import { SUCCESS } from '../../constant/response-status.const';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseLogin implements OnInit {

  defaultLoginForm = {
    email: new FormControl("", [Validators.required, Validators.pattern(Patterns.email)]),
    password: new FormControl("", [Validators.required, Validators.pattern(Patterns.password)]),
  };

  loginForm = new FormGroup(this.defaultLoginForm, []);
  loginUser: any;
  showLoader: boolean = false;

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
          this.localStorageService.setLogger(response?.data);
          this.showLoader = false;
          this.router.navigateByUrl('/boss-user/home');
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
