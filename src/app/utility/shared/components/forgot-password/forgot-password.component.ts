import { Component, OnInit } from '@angular/core';
import { BaseLogin } from '../../common/base-login';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Patterns } from '../../constant/validation-patterns.const';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent extends BaseLogin implements OnInit {

  loginUser: any;
  showLoader: boolean = false;

  forgotPasswordForm = {
    email: new FormControl("", [Validators.required, Validators.pattern(Patterns.email)]),
    role: new FormControl("", Validators.required)
  };

  forgotForm = new FormGroup(this.forgotPasswordForm, []);

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
    // if (this.loginUser) {
    //   this.router.navigateByUrl('/boss-user/home');
    // }
  }

  forgotpassword(): void {
    this.forgotForm.markAllAsTouched();
    if (this.forgotForm.valid) {
      this.showLoader = true;
      this.authService.forgotPassword(this.forgotForm.value).subscribe((response) => {
        if (response?.status == true) {
          this.showLoader = false;
          this.router.navigateByUrl('/');
          this.notificationService.showSuccess(response?.message || 'Email sent successfully');
          console.log(response?.data);

        } else if (response?.data == null) {
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
