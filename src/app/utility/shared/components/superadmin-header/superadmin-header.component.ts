import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-superadmin-header',
  templateUrl: './superadmin-header.component.html',
  styleUrls: ['./superadmin-header.component.scss']
})
export class SuperadminHeaderComponent {
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
    { title: 'Dashboard', route: ['/super-admin/super-admin-dashboard'] },
    // { title: 'Projects', route: ['/super-admin/super-admin-projects-all'] },
    { title: 'Supplier', route: ['/super-admin/super-admin-supplier'] },
    // { title: 'Register Supplier', route: ['/super-admin/add-new-supplier'] },
    { title: 'Project Tracker', route: ['/super-admin/status-wise-tracker'] },
    { title: 'TO DO Tasks', route: ['/super-admin/todo-tasks'] },
    { title: 'Gap Analysis', route: ['/super-admin/gap-analysis'] },
  ];


  logout(): void {
    this.authService.logout();
  }

}
