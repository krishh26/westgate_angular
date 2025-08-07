import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';


@Component({
  selector: 'app-process-manager-header',
  templateUrl: './process-manager-header.component.html',
  styleUrls: ['./process-manager-header.component.scss']
})
export class ProcessManagerHeaderComponent {

  loginUser: any;
  isMobileNavOpen = false;
  isDropdownOpen = false;

  constructor(
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    public router: Router,
    private notificationService: NotificationService,
  ) {
    this.loginUser = this.localStorageService.getLogger();
  }

  navUrlArr = [
    { title: 'Dashboard', route: '/process-manager/dashboard-process-manager' },
    { title: 'Project Tracker', route: '/process-manager/process-manager-tracker' },
    { title: 'TO DO TASKS', route: '/process-manager/to-do-tasks-process-manager' },
    { title: 'Case Studies', route: '/process-manager/case-studies' }
  ];


  logout(): void {
    this.authService.logout();
    this.closeMobileNav();
  }

  // Toggle Mobile Navigation
  toggleMobileNav() {
    this.isMobileNavOpen = !this.isMobileNavOpen;
  }

  // Close Mobile Navigation when clicking a link
  closeMobileNav() {
    this.isMobileNavOpen = false;
    this.isDropdownOpen = false;
  }

  // Toggle Dropdown Menu
  toggleDropdown(event: Event) {
    event.stopPropagation(); // Prevents event bubbling
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
