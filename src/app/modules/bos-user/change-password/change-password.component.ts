import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {

  changePassword = {
    newPassword: new FormControl("", [Validators.required]),
    oldPassword: new FormControl("", [Validators.required]),
  };
  showLoader: boolean = false;
  changePasswordForm = new FormGroup(this.changePassword, []);
  showOldPassword = false;
  showNewPassword = false;
  loginUser: any;
  password = 'password';
  confirmPassword = 'password';
  showPassword = false;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private localStorageService: LocalStorageService,
    private router: Router,
  ) {

    this.loginUser = this.localStorageService.getLogger();
  }

  ngOnInit(): void {
    
  }


  forgotpassword(): void {
    this.changePasswordForm.markAllAsTouched();
    if (this.changePasswordForm.valid) {
      this.showLoader = true;
      this.authService.changePassword(this.changePasswordForm.value, this.loginUser?._id).subscribe((response) => {
        if (response?.status == true) {
          this.showLoader = false;
          this.router.navigateByUrl('/');
          this.notificationService.showSuccess(response?.message || 'Password change successfully');
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
