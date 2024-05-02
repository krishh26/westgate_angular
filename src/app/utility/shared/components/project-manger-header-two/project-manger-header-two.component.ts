import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';

@Component({
  selector: 'app-project-manger-header-two',
  templateUrl: './project-manger-header-two.component.html',
  styleUrls: ['./project-manger-header-two.component.scss']
})
export class ProjectMangerHeaderTwoComponent {
  loginUser: any;

  constructor(
    private authService: AuthService,
    private localStorageService: LocalStorageService,
  ) {
    this.loginUser = this.localStorageService.getLogger();
  }

  logout(): void {
    this.authService.logout();
  }
}
