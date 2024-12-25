import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';


@Component({
  selector: 'app-feasibility-manager-header',
  templateUrl: './feasibility-manager-header.component.html',
  styleUrls: ['./feasibility-manager-header.component.scss']
})
export class FeasibilityManagerHeaderComponent {

  loginUser: any;

  constructor(
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    public router: Router,
    private notificationService: NotificationService,
  ) {
    this.loginUser = this.localStorageService.getLogger();
  }

  navUrlArr = [
    // { title: 'Home', route: ['/boss-user/home'] },
    // { title: 'Live Projects', route: ['/boss-user/project-list'] },
    { title: 'TO DO TASKS', route: ['/process-manager/to-do-tasks-process-manager'] },

  ];


  logout(): void {
    this.authService.logout();
  }


}
