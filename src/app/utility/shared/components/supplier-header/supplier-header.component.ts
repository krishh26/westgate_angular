import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-supplier-header',
  templateUrl: './supplier-header.component.html',
  styleUrls: ['./supplier-header.component.scss']
})
export class SupplierHeaderComponent {
  loginUser: any;

  constructor(
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    public router: Router,
  ) {
    this.loginUser = this.localStorageService.getLogger();
  }

  navUrlArr = [
    { titel: 'Dashboard', route: ['/supplier-admin/supplier-dashboard-header'] },
    { titel: 'Projects', route: ['/supplier-admin/project-list'] },
    { titel: 'Case Studies', route: ['/supplier-admin/case-studies-list'] },
    { titel: 'Manage Users', route: ['/supplier-admin/manage-user'] },
  ];

  logout(): void {
    this.authService.logout();
  }
}
