import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth-service/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-feasibility-header',
  templateUrl: './feasibility-header.component.html',
  styleUrls: ['./feasibility-header.component.scss']
})
export class FeasibilityHeaderComponent {

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
    { title: 'My Projects', route: ['/feasibility-user/feasibility-project-list'] },
    { title: 'TO DO TASKS', route: ['/feasibility-user/feasibility-todo-task'] },

  ];

  logout(): void {
    this.authService.logout();
  }

}
